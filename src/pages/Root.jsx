import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Landing from './Landing'
import RoleSelect from './RoleSelect'

export default function Root() {
  const { session, authLoading, profileLoading, userType } = useApp()

  if (authLoading || profileLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
        Loading...
      </div>
    )
  }

  if (!session) {
    return <Landing />
  }

  if (userType === 'farmer') {
    return <Navigate to="/farmer-dashboard" replace />
  }
  if (userType === 'worker') {
    return <Navigate to="/worker-dashboard" replace />
  }

  return <RoleSelect />
}