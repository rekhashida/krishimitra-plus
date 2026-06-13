import { useEffect, useState } from 'react'
import { MapPin, IndianRupee, Clock } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import { tSkill } from '../i18n/translations'

const DEMO_JOBS = [
  { id: '1', title: 'Wheat Harvesting', description: 'Need 5 workers for 3-day wheat harvest.', location: 'Anand, Gujarat', wage: 600, duration: '3 days', skill_required: 'Harvesting', farmer_name: 'Ramesh Patel' },
  { id: '2', title: 'Cotton Pesticide Spray', description: 'Experienced sprayer needed for 10-acre cotton field.', location: 'Nashik, Maharashtra', wage: 700, duration: '2 days', skill_required: 'Pesticide Spray', farmer_name: 'Ganesh More' },
  { id: '3', title: 'Rice Transplanting', description: 'Urgent: 8 workers needed for paddy transplanting.', location: 'Warangal, Andhra Pradesh', wage: 550, duration: '5 days', skill_required: 'Planting', farmer_name: 'Venkat Reddy' },
  { id: '4', title: 'Tractor Plowing', description: 'Tractor driver for 15 acres.', location: 'Ludhiana, Punjab', wage: 800, duration: '1 week', skill_required: 'Tractor Driving', farmer_name: 'Harpreet Singh' },
]

export default function FindJobs() {
  const { userProfile, t, language } = useApp()
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [applied, setApplied] = useState(new Set())

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured()) {
        const { data } = await supabase.from('jobs').select('*').eq('status', 'open').order('created_at', { ascending: false })
        setJobs(data?.length ? data : DEMO_JOBS)
      } else {
        setJobs(DEMO_JOBS)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = jobs.filter((j) => {
    if (!filter) return true
    const q = filter.toLowerCase()
    return j.title?.toLowerCase().includes(q) || j.skill_required?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q)
  })

  return (
    <div>
      <h1 className="page-title">{t('findJobsTitle')}</h1>
      <p className="page-subtitle">{userProfile ? t('jobsNear', { village: userProfile.village }) : t('browseJobsSub')}</p>
      <div className="form-group">
        <input type="search" placeholder={t('searchJobs')} value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{t('loadingJobs')}</p>
      ) : filtered.length === 0 ? (
        <div className="card">{t('noJobs')}</div>
      ) : (
        filtered.map((job) => (
          <div key={job.id} className="card">
            <div className="list-item">
              <div>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}><MapPin size={12} /> {job.location}</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}><IndianRupee size={14} />{t('wagePerDay', { wage: job.wage })}</span>
                  {job.duration && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {job.duration}</span>}
                </div>
                {job.skill_required && <span className="tag" style={{ marginTop: 8 }}>{tSkill(language, job.skill_required)}</span>}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--paddy-green)', marginTop: 8 }}>{t('postedBy', { name: job.farmer_name || t('farmer') })}</p>
            <button type="button" className={`btn btn-sm ${applied.has(job.id) ? 'btn-secondary' : 'btn-primary'}`} style={{ marginTop: 10, width: '100%' }} onClick={() => setApplied((prev) => new Set([...prev, job.id]))} disabled={applied.has(job.id)}>
              {applied.has(job.id) ? t('applied') : t('applyJob')}
            </button>
          </div>
        ))
      )}
    </div>
  )
}
