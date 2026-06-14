export const WAGE_RANGES = {
  default: [300, 450],
  Gujarat: {
    Harvesting: [350, 450], Plowing: [400, 500], Irrigation: [300, 400],
    'Pesticide Spray': [400, 550], 'Tractor Driving': [500, 700], Planting: [300, 400], Weeding: [250, 350]
  },
  Punjab: {
    Harvesting: [400, 550], Plowing: [450, 600], Irrigation: [350, 450],
    'Pesticide Spray': [450, 600], 'Tractor Driving': [550, 750], Planting: [350, 450], Weeding: [300, 400]
  },
  Maharashtra: {
    Harvesting: [350, 480], Plowing: [400, 550], Irrigation: [300, 420],
    'Pesticide Spray': [420, 580], 'Tractor Driving': [500, 700], Planting: [320, 430], Weeding: [270, 370]
  },
  'Uttar Pradesh': {
    Harvesting: [300, 400], Plowing: [350, 480], Irrigation: [280, 380],
    'Pesticide Spray': [380, 500], 'Tractor Driving': [450, 620], Planting: [280, 380], Weeding: [240, 330]
  },
  Bihar: {
    Harvesting: [280, 380], Plowing: [320, 450], Irrigation: [260, 350],
    'Pesticide Spray': [350, 470], 'Tractor Driving': [400, 580], Planting: [260, 350], Weeding: [220, 300]
  },
}

export function getWageSuggestion(state, skill) {
  const stateData = WAGE_RANGES[state]
  if (stateData && skill && stateData[skill]) return stateData[skill]
  return WAGE_RANGES.default
}