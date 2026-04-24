import React, { useRef, useState } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import AppPreview from '../components/landing/AppPreview';
import CTA from '../components/landing/CTA';
import Features from '../components/landing/Features';
import Footer from '../components/landing/Footer';
import Hero from '../components/landing/Hero';
import Navbar from '../components/landing/Navbar';
import Testimonials from '../components/landing/Testimonials';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const container = useRef();

  useGSAP(() => {
    // Media Query for reduced motion
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Special Hero Animations (Immediate)
      const tl = gsap.timeline();
      tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(".hero-title .line", { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.4")
        .from(".hero-desc", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(".hero-btns", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
    });
  }, { scope: container });

  return (
    <div ref={container} className="bg-bg-dark text-white selection:bg-primary/30">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main>
        <Hero />
        <Features />
        <AppPreview />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
