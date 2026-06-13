import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function LanguageGuard({ children }) {
  const { language } = useApp()
  const { pathname } = useLocation()

  if (!language && pathname !== '/language') {
    return <Navigate to="/language" replace />
  }

  return children
}
