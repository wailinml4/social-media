import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { useAuthPageAnimation, useButtonHover } from '../../animations/useAuthPageAnimation';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const { verifyEmail, resendVerificationEmail, isVerifyingEmail, isResendingVerificationEmail, error, user } = useAuth();
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useAuthPageAnimation(containerRef);

  const { handleMouseEnter: handleButtonHover, handleMouseLeave: handleButtonLeave } = useButtonHover();

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance
    if (value !== '' && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const pastedCode = pastedData.split('').slice(0, 6);

    if (pastedCode.some(char => isNaN(char))) return;

    const newCode = [...code];
    pastedCode.forEach((char, index) => {
      if (index < 6) {
        newCode[index] = char;
      }
    });
    setCode(newCode);

    // Focus the last filled input or the next empty one
    const lastIndex = Math.min(pastedCode.length, 5);
    inputsRef.current[lastIndex]?.focus();

    // Auto-submit if all 6 digits are pasted
    if (pastedCode.length === 6) {
      setTimeout(() => {
        handleSubmit(e);
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.join('').length !== 6) return;

    try {
      await verifyEmail(code.join(''));
      setIsVerified(true);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      // Error is handled by context and displayed via error state
    }
  };

  const handleResend = async () => {
    try {
      await resendVerificationEmail(user?.email);
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
        
        {!isVerified ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">Verify your email</h1>
              <p className="text-text-dim text-sm">We've sent a code to your email. Please enter it below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="auth-stagger flex justify-between gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 bg-white/[0.03] border border-white/10 rounded-2xl text-center text-xl text-white font-medium outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifyingEmail || code.join('').length !== 6}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                className="auth-stagger w-full mt-2 bg-primary text-white rounded-2xl py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
              >
                {isVerifyingEmail ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify email
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

            <div className="auth-stagger mt-8 text-center">
              <p className="text-sm text-text-dim">
                Didn't receive a code?{' '}
                <button
                  onClick={handleResend}
                  disabled={isResendingVerificationEmail}
                  className="text-white font-medium hover:text-primary transition-colors disabled:opacity-50"
                >
                  {isResendingVerificationEmail ? 'Sending...' : 'Resend'}
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="success-animation text-center py-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Email Verified</h2>
            <p className="text-text-dim text-sm mb-4">
              Your account has been successfully verified. Redirecting...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
