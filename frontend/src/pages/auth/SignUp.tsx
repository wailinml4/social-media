import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import Spinner from '../../components/loading/Spinner'
import { useAuthPageAnimation, useButtonHover } from '../../animations/useAuthPageAnimation.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { signupSchema } from '../../schemas/auth.schema.js'
import type { SignupInput } from '../../schemas/auth.schema.js'

const SignUp = () => {
  const { signup, isSigningUp, error } = useAuth()
  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null)

  useAuthPageAnimation(containerRef)

  const { handleMouseEnter: handleButtonHover, handleMouseLeave: handleButtonLeave } = useButtonHover()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    try {
      await signup(data.name, data.username, data.email, data.password, data.confirmPassword)
      navigate('/verify-email')
    } catch {
      // Error is handled by context and displayed via error state
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 relative z-10 w-full overflow-hidden" ref={containerRef}>
      <div className="auth-stagger mb-6 text-center">
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20 shadow-[0_0_20px_rgba(10,132,255,0.2)]">
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

      <div className="auth-stagger w-full max-w-[400px] bg-black/40 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Create an account</h1>
          <p className="text-text-dim text-sm">Join us and start your journey today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="auth-stagger relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
              <User size={18} />
            </div>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full bg-white/[0.03] border rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300 ${
                errors.name ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Full name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message?.toString()}</p>}
          </div>

          <div className="auth-stagger relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
              <span className="text-sm font-medium">@</span>
            </div>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`w-full bg-white/[0.03] border rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300 ${
                errors.username ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Username"
            />
            {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message?.toString()}</p>}
          </div>

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

          <div className="auth-stagger relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
              <Lock size={18} />
            </div>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={`w-full bg-white/[0.03] border rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none transition-all duration-300 ${
                errors.confirmPassword ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message?.toString()}</p>}
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            onMouseEnter={e => handleButtonHover(e.currentTarget)}
            onMouseLeave={e => handleButtonLeave(e.currentTarget)}
            className="auth-stagger w-full bg-primary text-white rounded-2xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
          >
            {isSigningUp ? (
              <Spinner size="sm" />
            ) : (
              <>
                Create account
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {error && <div className="mt-4 text-center text-sm text-red-400">{error}</div>}
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
  )
}

export default SignUp
