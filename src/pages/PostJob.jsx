import { useState } from 'react'
import { Briefcase } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { tSkill } from '../i18n/translations'

const POST_SKILLS = ['Harvesting', 'Plowing', 'Irrigation', 'Pesticide Spray', 'Tractor Driving', 'Planting', 'Weeding']

export default function PostJob() {
  const { userProfile, t, language } = useApp()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', description: '', wage: '', duration: '', workers_needed: '1', skill_required: '' })

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    const job = {
      farmer_id: userProfile?.id, farmer_name: userProfile?.name,
      location: `${userProfile?.village}, ${userProfile?.state}`, ...form,
      wage: parseFloat(form.wage) || 0, workers_needed: parseInt(form.workers_needed, 10) || 1,
      status: 'open', created_at: new Date().toISOString(),
    }
    try {
      if (isSupabaseConfigured()) {
        const { error: dbError } = await supabase.from('jobs').insert([job])
        if (dbError) throw dbError
      }
      setSuccess(true)
      setForm({ title: '', description: '', wage: '', duration: '', workers_needed: '1', skill_required: '' })
    } catch (err) {
      setError(err.message || t('jobFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">{t('postJobTitle')}</h1>
      <p className="page-subtitle">{t('postJobSub')}</p>
      {success && <div className="alert alert-success">{t('jobPosted')}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">{t('jobTitle')} *</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">{t('description')} *</label>
          <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="skill_required">{t('skillRequired')}</label>
          <select id="skill_required" name="skill_required" value={form.skill_required} onChange={handleChange}>
            <option value="">{t('anySkill')}</option>
            {POST_SKILLS.map((s) => <option key={s} value={s}>{tSkill(language, s)}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="wage">{t('dailyWageLabel')} *</label>
          <input id="wage" name="wage" type="number" min="100" value={form.wage} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="duration">{t('duration')}</label>
          <input id="duration" name="duration" value={form.duration} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="workers_needed">{t('workersNeeded')}</label>
          <input id="workers_needed" name="workers_needed" type="number" min="1" value={form.workers_needed} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Briefcase size={18} />{loading ? t('posting') : t('postJob')}
        </button>
      </form>
    </div>
  )
}
