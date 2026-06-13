const ACRE_SQ_M = 4046.8564224

export const LAND_UNITS = [
  { id: 'acre', label: 'Acre', labelHi: 'एकड़', region: 'Pan-India' },
  { id: 'hectare', label: 'Hectare', labelHi: 'हेक्टेयर', region: 'Pan-India' },
  { id: 'sqft', label: 'Square Feet', labelHi: 'वर्ग फुट', region: 'Pan-India' },
  { id: 'sqm', label: 'Square Meter', labelHi: 'वर्ग मीटर', region: 'Pan-India' },
  { id: 'sqyd', label: 'Square Yard (Gaj)', labelHi: 'वर्ग गज', region: 'Pan-India' },
  { id: 'bigha_up', label: 'Bigha (UP / Bihar)', labelHi: 'बीघा (यू.पी./बिहार)', region: 'North India' },
  { id: 'biswa', label: 'Biswa (UP / Bihar)', labelHi: 'बिस्वा', region: 'North India' },
  { id: 'biswansi', label: 'Biswansi', labelHi: 'बिसवांसी', region: 'North India' },
  { id: 'bigha_bengal', label: 'Bigha (West Bengal)', labelHi: 'बीघा (बंगाल)', region: 'East India' },
  { id: 'katha_bengal', label: 'Katha (West Bengal)', labelHi: 'कट्ठा (बंगाल)', region: 'East India' },
  { id: 'bigha_gujarat', label: 'Bigha (Gujarat)', labelHi: 'बीघा (गुजरात)', region: 'West India' },
  { id: 'guntha', label: 'Guntha / Gunta', labelHi: 'गुंठा', region: 'Maharashtra, Karnataka' },
  { id: 'cent', label: 'Cent', labelHi: 'सेंट', region: 'Kerala, Tamil Nadu' },
  { id: 'ground', label: 'Ground', labelHi: 'ग्राउंड', region: 'Tamil Nadu' },
  { id: 'kanal', label: 'Kanal', labelHi: 'कनाल', region: 'Punjab, Haryana' },
  { id: 'marla', label: 'Marla', labelHi: 'मरला', region: 'Punjab, Haryana' },
  { id: 'katha_bihar', label: 'Katha (Bihar)', labelHi: 'कट्ठा (बिहार)', region: 'Bihar' },
]

const UNIT_TO_SQ_M = {
  acre: ACRE_SQ_M,
  hectare: 10000,
  sqft: 0.09290304,
  sqm: 1,
  sqyd: 0.83612736,
  guntha: ACRE_SQ_M / 40,
  cent: ACRE_SQ_M / 100,
  kanal: ACRE_SQ_M / 8,
  marla: ACRE_SQ_M / 160,
  bigha_up: ACRE_SQ_M * 0.625,
  biswa: (ACRE_SQ_M * 0.625) / 20,
  biswansi: (ACRE_SQ_M * 0.625) / 400,
  bigha_bengal: 14400 * 0.09290304,
  katha_bengal: 720 * 0.09290304,
  bigha_gujarat: ACRE_SQ_M * 0.4,
  katha_bihar: 1361 * 0.09290304,
  ground: 2400 * 0.09290304,
}

export function convertLand(value, fromUnit, toUnit) {
  const num = parseFloat(value)
  if (!num || num < 0 || !UNIT_TO_SQ_M[fromUnit] || !UNIT_TO_SQ_M[toUnit]) return null
  const sqM = num * UNIT_TO_SQ_M[fromUnit]
  return sqM / UNIT_TO_SQ_M[toUnit]
}

export function formatLandValue(value) {
  if (value === null || Number.isNaN(value)) return '—'
  if (value >= 1000) return value.toFixed(2)
  if (value >= 1) return value.toFixed(4)
  return value.toFixed(6)
}

export function toAcres(value, fromUnit) {
  return convertLand(value, fromUnit, 'acre')
}

export const QUICK_REFERENCE = [
  { from: '1 Bigha (UP)', to: '0.625 Acre' },
  { from: '1 Bigha (Bengal)', to: '0.3306 Acre' },
  { from: '1 Bigha (Gujarat)', to: '0.4 Acre' },
  { from: '1 Guntha', to: '0.025 Acre' },
  { from: '1 Kanal', to: '0.125 Acre' },
  { from: '1 Marla', to: '0.00625 Acre' },
  { from: '1 Cent', to: '0.01 Acre' },
  { from: '1 Hectare', to: '2.471 Acres' },
  { from: '1 Acre', to: '43,560 Sq Ft' },
]
