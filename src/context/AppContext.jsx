import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { t as translate } from '../i18n/translations'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [userType, setUserType] = useState(() => localStorage.getItem('km_user_type') || null)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('km_user_profile')
    return saved ? JSON.parse(saved) : null
  })
  const [language, setLanguageState] = useState(() => localStorage.getItem('km_language') || null)

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

  const logout = () => {
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
