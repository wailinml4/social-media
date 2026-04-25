import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useAuthPageAnimation, useButtonHover } from '../../animations/useAuthPageAnimation';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const { forgotPassword, isSendingForgotPassword, error } = useAuth();

  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useAuthPageAnimation(containerRef);

  const { handleMouseEnter: handleButtonHover, handleMouseLeave: handleButtonLeave } = useButtonHover();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSent(true);
    } catch (error) {
      // Error is handled by context and displayed via error state
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 w-full" ref={containerRef}>
      
      <div className="auth-stagger mb-8 text-center">
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_20px_rgba(10,132,255,0.2)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>

      <div className="auth-stagger w-full max-w-[400px] bg-black/40 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-8 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        
        {!isSent ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">Reset password</h1>
              <p className="text-text-dim text-sm">Enter your email and we'll send you instructions to reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={isSendingForgotPassword}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                className="auth-stagger w-full mt-2 bg-primary text-white rounded-2xl py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
              >
                {isSendingForgotPassword ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send instructions
                    <Send size={18} />
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 text-center text-sm text-red-400">
                  {error}
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="success-animation text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <Mail size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Check your email</h2>
            <p className="text-text-dim text-sm mb-8">
              We've sent a password reset link to <br/><span className="text-white font-medium">{email}</span>
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="w-full bg-white/[0.05] text-white border border-white/10 rounded-2xl py-3.5 font-medium hover:bg-white/10 transition-colors"
            >
              Didn't receive the email?
            </button>
          </div>
        )}

        <div className="auth-stagger mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-text-dim hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
