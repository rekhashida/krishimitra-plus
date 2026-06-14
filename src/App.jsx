import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LanguageGuard from './components/LanguageGuard'
import Layout from './components/Layout'
import LanguageSelect from './pages/LanguageSelect'
import Welcome from './pages/Welcome'
import FarmerRegister from './pages/FarmerRegister'
import WorkerRegister from './pages/WorkerRegister'
import FarmerDashboard from './pages/FarmerDashboard'
import WorkerDashboard from './pages/WorkerDashboard'
import CropScanner from './pages/CropScanner'
import PostJob from './pages/PostJob'
import FindWorkers from './pages/FindWorkers'
import FindJobs from './pages/FindJobs'
import Rating from './pages/Rating'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <LanguageGuard>
          <Layout>
            <Routes>
              <Route path="/language" element={<LanguageSelect />} />
              <Route path="/" element={<Welcome />} />
              <Route path="/farmer-register" element={<FarmerRegister />} />
              <Route path="/worker-register" element={<WorkerRegister />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/worker-dashboard" element={<WorkerDashboard />} />
              <Route path="/crop-scanner" element={<CropScanner />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/find-workers" element={<FindWorkers />} />
              <Route path="/find-jobs" element={<FindJobs />} />
              <Route path="/rating" element={<Rating />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="*" element={<Navigate to="/language" replace />} />
            </Routes>
          </Layout>
        </LanguageGuard>
      </BrowserRouter>
    </AppProvider>
  )
}
