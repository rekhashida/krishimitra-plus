import { useEffect, useState } from 'react'
import { Phone, MapPin, Star, IndianRupee } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { tSkill, tCrop } from '../i18n/translations'

const DEMO_WORKERS = [
  { id: '1', name: 'Suresh Kumar', village: 'Anand', district: 'Anand', state: 'Gujarat', skills: ['Harvesting', 'Tractor Driving'], crop_types: ['Wheat', 'Cotton'], daily_wage: 450, willing_to_travel: true, phone: '+919876543210', rating: 4.8, jobs_completed: 12 },
  { id: '2', name: 'Ravi Singh', village: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', skills: ['Plowing', 'Irrigation'], crop_types: ['Wheat', 'Rice'], daily_wage: 500, willing_to_travel: false, phone: '+919876543211', rating: 4.5, jobs_completed: 8 },
  { id: '3', name: 'Mohan Das', village: 'Nashik', district: 'Nashik', state: 'Maharashtra', skills: ['Pesticide Spray', 'Weeding'], crop_types: ['Cotton', 'Onion'], daily_wage: 480, willing_to_travel: true, phone: '+919876543212', rating: 4.9, jobs_completed: 20 },
  { id: '4', name: 'Venkat Reddy', village: 'Warangal', district: 'Warangal', state: 'Andhra Pradesh', skills: ['Planting', 'Harvesting'], crop_types: ['Rice'], daily_wage: 400, willing_to_travel: true, phone: '+919876543213', rating: 4.3, jobs_completed: 5 },
]

export default function FindWorkers() {
  const { userProfile, t, language } = useApp()
  const [workers, setWorkers] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured()) {
        const { data } = await supabase.from('workers').select('*').order('created_at', { ascending: false })
        setWorkers(data?.length ? data : DEMO_WORKERS)
      } else {
        setWorkers(DEMO_WORKERS)
      }
      setLoading(false)
    }
    load()
  }, [])

  // Location-aware sorting: same district first, then same state, then willing to travel, then rating
  const sorted = [...workers].sort((a, b) => {
    const score = (w) => {
      if (userProfile?.district && w.district === userProfile.district) return 3
      if (userProfile?.state && w.state === userProfile.state) return 2
      if (w.willing_to_travel) return 1
      return 0
    }
    const diff = score(b) - score(a)
    if (diff !== 0) return diff
    return (b.rating || 0) - (a.rating || 0)
  })

  const filtered = sorted.filter((w) => {
    if (!filter) return true
    const q = filter.toLowerCase()
    return (
      w.name?.toLowerCase().includes(q) ||
      w.skills?.some((s) => s.toLowerCase().includes(q)) ||
      w.crop_types?.some((c) => c.toLowerCase().includes(q)) ||
      w.village?.toLowerCase().includes(q) ||
      w.district?.toLowerCase().includes(q)
    )
  })

  const locationTag = (w) => {
    if (userProfile?.district && w.district === userProfile.district) return { label: '📍 Same District', cls: 'tag-success' }
    if (userProfile?.state && w.state === userProfile.state) return { label: '📍 Same State', cls: 'tag' }
    if (w.willing_to_travel) return { label: '🚗 Willing to Travel', cls: 'tag' }
    return null
  }

  return (
    <div>
      <h1 className="page-title">{t('findWorkersTitle')}</h1>
      <p className="page-subtitle">{t('findWorkersSub')}</p>
      <div className="form-group">
        <input type="search" placeholder={t('searchWorkers')} value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{t('loadingWorkers')}</p>
      ) : filtered.length === 0 ? (
        <div className="card">{t('noWorkers')}</div>
      ) : (
        filtered.map((worker) => {
          const loc = locationTag(worker)
          return (
            <div key={worker.id} className="card">
              <div className="list-item">
                <div>
                  <h3>{worker.name}</h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {worker.village}, {worker.district}, {worker.state}</p>

                  {worker.skills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                      {worker.skills.map((s) => <span key={s} className="tag">{tSkill(language, s)}</span>)}
                    </div>
                  )}

                  {worker.crop_types?.length > 0 && (
                    <p style={{ marginTop: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Crops: {worker.crop_types.map((c) => tCrop(language, c)).join(', ')}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    {worker.daily_wage && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <IndianRupee size={14} />{worker.daily_wage}/day
                      </span>
                    )}
                    {worker.jobs_completed > 0 && (
                      <span style={{ color: 'var(--text-secondary)' }}>{worker.jobs_completed} jobs completed</span>
                    )}
                  </div>

                  {loc && <span className={`tag ${loc.cls}`} style={{ marginTop: 8, display: 'inline-block' }}>{loc.label}</span>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--harvest-sun)', fontWeight: 700 }}>
                    <Star size={14} fill="var(--harvest-sun)" /> {worker.rating || '4.0'}
                  </p>
                </div>
              </div>
              {worker.phone && (
                <a href={`tel:${worker.phone}`} className="btn btn-sm btn-primary" style={{ marginTop: 12, width: '100%' }}>
                  <Phone size={16} />{t('call', { phone: worker.phone })}
                </a>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}