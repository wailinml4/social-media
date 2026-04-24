import React, { useCallback, useRef } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Bell, Bookmark, Home, MessageCircle, MoreHorizontal, Plus, Search, User, Zap } from 'lucide-react';

import { useModal } from '../../context/ModalContext';
import { profileData } from '../../data/profile';
import { useSidebarAnimation } from '../../animations/useSidebarAnimation';

const NAV_ITEMS = [
  { to: '/',             icon: Home,          label: 'Home'          },
  { to: '/search',       icon: Search,        label: 'Explore'       },
  { to: '/notifications',icon: Bell,          label: 'Notifications' },
  { to: '/messages',     icon: MessageCircle, label: 'Messages'      },
  { to: '/bookmarks',    icon: Bookmark,      label: 'Bookmarks'     },
  { to: '/profile',      icon: User,          label: 'Profile'       },
]

// ── Individual nav item ───────────────────────────────────────────────────────
const SidebarItem = ({ to, icon: Icon, label, active, onClick, fillWhenActive = true }) => {
  const itemClassName = `sidebar-item flex items-center gap-4 px-[18px] py-3 rounded-2xl transition-colors duration-200 group w-full ${
    active
      ? 'text-white'
      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
  }`

  const content = (
    <>
      <div className="relative flex-shrink-0">
        <Icon
          className={`w-[22px] h-[22px] transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : ''}`}
          fill={active && fillWhenActive ? 'currentColor' : 'none'}
          strokeWidth={active && fillWhenActive ? 0 : 1.75}
        />
        {active && (
          <span className="absolute -right-1 -top-1 w-1.5 h-1.5 rounded-full bg-primary" />
        )}
      </div>

      <span
        className={`sidebar-label whitespace-nowrap text-[15px] overflow-hidden opacity-0 translate-x-[-6px] pointer-events-none ${
          active ? 'font-semibold' : 'font-normal'
        }`}
        style={{ width: 0 }}
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
  const { user } = profileData
  const location  = useLocation()
  const currentPath = location.pathname
  const { isCreatePostOpen, openCreatePostModal } = useModal()

  const asideRef     = useRef(null)
  const labelsRef    = useRef([])

  const { expand, collapse, collectLabels, COLLAPSED_W, EXPANDED_W } = useSidebarAnimation(asideRef, labelsRef)

  return (
    <aside
      ref={asideRef}
      onMouseEnter={expand}
      onMouseLeave={collapse}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden
                 border-r border-white/10
                 bg-[#08080a]/90 backdrop-blur-2xl
                 py-6 px-2"
      style={{ width: COLLAPSED_W }}
    >
      <div ref={collectLabels} className="flex flex-col h-full w-full">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 px-[14px] mb-10 group flex-shrink-0">
          <div className="w-[44px] h-[44px] flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary to-secondary
                          flex items-center justify-center
                          group-hover:rotate-12 transition-transform duration-500
                          shadow-[0_0_24px_rgba(10,132,255,0.18)]">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="sidebar-label text-[20px] font-black tracking-tight text-white opacity-0 translate-x-[-6px] whitespace-nowrap overflow-hidden" style={{ width: 0 }}>
            Nexus
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 w-full">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <SidebarItem
              key={to}
              to={to}
              icon={icon}
              label={label}
              active={currentPath === to}
            />
          ))}
          <SidebarItem
            icon={Plus}
            label="Post"
            active={isCreatePostOpen}
            onClick={openCreatePostModal}
            fillWhenActive={false}
          />
        </nav>
        {/* User footer */}
        <div className="border-t border-white/10 pt-4 flex-shrink-0">
          <button className="flex items-center gap-4 w-full px-[14px] py-2 rounded-2xl
                             hover:bg-white/[0.04] transition-colors duration-200 group">
            <div className="w-[44px] h-[44px] flex-shrink-0 rounded-full overflow-hidden
                            border border-white/10 group-hover:border-white/20 transition-colors">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="sidebar-label flex items-center justify-between flex-1 min-w-0 opacity-0 translate-x-[-6px] overflow-hidden" style={{ width: 0 }}>
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-white/35 truncate">@{user.handle.replace('@', '')}</p>
              </div>
              <MoreHorizontal className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors flex-shrink-0" />
            </div>
          </button>
        </div>

      </div>
    </aside>
  )
}

export default Sidebar
