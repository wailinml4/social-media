import { useRef } from 'react'
import type { RefObject } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowLeft } from 'lucide-react'
import { useAuthPageAnimation } from '../../animations/useAuthPageAnimation.js'

const ResetPasswordSuccess = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  useAuthPageAnimation(containerRef)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 w-full" ref={containerRef}>
      <div className="auth-stagger mb-8 text-center">
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_20px_rgba(10,132,255,0.2)]">
          <Check size={24} />
        </div>
      </div>

      <div className="auth-stagger w-full max-w-[400px] bg-black/40 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-8 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">Password reset successful</h1>
          <p className="text-text-dim text-sm">Your password has been updated. You can now sign in with your new password.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="w-full bg-primary text-white rounded-2xl py-3.5 font-medium text-center hover:bg-primary/90 transition-colors"
          >
            Back to sign in
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-sm text-text-dim hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Return to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordSuccess
