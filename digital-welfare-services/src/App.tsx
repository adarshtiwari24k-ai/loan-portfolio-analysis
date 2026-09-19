import { HashRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { RequireAuth } from './components/RequireAuth'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Services } from './pages/Services'
import { MyApplications } from './pages/MyApplications'
import { Help } from './pages/Help'
import { Architecture } from './pages/Architecture'
import { ApplicationEntry } from './pages/application/ApplicationEntry'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { CaseManagement } from './pages/admin/CaseManagement'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/services" element={<Services />} />
              <Route path="/help" element={<Help />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <RequireAuth>
                    <MyApplications />
                  </RequireAuth>
                }
              />
              <Route
                path="/apply/:serviceId"
                element={
                  <RequireAuth>
                    <ApplicationEntry />
                  </RequireAuth>
                }
              />
              <Route
                path="/apply/:serviceId/:applicationId"
                element={
                  <RequireAuth>
                    <ApplicationEntry />
                  </RequireAuth>
                }
              />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/case/:applicationId" element={<CaseManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  )
}

export default App
