import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Languages } from 'lucide-react'
import Logo from './Logo'
import BottomNav from './BottomNav'
import { useApp } from '../context/AppContext'

const hideNavRoutes = ['/', '/language', '/farmer-register', '/worker-register']

const backFallback = {
  '/': '/language',
  '/farmer-register': '/',
  '/worker-register': '/',
  '/crop-scanner': '/farmer-dashboard',
  '/post-job': '/farmer-dashboard',
  '/find-workers': '/farmer-dashboard',
  '/find-jobs': '/worker-dashboard',
}

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { userType, language, t } = useApp()

  const showBottomNav = !hideNavRoutes.includes(pathname)
  const isLanguagePage = pathname === '/language'
  const showBack = !isLanguagePage || Boolean(language)

  const handleBack = () => {
    if (isLanguagePage) {
      navigate(language ? '/' : -1)
      return
    }
    if (backFallback[pathname]) {
      navigate(backFallback[pathname])
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    if (pathname === '/rating' || pathname.includes('dashboard')) {
      navigate(userType === 'worker' ? '/worker-dashboard' : userType === 'farmer' ? '/farmer-dashboard' : '/')
      return
    }
    navigate('/')
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header-row">
          {showBack ? (
            <button
              type="button"
              className="header-back-btn"
              onClick={handleBack}
              aria-label={t('back')}
            >
              <ArrowLeft size={22} />
            </button>
          ) : (
            <span className="header-back-spacer" />
          )}

          <div className="header-logo-wrap">
            <Logo size="sm" showTagline />
          </div>

          {!isLanguagePage ? (
            <button
              type="button"
              className="header-lang-btn"
              onClick={() => navigate('/language')}
              aria-label={t('changeLanguage')}
              title={t('changeLanguage')}
            >
              <Languages size={20} />
            </button>
          ) : (
            <span className="header-back-spacer" />
          )}
        </div>
      </header>
      <main className={`app-main ${isLanguagePage ? 'app-main-language' : ''}`}>{children}</main>
      {showBottomNav && <BottomNav />}
    </div>
  )
}
