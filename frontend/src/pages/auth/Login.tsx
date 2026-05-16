import { useRef } from 'react'
import Spinner from '../../components/loading/Spinner'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuthPageAnimation, useButtonHover } from '../../animations/useAuthPageAnimation.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { loginSchema } from '../../schemas/auth.schema.js'
import type { LoginInput } from '../../schemas/auth.schema.js'

const Login = () => {
  const { login, isLoggingIn, error } = useAuth()
  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useAuthPageAnimation(containerRef)

  const { handleMouseEnter: handleButtonHover, handleMouseLeave: handleButtonLeave } = useButtonHover()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch {
      // Error is handled by context and displayed via error state
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 w-full" ref={containerRef}>
      {/* Brand / Logo Area */}
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

      {/* Auth Card */}
      <div className="auth-stagger w-full max-w-[400px] spatial-panel p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">Welcome back</h1>
          <p className="text-text-dim text-sm">Enter your details to sign in to your account</p>
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

          <div className="auth-stagger relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full bg-white/[0.03] border rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300 ${
                errors.password ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Password"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message?.toString()}</p>}
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            ref={buttonRef}
            type="submit"
            disabled={isLoggingIn}
            onMouseEnter={e => handleButtonHover(e.currentTarget)}
            onMouseLeave={e => handleButtonLeave(e.currentTarget)}
            className="auth-stagger w-full mt-2 bg-primary text-white rounded-2xl py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
          >
            {isLoggingIn ? (
              <Spinner size="sm" />
            ) : (
              <>
                Sign in
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {error && <div className="mt-4 text-center text-sm text-red-400">{error}</div>}
        </form>

        <div className="auth-stagger mt-8 text-center">
          <p className="text-sm text-text-dim">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white font-medium hover:text-primary transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
