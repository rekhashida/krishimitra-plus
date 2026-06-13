export const DISEASE_DATABASE = {
  'Tomato Late Blight': {
    crop: 'Tomato',
    severity: 'High',
    cause: 'Fungal infection (Phytophthora infestans) due to excess moisture and cool temperatures.',
    organic: 'Spray neem oil (5ml/litre water) every 3 days. Remove infected leaves immediately.',
    chemical: 'Apply Mancozeb 75% WP (2g/litre water) or Chlorothalonil.',
    prevention: 'Avoid overhead watering. Ensure good air circulation between plants.'
  },
  'Tomato Early Blight': {
    crop: 'Tomato',
    severity: 'Moderate',
    cause: 'Fungal infection (Alternaria solani), common in warm humid weather.',
    organic: 'Spray neem oil or copper-based organic fungicide weekly.',
    chemical: 'Apply Chlorothalonil or Mancozeb as per label instructions.',
    prevention: 'Rotate crops yearly. Remove plant debris after harvest.'
  },
  'Healthy Tomato': {
    crop: 'Tomato',
    severity: 'None',
    cause: 'No disease detected — plant appears healthy.',
    organic: 'Continue regular organic compost feeding.',
    chemical: 'No treatment needed.',
    prevention: 'Maintain consistent watering and good sunlight exposure.'
  },
  'Potato Early Blight': {
    crop: 'Potato',
    severity: 'Moderate',
    cause: 'Fungal infection (Alternaria solani) on older leaves first.',
    organic: 'Apply neem-based spray. Remove and destroy infected leaves.',
    chemical: 'Use Mancozeb or Azoxystrobin as per recommended dosage.',
    prevention: 'Practice 2-3 year crop rotation. Avoid water stress.'
  },
  'Healthy Potato': {
    crop: 'Potato',
    severity: 'None',
    cause: 'No disease detected — plant appears healthy.',
    organic: 'Continue current care routine.',
    chemical: 'No treatment needed.',
    prevention: 'Ensure proper hilling and drainage.'
  },
  'Maize Common Rust': {
    crop: 'Maize',
    severity: 'Moderate',
    cause: 'Fungal infection (Puccinia sorghi) causing orange-brown pustules.',
    organic: 'Spray sulfur-based organic fungicide.',
    chemical: 'Apply Propiconazole or Azoxystrobin based fungicide.',
    prevention: 'Plant rust-resistant maize varieties. Avoid dense planting.'
  },
  'Apple Scab': {
    crop: 'Apple',
    severity: 'Moderate',
    cause: 'Fungal infection (Venturia inaequalis) causing dark scab-like lesions.',
    organic: 'Apply sulfur or copper-based organic spray before bud break.',
    chemical: 'Use Captan or Myclobutanil fungicide as per schedule.',
    prevention: 'Remove fallen leaves in autumn. Prune for air circulation.'
  },
  'Healthy Apple': {
    crop: 'Apple',
    severity: 'None',
    cause: 'No disease detected — plant appears healthy.',
    organic: 'Continue regular organic care.',
    chemical: 'No treatment needed.',
    prevention: 'Maintain pruning schedule and balanced fertilization.'
  },
  'Pepper Bacterial Spot': {
    crop: 'Pepper',
    severity: 'High',
    cause: 'Bacterial infection (Xanthomonas) spreading through water splash.',
    organic: 'Spray copper-based organic bactericide. Avoid working with wet plants.',
    chemical: 'Apply copper hydroxide based bactericide.',
    prevention: 'Use disease-free seeds. Avoid overhead irrigation.'
  },
  'Healthy Pepper': {
    crop: 'Pepper',
    severity: 'None',
    cause: 'No disease detected — plant appears healthy.',
    organic: 'Continue current care routine.',
    chemical: 'No treatment needed.',
    prevention: 'Maintain consistent watering schedule.'
  },
}

export function getDiseaseInfo(diseaseName) {
  return DISEASE_DATABASE[diseaseName] || {
    crop: 'Unknown',
    severity: 'Moderate',
    cause: 'Disease detected but details not in database yet.',
    organic: 'Consult local agricultural extension officer for organic options.',
    chemical: 'Consult local agricultural extension officer for chemical treatment.',
    prevention: 'Maintain good field hygiene and crop rotation.'
  }
}