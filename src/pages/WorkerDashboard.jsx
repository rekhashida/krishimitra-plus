import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Star, LogOut, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { tCrop, tSkill } from '../i18n/translations'

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const { userProfile, logout, t, language } = useApp()
  const [jobCount, setJobCount] = useState(0)

  useEffect(() => {
    if (!userProfile) { navigate('/worker-register'); return }
    async function loadJobs() {
      if (!isSupabaseConfigured()) { setJobCount(8); return }
      const { count } = await supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open')
      setJobCount(count || 0)
    }
    loadJobs()
  }, [userProfile, navigate])

  if (!userProfile) return null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">{t('workerGreeting', { name: userProfile.name?.split(' ')[0] })}</h1>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={14} />{userProfile.village}{userProfile.district ? `, ${userProfile.district}` : ''}, {userProfile.state}
          </p>
        </div>
        <button type="button" className="btn btn-sm btn-outline" onClick={() => { logout(); navigate('/') }}><LogOut size={16} /></button>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{jobCount}</div><div className="stat-label">{t('statOpenJobs')}</div></div>
        <div className="stat-card"><div className="stat-value">{userProfile.age || '—'}</div><div className="stat-label">{t('statAge')}</div></div>
        <div className="stat-card"><div className="stat-value">{userProfile.skills?.length || 0}</div><div className="stat-label">{t('statSkills')}</div></div>
        <div className="stat-card"><div className="stat-value">4.5</div><div className="stat-label">{t('statRating')}</div></div>
      </div>
      {userProfile.skills?.length > 0 && (
        <div className="card">
          <p style={{ fontSize: '0.85rem', color: 'var(--paddy-green)', marginBottom: 8 }}>{t('yourSkills')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {userProfile.skills.map((s) => <span key={s} className="tag">{tSkill(language, s)}</span>)}
          </div>
        </div>
      )}
      {userProfile.crop_types?.length > 0 && (
        <div className="card card-green" style={{ marginTop: 12 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--paddy-green)', marginBottom: 8 }}>{t('cropsYouWorkOn')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {userProfile.crop_types.map((c) => <span key={c} className="tag">{tCrop(language, c)}</span>)}
          </div>
        </div>
      )}
      <div className="card" style={{ marginTop: 12 }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--paddy-green)', marginBottom: 6 }}>{t('availAndWage')}</p>
        {userProfile.available_from && userProfile.available_until && (
          <p style={{ fontSize: '0.9rem', color: 'var(--dark-loam)' }}>{userProfile.available_from} → {userProfile.available_until}</p>
        )}
        {userProfile.daily_wage > 0 && <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--forest-floor)', marginTop: 4 }}>{t('expectedWage', { wage: userProfile.daily_wage })}</p>}
        {userProfile.willing_to_travel && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>{t('travelUpTo', { km: userProfile.travel_distance_km })}</p>}
      </div>
      <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/find-jobs')}><Briefcase size={20} />{t('browseJobs')}</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/rating')}><Star size={20} />{t('viewRatings')}</button>
      </div>
      <div className="card card-green" style={{ marginTop: 20 }}>
        <p style={{ fontWeight: 600, color: 'var(--deep-soil)', marginBottom: 4 }}>{t('profileTip')}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--paddy-green)' }}>{t('profileTipBody')}</p>
      </div>
    </div>
  )
}
