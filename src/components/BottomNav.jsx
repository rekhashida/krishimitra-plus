import { NavLink } from 'react-router-dom'
import { Home, ScanLine, Briefcase, Users, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './BottomNav.css'

export default function BottomNav() {
  const { userType, t } = useApp()

  if (!userType) return null

  const farmerNav = [
    { to: '/farmer-dashboard', icon: Home, labelKey: 'navHome' },
    { to: '/crop-scanner', icon: ScanLine, labelKey: 'navScan' },
    { to: '/post-job', icon: Briefcase, labelKey: 'navPostJob' },
    { to: '/find-workers', icon: Users, labelKey: 'navWorkers' },
    { to: '/rating', icon: Star, labelKey: 'navRate' },
  ]

  const workerNav = [
    { to: '/worker-dashboard', icon: Home, labelKey: 'navHome' },
    { to: '/find-jobs', icon: Briefcase, labelKey: 'navJobs' },
    { to: '/rating', icon: Star, labelKey: 'navRate' },
  ]

  const items = userType === 'farmer' ? farmerNav : workerNav

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(({ to, icon: Icon, labelKey }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={22} strokeWidth={2} />
          <span>{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
