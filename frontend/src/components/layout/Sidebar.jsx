import React, { useEffect, useRef, useState } from 'react'

import { Link, useLocation, useNavigate } from 'react-router-dom'

import {
  Bell,
  Bookmark,
  Home,
  MessageCircle,
  MoreHorizontal,
  Plus,
  User,
  Zap,
  LogOut,
  Compass,
} from 'lucide-react'

import { useModal } from '../../context/ModalContext'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import defaultAvatar from '../../assets/default-avatar.svg'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/profile', icon: User, label: 'Profile' },
]

// ── Individual nav item ───────────────────────────────────────────────────────
const SidebarItem = ({ to, icon, label, active, onClick, fillWhenActive = true, badge = 0 }) => {
  const IconComp = icon
  const itemClassName = `sidebar-item flex items-center gap-3 px-4 py-3.5 rounded-3xl transition-all duration-200 group w-full ${
    active
      ? 'text-white bg-white/[0.05]'
      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
  }`

  const content = (
    <>
      <div className="relative shrink-0">
        <IconComp
          className={`w-[22px] h-[22px] transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : ''}`}
          fill={active && fillWhenActive ? 'currentColor' : 'none'}
          strokeWidth={active && fillWhenActive ? 0 : 1.75}
        />
        {active && (
          <span className="absolute -right-1 -top-1 w-1.5 h-1.5 rounded-full bg-primary" />
        )}
        {badge > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>

      <span
        className={`sidebar-label whitespace-nowrap text-[15px] overflow-hidden ${
          active ? 'font-semibold' : 'font-normal'
        }`}
      >
        {label}
      </span>
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={itemClassName} title={label}>
        {content}
      </button>
    )
  }

  return (
    <Link to={to} className="block w-full" title={label}>
      <div className={itemClassName}>{content}</div>
    </Link>
  )
}

// ── Main sidebar ──────────────────────────────────────────────────────────────
const Sidebar = () => {
  const { user, logout, isLoggingOut } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const { isCreatePostOpen, openCreatePostModal, openCreateStoryModal } = useModal()
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const createMenuRef = useRef(null)
  const createButtonRef = useRef(null)

  // Close the floating create menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!showCreateMenu) return undefined

    const handleOutside = event => {
      const target = event.target
      if (!createMenuRef.current || !createButtonRef.current) return
      if (createMenuRef.current.contains(target) || createButtonRef.current.contains(target)) return
      setShowCreateMenu(false)
    }

    const handleKey = e => {
      if (e.key === 'Escape') setShowCreateMenu(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [showCreateMenu])

  const sidebarWidth = 300

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      void err
    }
  }

  return (
    <aside
      className="sticky top-0 h-screen shrink-0 z-50 flex overflow-visible"
      style={{ width: sidebarWidth }}
    >
      <div className="h-full w-full px-4 py-5">
        <div className="flex h-full w-full flex-col rounded-[36px] border border-white/10 bg-[#050505]/90 shadow-[0_24px_80px_rgba(0,0,0,0.27)] backdrop-blur-xl px-4 py-5 gap-5">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-4 px-4 pb-8 mb-4 border-b border-white/10 transition-transform duration-300 group shrink-0"
          >
            <div className="w-12 h-12 shrink-0 rounded-[22px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_18px_50px_rgba(30,129,255,0.18)] transition-transform duration-500 group-hover:-translate-y-1">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="sidebar-label text-[20px] font-black tracking-tight text-white whitespace-nowrap overflow-hidden">
              Nexus
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex-1 flex flex-col gap-3 w-full">
            {NAV_ITEMS.map(({ to, icon, label }) => (
              <SidebarItem
                key={to}
                to={to}
                icon={icon}
                label={label}
                active={currentPath === to}
                badge={to === '/notifications' ? unreadCount : 0}
              />
            ))}
            <div className="relative">
              <button
                ref={createButtonRef}
                type="button"
                onClick={() => setShowCreateMenu(prev => !prev)}
                className={`flex items-center justify-center gap-3 w-full px-4 py-3 rounded-3xl transition-all duration-200 ${
                  showCreateMenu || isCreatePostOpen
                    ? 'bg-white text-black'
                    : 'bg-white/95 text-black/90'
                } shadow-sm`}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-semibold">Create</span>
              </button>

              {showCreateMenu && (
                <div
                  ref={createMenuRef}
                  className="absolute left-0 top-full mt-2 w-44 rounded-3xl border border-white/10 bg-[#020206] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.48)] backdrop-blur-xl"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateMenu(false)
                      openCreatePostModal()
                    }}
                    className="w-full rounded-3xl bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Create post
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateMenu(false)
                      openCreateStoryModal()
                    }}
                    className="mt-2 w-full rounded-3xl bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Create story
                  </button>
                </div>
              )}
            </div>
          </nav>
          {/* User footer */}
          <div className="mt-4 border-t border-white/10 pt-4 flex-shrink-0">
            {user ? (
              <button className="flex items-center gap-4 w-full rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 transition-colors duration-200 hover:bg-white/[0.08] group">
                <div className="w-11 h-11 flex-shrink-0 rounded-full overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                  <img
                    src={user.profilePicture || defaultAvatar}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sidebar-label flex items-center justify-between flex-1 min-w-0 overflow-hidden">
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                    <p className="text-xs text-white/35 truncate">{user.email?.split('@')[0]}</p>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors flex-shrink-0" />
                </div>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-4 w-full rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 transition-colors duration-200 hover:bg-white/[0.08] group"
              >
                <div className="w-11 h-11 flex-shrink-0 rounded-full bg-white/10 border border-white/10 group-hover:border-white/20 transition-colors flex items-center justify-center">
                  <User className="w-5 h-5 text-white/40" />
                </div>
                <div className="sidebar-label flex items-center justify-between flex-1 min-w-0 overflow-hidden">
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-white">Sign in</p>
                  </div>
                </div>
              </button>
            )}
            {user && (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-4 w-full rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 mt-3 transition-colors duration-200 hover:bg-white/[0.08] group disabled:opacity-50"
              >
                <div className="w-11 h-11 flex-shrink-0 rounded-full bg-white/10 border border-white/10 group-hover:border-white/20 transition-colors flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-white/40 group-hover:text-white/60" />
                </div>
                <div className="sidebar-label flex items-center justify-between flex-1 min-w-0 overflow-hidden">
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-white/60 group-hover:text-white">
                      {isLoggingOut ? 'Logging out...' : 'Log out'}
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
