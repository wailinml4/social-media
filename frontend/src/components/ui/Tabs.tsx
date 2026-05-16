import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon?: LucideIcon
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

const Tabs = ({ tabs, activeTab, onTabChange, className = '' }: TabsProps) => {
  const activeIndex = tabs.findIndex(t => t.id === activeTab)

  return (
    <div className={`spatial-panel p-1.5 flex relative ${className}`}>
      {/* Sliding Background Pill */}
      <div
        className="absolute top-1.5 bottom-1.5 bg-white/[0.08] backdrop-blur-md rounded-[26px] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-white/10"
        style={{
          width: `calc(${100 / tabs.length}% - 12px)`,
          left: `calc(${(activeIndex * 100) / tabs.length}% + 6px)`,
        }}
      />

      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-anim flex-1 flex items-center justify-center gap-2 py-2.5 px-4 relative z-10 transition-all duration-300 group ${
              isActive ? 'text-white' : 'text-text-dim hover:text-gray-300'
            }`}
          >
            {Icon && (
              <Icon
                className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-primary scale-110' : 'group-hover:scale-110'}`}
              />
            )}
            <span className={`text-[14px] tracking-tight transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
