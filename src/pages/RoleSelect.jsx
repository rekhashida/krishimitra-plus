import { useNavigate } from 'react-router-dom'
import { Tractor, HardHat } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function RoleSelect() {
  const navigate = useNavigate()
  const { t } = useApp()

  return (
    <div style={{ padding: '20px 16px' }}>
      <div className="card card-green" style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ color: 'var(--deep-soil)' }}>{t('welcomeTitle')}</h1>
        <p className="page-subtitle">{t('welcomeSub')}</p>
      </div>

      <h2 className="page-title" style={{ fontSize: '1.1rem' }}>{t('iAmA')}</h2>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/farmer-register')} style={{ padding: '18px' }}>
          <Tractor size={22} />{t('farmerBtn')}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/worker-register')} style={{ padding: '18px' }}>
          <HardHat size={22} />{t('workerBtn')}
        </button>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: 8, color: 'var(--paddy-green)' }}>{t('whatYouCanDo')}</h3>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.8 }}>
          <li>{t('feature1')}</li>
          <li>{t('feature2')}</li>
          <li>{t('feature3')}</li>
          <li>{t('feature4')}</li>
        </ul>
      </div>
    </div>
  )
}