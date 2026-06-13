import { CROP_OPTIONS, t } from '../i18n/translations'

export { CROP_OPTIONS }

export const SKILL_OPTIONS = [
  'Sowing', 'Harvesting', 'Spraying', 'Weeding', 'Irrigation', 'Tractor Driving',
  'Fertilizer Application', 'Fruit Picking',
]

const ERROR_KEYS = {
  name: 'valName',
  age: 'valAge',
  phone: 'valPhone',
  village: 'valVillage',
  district: 'valDistrict',
  state: 'valState',
  skills: 'valSkills',
  crop_types: 'valCropsWork',
  available_from: 'valAvailFrom',
  available_until: 'valAvailUntil',
  date_range: 'valDateRange',
  daily_wage: 'valWage',
  travel_distance: 'valTravel',
  profile_photo: 'valPhoto',
}

export function validateWorkerForm(form, photoFile, lang = 'en') {
  const errors = {}
  const age = parseInt(form.age, 10)

  if (!form.name?.trim()) errors.name = t(lang, ERROR_KEYS.name)
  if (!age || age < 18 || age > 60) errors.age = t(lang, ERROR_KEYS.age)
  if (!/^[6-9]\d{9}$/.test(form.phone?.trim())) errors.phone = t(lang, ERROR_KEYS.phone)
  if (!form.village?.trim()) errors.village = t(lang, ERROR_KEYS.village)
  if (!form.district) errors.district = t(lang, ERROR_KEYS.district)
  if (!form.state) errors.state = t(lang, ERROR_KEYS.state)
  if (!form.skills?.length) errors.skills = t(lang, ERROR_KEYS.skills)
  if (!form.crop_types?.length) errors.crop_types = t(lang, ERROR_KEYS.crop_types)
  if (!form.available_from) errors.available_from = t(lang, ERROR_KEYS.available_from)
  if (!form.available_until) errors.available_until = t(lang, ERROR_KEYS.available_until)
  if (form.available_from && form.available_until && form.available_until < form.available_from) {
    errors.available_until = t(lang, ERROR_KEYS.date_range)
  }
  if (!form.daily_wage || Number(form.daily_wage) < 100) errors.daily_wage = t(lang, ERROR_KEYS.daily_wage)
  const travelKm = Number(form.travel_distance_km)
  if (form.willing_to_travel && (!travelKm || travelKm < 5 || travelKm > 500)) {
    errors.travel_distance = t(lang, ERROR_KEYS.travel_distance)
  }
  if (!photoFile) errors.profile_photo = t(lang, ERROR_KEYS.profile_photo)

  return errors
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}
