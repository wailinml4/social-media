import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home.jsx'
import Landing from './pages/Landing.jsx'
import Messages from './pages/Messages.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'
import Explore from './pages/Explore.jsx'
import Login from './pages/auth/Login.jsx'
import SignUp from './pages/auth/SignUp.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import ResetPasswordSuccess from './pages/auth/ResetPasswordSuccess.jsx'
import VerifyEmail from './pages/auth/VerifyEmail.jsx'

import CreatePostModal from './components/post/create/CreatePostModal.jsx'
import CreateStoryModal from './components/stories/CreateStoryModal.jsx'
import PostModal from './components/post/modal/PostModal.jsx'
import EditProfileModal from './components/profile/EditProfileModal.jsx'
import FollowersModal from './components/profile/FollowersModal.jsx'
import ConfirmModal from './components/ui/ConfirmModal.jsx'
import SharePostModal from './components/post/modal/SharePostModal.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import TrendingSidebar from './components/layout/TrendingSidebar.jsx'

import { ModalProvider } from './context/ModalContext.jsx'
import Spinner from './components/loading/Spinner'
import { useAuth } from './context/AuthContext.jsx'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isCheckingAuth } = useAuth()

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full relative">
      <div className="absolute left-4 top-4 z-50 pointer-events-auto">
        <Link to="/" aria-label="Back to home" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
          Back to home
        </Link>
      </div>
      <div>{children}</div>
    </div>
  )
}

const App = () => {
  const location = useLocation()
  const { isAuthenticated, isCheckingAuth } = useAuth()
  const isLandingPage = location.pathname === '/landing' || (location.pathname === '/' && !isAuthenticated)
  const isAuthPage =
    ['/login', '/signup', '/forgot-password', '/verify-email'].includes(location.pathname) ||
    location.pathname.startsWith('/reset-password')
  const isFullWidthPage = isLandingPage || isAuthPage
  const isMessagesPage = location.pathname.startsWith('/messages')
  const isProfilePage = location.pathname.startsWith('/profile')
  const isExplorePage = location.pathname.startsWith('/explore')

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <ModalProvider>
      <div className={`min-h-screen selection:bg-primary/30 ${isFullWidthPage ? '' : 'flex'}`}>
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {!isAuthPage && (
            <>
              <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[180px]" />
              <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/5 blur-[180px]" />
            </>
          )}
        </div>

        {/* Left sidebar — part of flex layout */}
        {!isFullWidthPage && <Sidebar />}

        {/* Main content area */}
        <div className={`relative z-10 ${isFullWidthPage ? 'w-full' : 'flex flex-1 min-w-0'}`}>
          <div
            className={isFullWidthPage ? 'w-full' : isMessagesPage ? 'flex-1 w-full flex flex-col min-w-0' : 'flex-1 flex flex-col min-w-0'}
          >
            <main className={isFullWidthPage ? '' : 'flex-1 w-full'}>
              <Routes>
                <Route path="/landing" element={<AuthRedirect><AuthLayout><Landing /></AuthLayout></AuthRedirect>} />
                <Route path="/login" element={<AuthRedirect><AuthLayout><Login /></AuthLayout></AuthRedirect>} />
                <Route path="/signup" element={<AuthRedirect><AuthLayout><SignUp /></AuthLayout></AuthRedirect>} />
                <Route path="/forgot-password" element={<AuthRedirect><AuthLayout><ForgotPassword /></AuthLayout></AuthRedirect>} />
                <Route path="/reset-password/:token" element={<AuthRedirect><AuthLayout><ResetPassword /></AuthLayout></AuthRedirect>} />
                <Route path="/reset-password-success" element={<AuthRedirect><AuthLayout><ResetPasswordSuccess /></AuthLayout></AuthRedirect>} />
                <Route path="/verify-email" element={<AuthRedirect><AuthLayout><VerifyEmail /></AuthLayout></AuthRedirect>} />
                <Route path="/" element={isAuthenticated ? (<ProtectedRoute><Home /></ProtectedRoute>) : (<Landing />)} />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages/conversation/:conversationId"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages/:userId"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/explore"
                  element={
                    <ProtectedRoute>
                      <Explore />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
          {!isFullWidthPage && !isMessagesPage && !isProfilePage && !isExplorePage && <TrendingSidebar />}
        </div>

        {/* Global Post Modal */}
        <PostModal />
        <CreatePostModal />
        <CreateStoryModal />
        <EditProfileModal />
        <FollowersModal />
        <SharePostModal />
        <ConfirmModal />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              zIndex: 9999,
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1a1a1a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1a1a1a',
              },
            },
          }}
        />
      </div>
    </ModalProvider>
  )
}

export default App
