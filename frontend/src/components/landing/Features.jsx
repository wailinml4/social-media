import React, { useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import FeatureCard from './FeatureCard';

import { landingFeatures } from '../../data/landing';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.from(".feature-card", {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });
  }, { scope: container });

  return (
    <section id="features" ref={container} className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for the modern web</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to build your audience and engage your community, 
            without the noise of traditional social media.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
