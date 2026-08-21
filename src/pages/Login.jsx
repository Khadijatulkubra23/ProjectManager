import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = (event) => {
  event.preventDefault()

  console.log('LOGIN BUTTON CLICKED')

  setError('')

  const result = login(email, password)

  console.log('LOGIN RESULT:', result)

  if (!result.success) {
    setError(result.message)
    return
  }

  console.log('LOGIN SUCCESS - NAVIGATING')

  toast.success('Welcome back!')

  navigate('/dashboard')
}
  return (
    <div className="min-h-screen bg-[#080d1c] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
            <CheckSquare size={30} />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Project<span className="text-purple-400">Flow</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage work. Deliver success.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#11182b]/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-white">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to continue to your workspace.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#0b1224] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-[#0b1224] py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:from-purple-500 hover:to-pink-400 active:scale-[0.98]"
            >
              Sign in
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500">
            Demo application · No real account required
          </p>
        </div>
      </div>
    </div>
  )
}
export default Login