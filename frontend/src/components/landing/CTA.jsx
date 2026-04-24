import React from 'react';

import { Link } from 'react-router-dom';

import Button from '../ui/Button';

const CTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary to-secondary p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8">Ready to find your signal?</h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto">
            Join 10,000+ early adopters shaping the future of digital connection. 
            Claim your username today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup"><Button variant="secondary" size="lg" className="px-12">
              Create Account
            </Button></Link>
            <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
              Contact Sales
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>
    </section>
  );
};

export default CTA;
