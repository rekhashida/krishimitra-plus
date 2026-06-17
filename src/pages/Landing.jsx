import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus, Leaf, Users, Camera, IndianRupee } from 'lucide-react'
import Logo from '../components/Logo'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="landing-hero-overlay">
          <Logo size="lg" onDark />
          <h1 className="landing-title">KrishiMitra+</h1>
          <p className="landing-tagline">From Field to Future</p>
          <p className="landing-sub">
            AI-powered crop disease detection and fair labour matching for Indian farmers and agricultural workers
          </p>
          <div className="landing-cta">
            <button type="button" className="btn btn-primary" onClick={() => navigate('/signup')}>
              <UserPlus size={18} /> Get Started
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')}>
              <LogIn size={18} /> Log In
            </button>
          </div>
        </div>
      </div>

      <div className="landing-features">
        <div className="card landing-feature-card">
          <Camera size={28} color="var(--paddy-green)" />
          <h3>AI Crop Scanner</h3>
          <p>Detect crop diseases instantly with your phone camera — remedies in your language.</p>
        </div>
        <div className="card landing-feature-card">
          <Users size={28} color="var(--paddy-green)" />
          <h3>Find Workers & Jobs</h3>
          <p>Connect farmers with skilled agricultural workers nearby — fast and fair.</p>
        </div>
        <div className="card landing-feature-card">
          <IndianRupee size={28} color="var(--paddy-green)" />
          <h3>Fair Wage Insights</h3>
          <p>AI-based wage suggestions using local agricultural wage data.</p>
        </div>
        <div className="card landing-feature-card">
          <Leaf size={28} color="var(--paddy-green)" />
          <h3>Sustainable Farming</h3>
          <p>Organic-first remedies that protect your soil and cut costs.</p>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '16px' }}>
        Samsung Solve for Tomorrow 2026 · Team AgriNova
      </p>
    </div>
  )
}