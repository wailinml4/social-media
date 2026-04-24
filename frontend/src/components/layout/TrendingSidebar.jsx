import React, { useEffect, useRef } from 'react';

import { Sparkles } from 'lucide-react';

import Button from '../ui/Button';
import Card from '../ui/Card';
import SearchBar from './SearchBar';
import SuggestedUsers from './SuggestedUsers';
import TrendingTopics from './TrendingTopics';
import { useSlideInPanel } from '../../animations/useSlideInPanel';

const TrendingSidebar = () => {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const { openPanel, closePanel, initializePanel } = useSlideInPanel(panelRef, triggerRef);

  useEffect(() => {
    initializePanel(rootRef);
  }, [initializePanel]);

  return (
    <div ref={rootRef} className="pointer-events-none">
      <div
        ref={triggerRef}
        aria-hidden="true"
        className="fixed inset-y-0 right-0 z-40 hidden w-8 pointer-events-auto lg:block"
        onMouseEnter={openPanel}
      >
        <div className="absolute inset-y-[18%] right-0 flex w-full items-center justify-end pr-2">
          <div className="h-28 w-[3px] rounded-full bg-white/12 shadow-[0_0_18px_rgba(255,255,255,0.08)]" />
        </div>
      </div>

      <aside
        ref={panelRef}
        className="fixed right-0 top-0 z-50 hidden h-screen w-full max-w-[380px] pointer-events-none lg:block"
        onMouseEnter={openPanel}
        onMouseLeave={closePanel}
      >
        <div className="flex h-full w-full flex-col border-l border-white/10 bg-[rgba(8,8,10,0.82)] px-4 py-5 shadow-[-24px_0_80px_rgba(0,0,0,0.32)] backdrop-blur-[26px]">
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/35">Context</p>
              <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-white">Discover</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6">
              <Sparkles className="h-4 w-4 text-white/70" />
            </div>
          </div>

          <div className="no-scrollbar flex-1 overflow-y-auto pr-1">
            <SearchBar className="mb-4" />

            <Card className="trending-sidebar-card mb-4 border-white/10 bg-white/[0.045] p-5 shadow-none">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">Upgrade</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">Premium, without the noise</h3>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Unlock higher reach, cleaner analytics, and creator tools inside a calmer workspace.
              </p>
              <Button size="sm" className="mt-5 rounded-full bg-white px-5 text-black shadow-none hover:bg-white/90">
                Subscribe
              </Button>
            </Card>

            <TrendingTopics />
            <SuggestedUsers />

            <div className="trending-sidebar-card flex flex-wrap gap-x-3 gap-y-1 px-1 text-[11px] text-white/32">
              <a href="#" className="transition-colors hover:text-white/60">Terms</a>
              <a href="#" className="transition-colors hover:text-white/60">Privacy</a>
              <a href="#" className="transition-colors hover:text-white/60">Cookies</a>
              <a href="#" className="transition-colors hover:text-white/60">Accessibility</a>
              <a href="#" className="transition-colors hover:text-white/60">Ads</a>
              <span>© 2026 Nexus Corp.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TrendingSidebar;
