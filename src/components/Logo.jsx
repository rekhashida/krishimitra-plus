import './Logo.css'

const TAGLINE = 'FROM FIELD TO FUTURE'

function PlantIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 28 48" fill="none" aria-hidden="true">
      <line x1="14" y1="44" x2="14" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="14" x2="5" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="4" cy="7" rx="3" ry="2" className="logo-seed" />
      <line x1="14" y1="20" x2="23" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="24" cy="13" rx="3" ry="2" className="logo-seed" />
      <line x1="14" y1="26" x2="5" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="4" cy="19" rx="3" ry="2" className="logo-seed" />
      <line x1="14" y1="32" x2="23" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="24" cy="25" rx="3" ry="2" className="logo-seed" />
      <line x1="14" y1="38" x2="6" y2="33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="5" cy="32" rx="3" ry="2" className="logo-seed" />
      <line x1="14" y1="10" x2="22" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="23" cy="4" rx="3" ry="2" className="logo-seed" />
    </svg>
  )
}

function AIChipIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      <line x1="12" y1="8" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="8" x2="16" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="8" x2="20" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="24" x2="12" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="24" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="24" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="16" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="20" x2="4" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <text x="16" y="18.5" textAnchor="middle" className="logo-ai-text" fontSize="7" fontWeight="700">AI</text>
    </svg>
  )
}

export function Logo({ showTagline = true, size = 'md', onDark = true }) {
  return (
    <div className={`logo-wrapper logo-size-${size} ${onDark ? 'on-dark' : 'on-light'}`}>
      <div className="logo-minimal">
        <span className="logo-bg-k" aria-hidden="true">K</span>
        <div className="logo-icons">
          <PlantIcon className="logo-plant" />
          <AIChipIcon className="logo-chip" />
        </div>
        <div className="logo-text-block">
          <div className="logo-name">
            <span className="logo-line1">Krishi</span>
            <span className="logo-line2">Mitra+</span>
          </div>
          <span className="logo-divider" aria-hidden="true" />
          {showTagline && <p className="logo-tagline">{TAGLINE}</p>}
        </div>
      </div>
    </div>
  )
}

export default Logo
