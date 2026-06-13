import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, CheckCircle } from 'lucide-react'
import FieldError from '../components/FieldError'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import { INDIAN_STATES, getDistrictsForState } from '../data/indiaLocations'
import { CROP_OPTIONS, SKILL_OPTIONS, validateWorkerForm, todayISO } from '../utils/workerValidation'
import { tCrop, tSkill } from '../i18n/translations'
import './FarmerRegister.css'
import './WorkerRegister.css'

const TRAVEL_MIN_KM = 5
const TRAVEL_MAX_KM = 500
const TRAVEL_SLIDER_MAX_KM = 200

function clampTravelKm(value) {
  const num = parseInt(String(value).replace(/\D/g, ''), 10)
  if (Number.isNaN(num)) return TRAVEL_MIN_KM
  return Math.min(TRAVEL_MAX_KM, Math.max(TRAVEL_MIN_KM, num))
}

async function uploadProfilePhoto(file, workerId) {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `workers/${workerId}.${ext}`
  const { error } = await supabase.storage.from('profile-photos').upload(path, file, { upsert: true, contentType: file.type })
  if (error) throw error
  const { data } = supabase.storage.from('profile-photos').getPublicUrl(path)
  return data.publicUrl
}

export default function WorkerRegister() {
  const navigate = useNavigate()
  const { setUserType, setUserProfile, t, language } = useApp()
  const photoRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [form, setForm] = useState({
    name: '', age: '', phone: '', village: '', district: '', state: '',
    skills: [], crop_types: [], available_from: todayISO(), available_until: '',
    daily_wage: '', willing_to_travel: false, travel_distance_km: 25,
  })

  const districts = getDistrictsForState(form.state)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value, ...(name === 'state' ? { district: '' } : {}) }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handlePhoneChange = (e) => {
    setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))
    setErrors((prev) => ({ ...prev, phone: undefined }))
  }

  const toggleItem = (field, item) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter((i) => i !== item) : [...prev[field], item],
    }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handlePhotoSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setErrors((prev) => ({ ...prev, profile_photo: t('errPhotoType') })); return }
    if (file.size > 5 * 1024 * 1024) { setErrors((prev) => ({ ...prev, profile_photo: t('errPhotoSize') })); return }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, profile_photo: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const validationErrors = validateWorkerForm(form, photoFile, language)
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    setLoading(true)
    setErrors({})
    const workerId = crypto.randomUUID()
    const profile = {
      id: workerId, name: form.name.trim(), age: parseInt(form.age, 10),
      phone: `+91${form.phone.trim()}`, village: form.village.trim(),
      district: form.district, state: form.state, skills: form.skills, crop_types: form.crop_types,
      available_from: form.available_from, available_until: form.available_until,
      daily_wage: parseFloat(form.daily_wage), willing_to_travel: form.willing_to_travel,
      travel_distance_km: form.willing_to_travel ? Number(form.travel_distance_km) : 0,
      registered_at: new Date().toISOString(),
    }
    try {
      let photoUrl = photoPreview
      if (isSupabaseConfigured()) {
        try { photoUrl = await uploadProfilePhoto(photoFile, workerId) } catch { photoUrl = photoPreview }
        const { data, error: dbError } = await supabase.from('workers').insert([{ ...profile, profile_photo_url: photoUrl }]).select().single()
        if (dbError) throw dbError
        setUserProfile(data)
      } else {
        setUserProfile({ ...profile, profile_photo_url: photoUrl })
      }
      setUserType('worker')
      setSuccess(true)
      setTimeout(() => navigate('/worker-dashboard'), 2500)
    } catch (err) {
      setSubmitError(err.message || t('registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="register-success">
        <div className="register-success-icon"><CheckCircle size={36} /></div>
        <h2>{t('successTitle')}</h2>
        <p>{t('successWelcome', { name: form.name.split(' ')[0] })}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--paddy-green)' }}>{t('successRedirecting')}</p>
        <div className="spinner" style={{ margin: '20px auto' }} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">{t('workerRegTitle')}</h1>
      <p className="page-subtitle">{t('workerRegSub')}</p>
      {!isSupabaseConfigured() && <div className="alert alert-warning">{t('supabaseWarning')}</div>}
      {submitError && <div className="alert alert-error">{submitError}</div>}

      <form className="worker-register-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">{t('fullName')} *</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} className={errors.name ? 'form-input-error' : ''} />
          <FieldError message={errors.name} />
        </div>
        <div className="form-group">
          <label htmlFor="age">{t('age')} *</label>
          <input id="age" name="age" type="number" min="18" max="60" value={form.age} onChange={handleChange} className={errors.age ? 'form-input-error' : ''} />
          <FieldError message={errors.age} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">{t('phone')} *</label>
          <div className={`phone-input-wrap ${errors.phone ? 'form-input-error' : ''}`}>
            <span className="phone-prefix">+91</span>
            <input id="phone" type="tel" inputMode="numeric" value={form.phone} onChange={handlePhoneChange} maxLength={10} />
          </div>
          <FieldError message={errors.phone} />
        </div>
        <div className="form-group">
          <label htmlFor="village">{t('village')} *</label>
          <input id="village" name="village" value={form.village} onChange={handleChange} className={errors.village ? 'form-input-error' : ''} />
          <FieldError message={errors.village} />
        </div>
        <div className="form-group">
          <label htmlFor="state">{t('state')} *</label>
          <select id="state" name="state" value={form.state} onChange={handleChange} className={errors.state ? 'form-input-error' : ''}>
            <option value="">{t('selectState')}</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <FieldError message={errors.state} />
        </div>
        <div className="form-group">
          <label htmlFor="district">{t('district')} *</label>
          <select id="district" name="district" value={form.district} onChange={handleChange} disabled={!form.state} className={errors.district ? 'form-input-error' : ''}>
            <option value="">{form.state ? t('selectDistrict') : t('selectStateFirst')}</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <FieldError message={errors.district} />
        </div>
        <div className="form-group">
          <label>{t('skills')} *</label>
          <div className="crop-checkbox-grid">
            {SKILL_OPTIONS.map((skill) => (
              <label key={skill} className="crop-checkbox">
                <input type="checkbox" checked={form.skills.includes(skill)} onChange={() => toggleItem('skills', skill)} />
                {tSkill(language, skill)}
              </label>
            ))}
          </div>
          <FieldError message={errors.skills} />
        </div>
        <div className="form-group">
          <label>{t('cropsWorkOn')} *</label>
          <div className="crop-checkbox-grid">
            {CROP_OPTIONS.map((crop) => (
              <label key={crop} className="crop-checkbox">
                <input type="checkbox" checked={form.crop_types.includes(crop)} onChange={() => toggleItem('crop_types', crop)} />
                {tCrop(language, crop)}
              </label>
            ))}
          </div>
          <FieldError message={errors.crop_types} />
        </div>
        <div className="form-group">
          <label>{t('availability')} *</label>
          <div className="date-row">
            <div>
              <label htmlFor="available_from" style={{ fontSize: '0.8rem', color: 'var(--paddy-green)' }}>{t('from')}</label>
              <input id="available_from" name="available_from" type="date" value={form.available_from} min={todayISO()} onChange={handleChange} className={errors.available_from ? 'form-input-error' : ''} />
              <FieldError message={errors.available_from} />
            </div>
            <div>
              <label htmlFor="available_until" style={{ fontSize: '0.8rem', color: 'var(--paddy-green)' }}>{t('until')}</label>
              <input id="available_until" name="available_until" type="date" value={form.available_until} min={form.available_from || todayISO()} onChange={handleChange} className={errors.available_until ? 'form-input-error' : ''} />
              <FieldError message={errors.available_until} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="daily_wage">{t('dailyWage')} *</label>
          <div className={`wage-input-wrap ${errors.daily_wage ? 'form-input-error' : ''}`}>
            <span className="wage-prefix">₹</span>
            <input id="daily_wage" name="daily_wage" type="number" min="100" step="50" value={form.daily_wage} onChange={handleChange} />
          </div>
          <FieldError message={errors.daily_wage} />
        </div>
        <div className="form-group">
          <div className="toggle-row">
            <div className="toggle-label">{t('willingTravel')}<span>{t('travelOutside')}</span></div>
            <label className="toggle-switch">
              <input type="checkbox" name="willing_to_travel" checked={form.willing_to_travel} onChange={handleChange} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
        {form.willing_to_travel && (
          <div className="form-group">
            <div className={`travel-slider-wrap ${errors.travel_distance ? 'form-input-error' : ''}`}>
              <div className="travel-slider-header">
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--deep-soil)' }}>{t('howFar')}</span>
                <div className="travel-distance-input-row">
                  <input type="number" min={TRAVEL_MIN_KM} max={TRAVEL_MAX_KM} value={form.travel_distance_km}
                    onChange={(e) => { const raw = e.target.value; if (raw === '') { setForm((p) => ({ ...p, travel_distance_km: '' })); return }; setForm((p) => ({ ...p, travel_distance_km: clampTravelKm(raw) })); setErrors((p) => ({ ...p, travel_distance: undefined })) }}
                    onBlur={() => setForm((p) => ({ ...p, travel_distance_km: clampTravelKm(p.travel_distance_km || TRAVEL_MIN_KM) }))} />
                  <span className="travel-distance-suffix">km</span>
                </div>
              </div>
              <input type="range" className="travel-range" min={TRAVEL_MIN_KM} max={TRAVEL_SLIDER_MAX_KM} step="5"
                value={Math.min(form.travel_distance_km || TRAVEL_MIN_KM, TRAVEL_SLIDER_MAX_KM)}
                onChange={(e) => { setForm((p) => ({ ...p, travel_distance_km: parseInt(e.target.value, 10) })); setErrors((p) => ({ ...p, travel_distance: undefined })) }} />
              <p className="travel-hint">{t('travelHint')}</p>
            </div>
            <FieldError message={errors.travel_distance} />
          </div>
        )}
        <div className="form-group">
          <label>{t('profilePhoto')} *</label>
          <input ref={photoRef} type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={(e) => handlePhotoSelect(e.target.files[0])} />
          <button type="button" className={`photo-upload-area ${errors.profile_photo ? 'form-input-error' : ''}`} onClick={() => photoRef.current?.click()}>
            {photoPreview ? <img src={photoPreview} alt="" className="photo-preview" /> : <Camera size={36} color="var(--paddy-green)" />}
            <span style={{ fontWeight: 600, color: 'var(--deep-soil)' }}>{photoPreview ? t('changePhoto') : t('uploadPhoto')}</span>
          </button>
          <FieldError message={errors.profile_photo} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? <><span className="spinner" />{t('registering')}</> : t('register')}
        </button>
        <button type="button" className="btn btn-outline" style={{ marginTop: 10 }} onClick={() => navigate('/')}>{t('back')}</button>
      </form>
    </div>
  )
}
