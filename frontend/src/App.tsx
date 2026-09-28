import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'motion/react'
import { ClickSparkEffect } from '@/components/effects/ClickSparkEffect'
import { AuthBootstrap } from '@/components/auth/AuthBootstrap'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { StaffOnly } from '@/components/auth/StaffOnly'
import { GuestRoute } from '@/components/auth/GuestRoute'
import { HomeRedirect } from '@/components/auth/HomeRedirect'
import { AppShell } from '@/components/layout/AppShell'
import Login from '@/pages/Login'
import SsoCallback from '@/pages/SsoCallback'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import UsersPage from '@/pages/UsersPage'
import NotFound from '@/pages/NotFound'
import Error from '@/pages/Error'

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <BrowserRouter>
        <ClickSparkEffect />
        <ToastProvider>
          <AuthBootstrap>
            <Routes>
              <Route path="/" element={<HomeRedirect />} errorElement={<Error />} />
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
                errorElement={<Error />}
              />
              <Route path="/sso/callback" element={<SsoCallback />} errorElement={<Error />} />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                }
                errorElement={<Error />}
              />

              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              >
                <Route
                  path="/dashboard"
                  element={
                    <StaffOnly>
                      <Dashboard />
                    </StaffOnly>
                  }
                />
                <Route
                  path="/dashboard/perfil"
                  element={
                    <StaffOnly>
                      <Profile />
                    </StaffOnly>
                  }
                />
                <Route element={<AdminRoute />}>
                  <Route path="/dashboard/usuarios" element={<UsersPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} errorElement={<Error />} />
            </Routes>
          </AuthBootstrap>
        </ToastProvider>
      </BrowserRouter>
    </LazyMotion>
  )
}

export default App
