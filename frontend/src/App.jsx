import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Bookmarks from './pages/Bookmarks';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

import CreatePostModal from './components/post/CreatePostModal';
import PostModal from './components/post/PostModal';
import EditProfileModal from './components/profile/EditProfileModal';
import Sidebar from './components/layout/Sidebar';

import { ModalProvider } from './context/ModalContext';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/landing'
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname)
  const isFullWidthPage = isLandingPage || isAuthPage
  const isMessagesPage = location.pathname === '/messages'

  return (
    <ModalProvider>
      <div className={`min-h-screen selection:bg-primary/30 ${isFullWidthPage ? '' : 'flex'}`}>

        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[180px]" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/5 blur-[180px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        </div>

        {/* Sidebar — floats above content, fixed positioned inside */}
        {!isFullWidthPage && (
          <>
            {/* The sidebar itself (fixed, overlays content) */}
            <Sidebar />
            {/* Static spacer so content doesn't go under the icon rail */}
            <div className="hidden sm:block flex-shrink-0 w-[72px]" />
          </>
        )}

        {/* Main content area */}
        <div className={`relative z-10 ${isFullWidthPage ? 'w-full' : isMessagesPage ? 'flex-1 w-full flex flex-col min-w-0' : 'flex-1 max-w-[1050px] flex flex-col min-w-0'}`}>
          <main className={isFullWidthPage ? '' : 'flex-1 w-full'}>
            <Routes>
              <Route path="/landing"           element={<Landing />} />
              <Route path="/login"             element={<Login />} />
              <Route path="/signup"            element={<SignUp />} />
              <Route path="/forgot-password"   element={<ForgotPassword />} />
              <Route path="/reset-password/:token"    element={<ResetPassword />} />
              <Route path="/verify-email"      element={<VerifyEmail />} />
              <Route path="/"                  element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/messages"          element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/notifications"     element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/bookmarks"         element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
              <Route path="/profile"           element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>

        {/* Global Post Modal */}
        <PostModal />
        <CreatePostModal />
        <EditProfileModal />
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
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
        }} />
      </div>
    </ModalProvider>
  )
}

export default App
