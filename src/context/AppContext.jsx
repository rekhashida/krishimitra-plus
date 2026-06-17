import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { t as translate } from '../i18n/translations'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [userType, setUserType] = useState(() => localStorage.getItem('km_user_type') || null)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('km_user_profile')
    return saved ? JSON.parse(saved) : null
  })
  const [language, setLanguageState] = useState(() => localStorage.getItem('km_language') || null)
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)

  const setLanguage = (lang) => {
    setLanguageState(lang)
    localStorage.setItem('km_language', lang)
  }

  const t = useCallback(
    (key, vars) => translate(language || 'en', key, vars),
    [language]
  )

  useEffect(() => {
    document.documentElement.lang = language || 'en'
  }, [language])

  useEffect(() => {
    if (userType) localStorage.setItem('km_user_type', userType)
  }, [userType])

  useEffect(() => {
    if (userProfile) localStorage.setItem('km_user_profile', JSON.stringify(userProfile))
  }, [userProfile])

  // --- AUTH: load session + listen for changes ---
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthLoading(false)
      setProfileLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // --- When session changes, load matching farmer/worker profile ---
  useEffect(() => {
    async function loadProfile() {
      if (!isSupabaseConfigured()) {
        setProfileLoading(false)
        return
      }
      if (!session?.user) {
        setProfileLoading(false)
        return
      }
      setProfileLoading(true)
      const userId = session.user.id

      const { data: farmer } = await supabase.from('farmers').select('*').eq('user_id', userId).maybeSingle()
      if (farmer) {
        setUserType('farmer')
        setUserProfile(farmer)
        setProfileLoading(false)
        return
      }
      const { data: worker } = await supabase.from('workers').select('*').eq('user_id', userId).maybeSingle()
      if (worker) {
        setUserType('worker')
        setUserProfile(worker)
        setProfileLoading(false)
        return
      }
      // Authenticated but hasn't completed registration yet
      setUserType(null)
      setUserProfile(null)
      setProfileLoading(false)
    }
    loadProfile()
  }, [session])

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    setSession(null)
    setUserType(null)
    setUserProfile(null)
    localStorage.removeItem('km_user_type')
    localStorage.removeItem('km_user_profile')
  }

  return (
    <AppContext.Provider
      value={{
        userType,
        setUserType,
        userProfile,
        setUserProfile,
        language,
        setLanguage,
        t,
        logout,
        session,
        authLoading,
        profileLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}