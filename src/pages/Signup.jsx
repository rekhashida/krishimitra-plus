import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, UserPlus } from 'lucide-react'
import Spinner from '../components/Spinner'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import GoogleIcon from '../components/GoogleIcon'
import Logo from '../components/Logo'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      if (!isSupabaseConfigured()) throw new Error('Database not configured')
      const { data, error: err } = await supabase.auth.signUp({ email, password })
      if (err) throw err

      if (data.session) {
        // Email confirmation disabled - logged in immediately
        navigate('/')
      } else {
        // Email confirmation required
        setSuccess(true)
      }
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError('')
    try {
      if (!isSupabaseConfigured()) throw new Error('Database not configured')
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
      if (err) throw err
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '20px 16px' }}>
      <div className="logo-hero-card">
        <Logo size="lg" onDark={false} />
      </div>

      <div className="card">
        <h1 className="page-title">Create Account</h1>
        <p className="page-subtitle">Join KrishiMitra+ — From Field to Future</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Account created! Please check your email to verify your account, then log in.
          </div>
        )}

        {!success && (
          <>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="email"><Mail size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password"><Lock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword"><Lock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Confirm Password</label>
                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? <Spinner size={18} color="#fff" /> : <UserPlus size={18} />}{loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              ───── or ─────
            </div>

            <button type="button" className="btn btn-secondary" onClick={handleGoogleSignup} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <GoogleIcon size={18} /> Continue with Google
            </button>
          </>
        )}

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--paddy-green)', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  )
}