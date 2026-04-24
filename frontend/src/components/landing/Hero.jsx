import React from 'react';

import { ArrowRight, Play } from 'lucide-react';

import Button from '../ui/Button';

const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next Generation Social Interface
        </div>
        
        <h1 className="hero-title text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
          <span className="line block">Where context</span>
          <span className="line block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">meets connection.</span>
        </h1>
        
        <p className="hero-desc max-w-2xl mx-auto text-xl text-text-dim mb-12 leading-relaxed">
          Nexus is a minimal, high-signal social layer designed for deep interaction. 
          Built for creators, by creators.
        </p>
        
        <div className="hero-btns flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="px-10">
            Start Exploring <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="secondary" size="lg">
            <Play className="mr-2 w-5 h-5 fill-current" /> Watch Demo
          </Button>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] -z-10" />
    </section>
  );
};

export default Hero;
