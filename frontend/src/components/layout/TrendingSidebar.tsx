import React from 'react'

import Card from '../ui/Card.jsx'
import SearchBar from './SearchBar.jsx'
import SuggestedUsers from './SuggestedUsers.jsx'

const TrendingSidebar = () => {
  return (
    <aside className="sticky top-0 h-screen w-[340px] shrink-0 hidden lg:block overflow-y-auto">
      <div className="h-full w-full px-4 py-5">
        <div className="flex h-full flex-col gap-4">
          <Card className="rounded-[32px] border border-white/10 bg-[#050505]/90 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <SearchBar className="mb-0" />
          </Card>

          <SuggestedUsers className="rounded-[32px] border border-white/10 bg-[#050505]/90 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl" />

        </div>
      </div>
    </aside>
  )
}

export default TrendingSidebar
