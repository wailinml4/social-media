import React, { useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

import { landingMockPosts } from '../../data/landing';

gsap.registerPlugin(ScrollTrigger);

const MockPost = ({ name, handle, time, content, likes, comments, className = '' }) => (
  <div className={`mock-post p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.06] transition-colors duration-300 ${className}`}>
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-white truncate">{name}</span>
          <span className="text-text-dim text-sm truncate">{handle}</span>
          <span className="text-gray-600 text-sm">·</span>
          <span className="text-text-dim text-sm">{time}</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">{content}</p>
        <div className="flex items-center gap-6 text-text-dim">
          <div className="flex items-center gap-2 group">
            <Heart className="w-4 h-4 group-hover:text-pink-500 transition-colors" />
            <span className="text-xs">{likes}</span>
          </div>
          <div className="flex items-center gap-2 group">
            <MessageCircle className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="text-xs">{comments}</span>
          </div>
          <Share2 className="w-4 h-4 hover:text-green-500 transition-colors" />
        </div>
      </div>
    </div>
  </div>
);

const AppPreview = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.from(".mock-post", {
      opacity: 0,
      x: 50,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.from(".app-preview-text > *", {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%"
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-6 overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 text-left app-preview-text">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Designed for clarity.</h2>
          <p className="text-text-dim text-lg mb-8 leading-relaxed">
            Stop fighting algorithms. Nexus provides a clean, chronological experience 
            that puts your content and your community first.
          </p>
          <ul className="space-y-4 text-gray-300">
            {['Chronological Feed', 'No Targeted Ads', 'End-to-End Encryption'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:w-1/2 relative">
          <div className="mock-posts-container flex flex-col gap-4">
            {landingMockPosts.map((post, index) => (
              <MockPost key={index} {...post} />
            ))}
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl -z-10" />
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
