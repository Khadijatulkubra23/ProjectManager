import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-white/10 bg-[#0d1426] px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white">
          Project<span className="text-purple-400">Flow</span>
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">
            {user?.name}
          </p>

          <p className="text-xs text-slate-500">
            Project Manager
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar