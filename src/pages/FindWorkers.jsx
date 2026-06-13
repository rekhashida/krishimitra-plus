import { useEffect, useState } from 'react'
import { Phone, MapPin, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { tSkill } from '../i18n/translations'

const DEMO_WORKERS = [
  { id: '1', name: 'Suresh Kumar', village: 'Anand', state: 'Gujarat', experience_years: 8, skills: ['Harvesting', 'Tractor Driving'], phone: '9876543210', rating: 4.8 },
  { id: '2', name: 'Ravi Singh', village: 'Ludhiana', state: 'Punjab', experience_years: 5, skills: ['Plowing', 'Irrigation'], phone: '9876543211', rating: 4.5 },
  { id: '3', name: 'Mohan Das', village: 'Nashik', state: 'Maharashtra', experience_years: 12, skills: ['Pesticide Spray', 'Weeding'], phone: '9876543212', rating: 4.9 },
  { id: '4', name: 'Venkat Reddy', village: 'Warangal', state: 'Andhra Pradesh', experience_years: 6, skills: ['Planting', 'Harvesting'], phone: '9876543213', rating: 4.3 },
]

export default function FindWorkers() {
  const { t, language } = useApp()
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

  const filtered = workers.filter((w) => {
    if (!filter) return true
    const q = filter.toLowerCase()
    return w.name?.toLowerCase().includes(q) || w.skills?.some((s) => s.toLowerCase().includes(q)) || w.village?.toLowerCase().includes(q)
  })

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
        filtered.map((worker) => (
          <div key={worker.id} className="card">
            <div className="list-item">
              <div>
                <h3>{worker.name}</h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {worker.village}, {worker.state}</p>
                <p>{t('yearsExp', { years: worker.experience_years })}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {worker.skills?.map((s) => <span key={s} className="tag">{tSkill(language, s)}</span>)}
                </div>
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
        ))
      )}
    </div>
  )
}
