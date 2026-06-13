import { CROP_OPTIONS } from '../i18n/translations'
import { t } from '../i18n/translations'

export { CROP_OPTIONS }

const ERROR_KEYS = {
  name: 'valName',
  phone: 'valPhone',
  village: 'valVillage',
  district: 'valDistrict',
  state: 'valState',
  farm_size: 'valFarmSize',
  crop_types: 'valCrops',
  profile_photo: 'valPhoto',
}

export function validateFarmerForm(form, photoFile, lang = 'en') {
  const errors = {}

  if (!form.name?.trim()) errors.name = t(lang, ERROR_KEYS.name)
  if (!/^[6-9]\d{9}$/.test(form.phone?.trim())) errors.phone = t(lang, ERROR_KEYS.phone)
  if (!form.village?.trim()) errors.village = t(lang, ERROR_KEYS.village)
  if (!form.district) errors.district = t(lang, ERROR_KEYS.district)
  if (!form.state) errors.state = t(lang, ERROR_KEYS.state)
  if (!form.farm_size || Number(form.farm_size) <= 0) errors.farm_size = t(lang, ERROR_KEYS.farm_size)
  if (!form.crop_types?.length) errors.crop_types = t(lang, ERROR_KEYS.crop_types)
  if (!photoFile) errors.profile_photo = t(lang, ERROR_KEYS.profile_photo)

  return errors
}
