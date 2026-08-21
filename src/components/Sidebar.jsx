import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
} from 'lucide-react'

function Sidebar() {
  const links = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderKanban,
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: CheckSquare,
    },
  ]

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-white/10 bg-[#0d1426] p-4 md:block">
      <div className="mb-8 px-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Workspace
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-purple-500/15 text-purple-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {link.name}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-8 border-t border-white/10 pt-6">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  )
}

export default Sidebar