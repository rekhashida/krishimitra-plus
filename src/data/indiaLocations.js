import locationData from './india-states-districts.json'

export const INDIAN_STATES = locationData.map((entry) => entry.state).sort()

export const STATE_DISTRICTS = Object.fromEntries(
  locationData.map((entry) => [entry.state, [...entry.districts].sort()])
)

export function getDistrictsForState(state) {
  return STATE_DISTRICTS[state] || []
}
