import React, { useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Card from '../ui/Card';

import { testimonials } from '../../data/landing';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.from(".testimonial-card", {
      opacity: 0,
      scale: 0.9,
      y: 30,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }, { scope: container });

  return (
    <section id="wall-of-love" ref={container} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Wall of Love</h2>
          <p className="text-gray-400 text-lg">Join thousands of creators who've already made the switch.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <Card className="p-8 h-full">
                <p className="text-gray-300 text-lg mb-8 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800" />
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
