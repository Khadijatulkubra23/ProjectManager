import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock3,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { getProjects } from '../services/projectService'
import { getTasks } from '../services/taskService'

function Dashboard() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError('')

        const [projectsData, tasksData] = await Promise.all([
          getProjects(),
          getTasks(),
        ])

        // Make sure API responses are arrays
        setProjects(
          Array.isArray(projectsData)
            ? projectsData
            : []
        )

        setTasks(
          Array.isArray(tasksData)
            ? tasksData
            : []
        )
      } catch (error) {
        console.error('Dashboard API error:', error)
        setError('Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const completedTasks = tasks.filter(
    (task) => task.status === 'Completed'
  ).length

  const inProgressTasks = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length

  const todoTasks = tasks.filter(
    (task) => task.status === 'Todo'
  ).length

  const chartData = [
    {
      name: 'Completed',
      value: completedTasks,
    },
    {
      name: 'In Progress',
      value: inProgressTasks,
    },
    {
      name: 'Todo',
      value: todoTasks,
    },
  ]

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      gradient: 'from-purple-600 to-indigo-600',
    },
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: ListTodo,
      gradient: 'from-blue-600 to-cyan-500',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      gradient: 'from-emerald-600 to-teal-500',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock3,
      gradient: 'from-orange-500 to-pink-500',
    },
  ]

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <p className="text-sm text-purple-400">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <p className="text-sm text-purple-400">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Dashboard
          </h1>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-purple-400">
          Overview
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Here's what's happening with your projects today.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#11182b] p-5"
            >
              <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl`}
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    {stat.title}
                  </p>

                  <div className="rounded-xl bg-white/5 p-2">
                    <Icon
                      size={18}
                      className="text-slate-300"
                    />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        {/* Task Overview */}
        <div className="rounded-2xl border border-white/10 bg-[#11182b] p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Task Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current task distribution
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="h-64 w-full sm:w-1/2">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#8B5CF6" />
                    <Cell fill="#3B82F6" />
                    <Cell fill="#EC4899" />
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#11182b',
                      border:
                        '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-4 sm:w-1/2">
              {chartData.map((item, index) => {
                const colors = [
                  '#8B5CF6',
                  '#3B82F6',
                  '#EC4899',
                ]

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: colors[index],
                        }}
                      />

                      <span className="text-sm text-slate-400">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-white">
                      {item.value}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#11182b] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Recent Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest work activity
              </p>
            </div>

            <Link
              to="/tasks"
              className="text-sm font-medium text-purple-400 transition hover:text-purple-300"
            >
              View all
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-500">
                No tasks available.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {task.priority} priority
                    </p>
                  </div>

                  <span
                    className={`ml-4 shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      task.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : task.status === 'In Progress'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-pink-500/10 text-pink-400'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard