import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import Spinner from '../../components/loading/Spinner'
import { useAuthPageAnimation, useButtonHover } from '../../animations/useAuthPageAnimation.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { forgotPasswordSchema } from '../../schemas/auth.schema.js'
import type { ForgotPasswordInput } from '../../schemas/auth.schema.js'

const ForgotPassword = () => {
  const [isSent, setIsSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const { forgotPassword, isSendingForgotPassword, error } = useAuth()

  const containerRef = useRef<HTMLDivElement>(null)

  useAuthPageAnimation(containerRef)

  const { handleMouseEnter: handleButtonHover, handleMouseLeave: handleButtonLeave } = useButtonHover()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPassword(data.email)
      setSubmittedEmail(data.email)
      setIsSent(true)
    } catch {
      // Error is handled by context and displayed via error state
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 w-full" ref={containerRef}>
      <div className="auth-stagger mb-8 text-center">
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_20px_rgba(10,132,255,0.2)]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      <div className="auth-stagger w-full max-w-[400px] spatial-panel p-8 sm:p-10">
        {!isSent ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">Reset password</h1>
              <p className="text-text-dim text-sm">Enter your email and we'll send you instructions to reset your password</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="auth-stagger relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`w-full bg-white/[0.03] border rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300 ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Email"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message?.toString()}</p>}
              </div>

              <button
                type="submit"
                disabled={isSendingForgotPassword}
                onMouseEnter={e => handleButtonHover(e.currentTarget)}
                onMouseLeave={e => handleButtonLeave(e.currentTarget)}
                className="auth-stagger w-full mt-2 bg-primary text-white rounded-2xl py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
              >
                {isSendingForgotPassword ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    Send instructions
                    <Send size={18} />
                  </>
                )}
              </button>

              {error && <div className="mt-4 text-center text-sm text-red-400">{error}</div>}
            </form>
          </>
        ) : (
          <div className="success-animation text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <Mail size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Check your email</h2>
            <p className="text-text-dim text-sm mb-8">
              We've sent a password reset link to <br />
              <span className="text-white font-medium">{submittedEmail}</span>
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
  )
}

export default ForgotPassword
