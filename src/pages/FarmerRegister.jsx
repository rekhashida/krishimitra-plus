import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, CheckCircle, Calculator } from 'lucide-react'
import FarmSizeCalculator from '../components/FarmSizeCalculator'
import FieldError from '../components/FieldError'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import { INDIAN_STATES, getDistrictsForState } from '../data/indiaLocations'
import { CROP_OPTIONS, validateFarmerForm } from '../utils/farmerValidation'
import { tCrop } from '../i18n/translations'
import './FarmerRegister.css'
import '../components/FarmSizeCalculator.css'

async function uploadProfilePhoto(file, farmerId) {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `farmers/${farmerId}.${ext}`
  const { error } = await supabase.storage.from('profile-photos').upload(path, file, { upsert: true, contentType: file.type })
  if (error) throw error
  const { data } = supabase.storage.from('profile-photos').getPublicUrl(path)
  return data.publicUrl
}

export default function FarmerRegister() {
  const navigate = useNavigate()
  const { setUserType, setUserProfile, t, language } = useApp()
  const photoRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [showCalculator, setShowCalculator] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', village: '', district: '', state: '', farm_size: '', crop_types: [],
  })

  const districts = getDistrictsForState(form.state)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value, ...(name === 'state' ? { district: '' } : {}) }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handlePhoneChange = (e) => {
    setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))
    setErrors((prev) => ({ ...prev, phone: undefined }))
  }

  const toggleCrop = (crop) => {
    setForm((prev) => ({
      ...prev,
      crop_types: prev.crop_types.includes(crop) ? prev.crop_types.filter((c) => c !== crop) : [...prev.crop_types, crop],
    }))
    setErrors((prev) => ({ ...prev, crop_types: undefined }))
  }

  const handlePhotoSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, profile_photo: t('errPhotoType') }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profile_photo: t('errPhotoSize') }))
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, profile_photo: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const validationErrors = validateFarmerForm(form, photoFile, language)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setErrors({})
    const farmerId = crypto.randomUUID()
    const profile = {
      id: farmerId, name: form.name.trim(), phone: `+91${form.phone.trim()}`,
      village: form.village.trim(), district: form.district, state: form.state,
      farm_size: parseFloat(form.farm_size), land_size: parseFloat(form.farm_size),
      crop_types: form.crop_types, crops: form.crop_types.join(', '),
      registered_at: new Date().toISOString(),
    }
    try {
      let photoUrl = photoPreview
      if (isSupabaseConfigured()) {
        try { photoUrl = await uploadProfilePhoto(photoFile, farmerId) } catch { photoUrl = photoPreview }
        const { data, error: dbError } = await supabase.from('farmers').insert([{ ...profile, profile_photo_url: photoUrl }]).select().single()
        if (dbError) throw dbError
        setUserProfile(data)
      } else {
        setUserProfile({ ...profile, profile_photo_url: photoUrl })
      }
      setUserType('farmer')
      setSuccess(true)
      setTimeout(() => navigate('/farmer-dashboard'), 2500)
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
      <h1 className="page-title">{t('farmerRegTitle')}</h1>
      <p className="page-subtitle">{t('farmerRegSub')}</p>
      {!isSupabaseConfigured() && <div className="alert alert-warning">{t('supabaseWarning')}</div>}
      {submitError && <div className="alert alert-error" role="alert">{submitError}</div>}

      <form className="farmer-register-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">{t('fullName')} *</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} className={errors.name ? 'form-input-error' : ''} />
          <FieldError message={errors.name} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">{t('phone')} *</label>
          <div className={`phone-input-wrap ${errors.phone ? 'form-input-error' : ''}`}>
            <span className="phone-prefix">+91</span>
            <input id="phone" name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={handlePhoneChange} maxLength={10} />
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
          <div className="farm-size-label-row">
            <label htmlFor="farm_size">{t('farmSizeAcres')} *</label>
            <button type="button" className="calc-trigger-btn" onClick={() => setShowCalculator(true)}>
              <Calculator size={16} />{t('convert')}
            </button>
          </div>
          <input id="farm_size" name="farm_size" type="number" min="0.1" step="0.1" value={form.farm_size} onChange={handleChange} className={errors.farm_size ? 'form-input-error' : ''} />
          <FieldError message={errors.farm_size} />
        </div>
        <div className="form-group">
          <label>{t('cropTypes')} *</label>
          <div className="crop-checkbox-grid">
            {CROP_OPTIONS.map((crop) => (
              <label key={crop} className="crop-checkbox">
                <input type="checkbox" checked={form.crop_types.includes(crop)} onChange={() => toggleCrop(crop)} />
                {tCrop(language, crop)}
              </label>
            ))}
          </div>
          <FieldError message={errors.crop_types} />
        </div>
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
      <FarmSizeCalculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} onApplyAcres={(acres) => {
        setForm((prev) => ({ ...prev, farm_size: String(acres) }))
        setErrors((prev) => ({ ...prev, farm_size: undefined }))
      }} />
    </div>
  )
}
