import React from 'react';

import { Link } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

import Button from '../ui/Button';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_20px_rgba(10,132,255,0.2)]">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Wall of Love', 'Pricing', 'About'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-text-dim hover:text-white transition-colors">
              {item}
            </a>
          ))}
          <Link to="/login"><Button variant="outline" size="sm">Log In</Button></Link>
          <Link to="/signup"><Button size="sm">Get Started</Button></Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-6 right-6 mt-4 p-6 rounded-3xl bg-black/90 backdrop-blur-2xl border border-white/10 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            {['Features', 'Wall of Love', 'Pricing', 'About'].map((item) => (
              <a key={item} href="#" className="text-lg font-medium text-gray-400 hover:text-white">{item}</a>
            ))}
            <div className="h-px bg-white/10" />
            <Link to="/login"><Button variant="outline" className="w-full">Log In</Button></Link>
            <Link to="/signup"><Button className="w-full">Get Started</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
