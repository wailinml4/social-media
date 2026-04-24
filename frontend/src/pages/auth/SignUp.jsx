import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuthPageAnimation, useButtonHover } from '../../animations/useAuthPageAnimation';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isSigningUp, error } = useAuth();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useAuthPageAnimation(containerRef);

  const { handleMouseEnter: handleButtonHover, handleMouseLeave: handleButtonLeave } = useButtonHover();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password, confirmPassword);
      navigate('/verify-email');
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 relative z-10 w-full overflow-hidden" ref={containerRef}>
      
      <div className="auth-stagger mb-6 text-center">
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20 shadow-[0_0_20px_rgba(10,132,255,0.2)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>

      <div className="auth-stagger w-full max-w-[400px] bg-black/40 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Create an account</h1>
          <p className="text-text-dim text-sm">Join us and start your journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="auth-stagger relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
              <User size={18} />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300"
              placeholder="Full name"
              required
            />
          </div>

          <div className="auth-stagger relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300"
              placeholder="Email"
              required
            />
          </div>

          <div className="auth-stagger relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300"
              placeholder="Password"
              required
            />
          </div>

          <div className="auth-stagger relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
              <Lock size={18} />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-white/[0.03] border rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none transition-all duration-300 ${
                confirmPassword && password !== confirmPassword 
                  ? 'border-red-500/50 focus:border-red-500/50' 
                  : 'border-white/10 focus:border-primary/50 focus:bg-primary/[0.02]'
              }`}
              placeholder="Confirm password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            className="auth-stagger w-full bg-primary text-white rounded-2xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
          >
            {isSigningUp ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 text-center text-sm text-red-400">
              {error}
            </div>
          )}
        </form>

        <div className="auth-stagger mt-6 text-center">
          <p className="text-sm text-text-dim">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:text-primary transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
