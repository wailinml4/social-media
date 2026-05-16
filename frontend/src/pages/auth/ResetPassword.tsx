import { useState, useRef } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Lock, ArrowRight } from 'lucide-react'
import Spinner from '../../components/loading/Spinner'
import { useAuthPageAnimation, useButtonHover } from '../../animations/useAuthPageAnimation.js'
import { useAuth } from '../../context/AuthContext.jsx'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { resetPassword, isResettingPassword, error } = useAuth()
  const navigate = useNavigate()
  const { token } = useParams()

  const containerRef = useRef<HTMLDivElement>(null)

  useAuthPageAnimation(containerRef)

  const { handleMouseEnter: handleButtonHover, handleMouseLeave: handleButtonLeave } = useButtonHover()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return
    }

    if (!token) {
      return
    }

    try {
      await resetPassword(token, password)
      navigate('/reset-password-success')
    } catch {
      // Error is handled by context and displayed via error state
    }
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)

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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">Create new password</h1>
          <p className="text-text-dim text-sm">Your new password must be different from previous used passwords.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="password-fields space-y-4">
            <div className="auth-stagger relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300"
                placeholder="New password"
                required
              />
            </div>

            <div className="auth-stagger relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full bg-white/[0.03] border rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none transition-all duration-300 ${
                  confirmPassword && password !== confirmPassword
                    ? 'border-red-500/50 focus:border-red-500/50'
                    : 'border-white/10 focus:border-primary/50 focus:bg-primary/[0.02]'
                }`}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isResettingPassword}
            onMouseEnter={e => handleButtonHover(e.currentTarget)}
            onMouseLeave={e => handleButtonLeave(e.currentTarget)}
            className="auth-stagger w-full mt-2 bg-primary text-white rounded-2xl py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
          >
            {isResettingPassword ? (
              <Spinner size="sm" />
            ) : (
              <>
                Reset password
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {error && <div className="mt-4 text-center text-sm text-red-400">{error}</div>}
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
