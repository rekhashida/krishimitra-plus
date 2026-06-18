import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, LogIn } from 'lucide-react'
import Spinner from '../components/Spinner'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import GoogleIcon from '../components/GoogleIcon'
import Logo from '../components/Logo'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!isSupabaseConfigured()) throw new Error('Database not configured')
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
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
        <h1 className="page-title">Welcome Back</h1>
        <p className="page-subtitle">Log in to continue to KrishiMitra+</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email"><Mail size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password"><Lock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? <Spinner size={18} color="#fff" /> : <LogIn size={18} />}{loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          ───── or ─────
        </div>

        <button type="button" className="btn btn-secondary" onClick={handleGoogleLogin} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <GoogleIcon size={18} /> Continue with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.9rem' }}>
          New here? <Link to="/signup" style={{ color: 'var(--paddy-green)', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}