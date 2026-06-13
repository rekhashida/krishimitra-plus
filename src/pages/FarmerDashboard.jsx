import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanLine, Users, Briefcase, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { tCrop } from '../i18n/translations'

export default function FarmerDashboard() {
  const navigate = useNavigate()
  const { userProfile, logout, t, language } = useApp()
  const [stats, setStats] = useState({ jobs: 0, workers: 0, scans: 0 })

  useEffect(() => {
    if (!userProfile) { navigate('/farmer-register'); return }
    async function loadStats() {
      if (!isSupabaseConfigured()) { setStats({ jobs: 2, workers: 12, scans: 5 }); return }
      const [jobsRes, workersRes, scansRes] = await Promise.all([
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('farmer_id', userProfile.id),
        supabase.from('workers').select('id', { count: 'exact', head: true }),
        supabase.from('crop_scans').select('id', { count: 'exact', head: true }).eq('farmer_id', userProfile.id),
      ])
      setStats({ jobs: jobsRes.count || 0, workers: workersRes.count || 0, scans: scansRes.count || 0 })
    }
    loadStats()
  }, [userProfile, navigate])

  if (!userProfile) return null

  const quickActions = [
    { icon: ScanLine, labelKey: 'scanCrop', path: '/crop-scanner', color: 'var(--leaf-cream)' },
    { icon: Briefcase, labelKey: 'navPostJob', path: '/post-job', color: 'var(--wheat-husk)' },
    { icon: Users, labelKey: 'findWorkers', path: '/find-workers', color: 'var(--sand-dune)' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">{t('farmerGreeting', { name: userProfile.name?.split(' ')[0] })}</h1>
          <p className="page-subtitle">{userProfile.village}{userProfile.district ? `, ${userProfile.district}` : ''}, {userProfile.state}</p>
        </div>
        <button type="button" className="btn btn-sm btn-outline" onClick={() => { logout(); navigate('/') }}><LogOut size={16} /></button>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{stats.scans}</div><div className="stat-label">{t('statCropScans')}</div></div>
        <div className="stat-card"><div className="stat-value">{stats.jobs}</div><div className="stat-label">{t('statJobsPosted')}</div></div>
        <div className="stat-card"><div className="stat-value">{userProfile.farm_size || userProfile.land_size || '—'}</div><div className="stat-label">{t('statAcres')}</div></div>
        <div className="stat-card"><div className="stat-value">{stats.workers}</div><div className="stat-label">{t('statWorkersNearby')}</div></div>
      </div>
      {(userProfile.crop_types?.length > 0 || userProfile.crops) && (
        <div className="card card-green">
          <p style={{ fontSize: '0.85rem', color: 'var(--paddy-green)' }}>{t('yourCrops')}</p>
          {userProfile.crop_types?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {userProfile.crop_types.map((c) => <span key={c} className="tag">{tCrop(language, c)}</span>)}
            </div>
          ) : (
            <p style={{ fontWeight: 600, color: 'var(--deep-soil)' }}>{userProfile.crops}</p>
          )}
        </div>
      )}
      <h2 style={{ fontSize: '1rem', marginBottom: 12, color: 'var(--dark-loam)' }}>{t('quickActions')}</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {quickActions.map(({ icon: Icon, labelKey, path, color }) => (
          <button key={path} type="button" className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: color, textAlign: 'left' }} onClick={() => navigate(path)}>
            <Icon size={28} color="var(--forest-floor)" />
            <span style={{ fontWeight: 600, color: 'var(--dark-loam)' }}>{t(labelKey)}</span>
          </button>
        ))}
      </div>
      <div className="alert alert-warning" style={{ marginTop: 20 }}>
        <strong>{t('monsoonTip')}</strong> {t('monsoonTipBody')}
      </div>
    </div>
  )
}
