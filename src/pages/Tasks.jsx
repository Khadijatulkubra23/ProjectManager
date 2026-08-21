import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setTasks,
  setLoading,
  setError,
  addTask,
  updateTask as updateTaskState,
  removeTask,
} from '../store/tasksSlice'
import {
  ListTodo,
  Plus,
  Search,
  Pencil,
  Trash2,
  User,
  FolderKanban,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskApi,
} from '../services/taskService'
import { getProjects } from '../services/projectService'
import { getUsers } from '../services/userService'
import TaskModal from '../components/TaskModal'
import DeleteModal from '../components/DeleteModal'
function Tasks() {
  const dispatch = useDispatch()
  const {
    tasks,
    loading,
    error,
  } = useSelector((state) => state.tasks)
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteTask, setDeleteTask] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const loadTaskData = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(''))
      const [tasksData, projectsData, usersData] =
        await Promise.all([
          getTasks(),
          getProjects(),
          getUsers(),
        ])
      dispatch(setTasks(tasksData))
      setProjects(projectsData)
      setUsers(usersData)
    } catch (error) {
      console.error(error)
      dispatch(
        setError('Unable to load task data.')
      )
    } finally {
      dispatch(setLoading(false))
    }
  }
  useEffect(() => {
    loadTaskData()
  }, [])
  const openCreateModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }
  const openEditModal = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }
  const handleSubmit = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await updateTask(
          editingTask.id,
          taskData
        )
        dispatch(updateTaskState(updatedTask))
        toast.success(
          'Task updated successfully.'
        )
      } else {
        const newTask = await createTask(taskData)
        dispatch(addTask(newTask))
        toast.success(
          'Task created successfully.'
        )
      }
      closeModal()
    } catch (error) {
      console.error(error)
      toast.error(
        'Something went wrong. Please try again.'
      )
    }
  }
  const openDeleteModal = (task) => {
    setDeleteTask(task)
  }
  const closeDeleteModal = () => {
    if (deletingId) {
      return
    }
    setDeleteTask(null)
  }
  const handleDelete = async () => {
    if (!deleteTask) {
      return
    }
    try {
      setDeletingId(deleteTask.id)
      await deleteTaskApi(deleteTask.id)
      dispatch(removeTask(deleteTask.id))
      toast.success(
        'Task deleted successfully.'
      )
      setDeleteTask(null)
    } catch (error) {
      console.error(error)
      toast.error(
        'Unable to delete task.'
      )
    } finally {
      setDeletingId(null)
    }
  }
  const getUserName = (userId) => {
    const user = users.find(
      (user) =>
        String(user.id) === String(userId)
    )
    return user ? user.name : 'Unassigned'
  }
  const getProjectName = (projectId) => {
    const project = projects.find(
      (project) =>
        String(project.id) === String(projectId)
    )
    return project ? project.name : 'No project'
  }
  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase()
    const matchesSearch =
      task.title
        ?.toLowerCase()
        .includes(search) ||
      task.description
        ?.toLowerCase()
        .includes(search)
    const matchesStatus =
      statusFilter === 'All' ||
      task.status === statusFilter
    const matchesPriority =
      priorityFilter === 'All' ||
      task.priority === priorityFilter
    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    )
  })
  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className="text-sm font-medium text-white">
      Workspace
    </p>

    <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
      Tasks
    </h1>

    <p className="mt-2 text-sm text-slate-400">
      Create, assign and track your project tasks.
    </p>
  </div>

  <button
    onClick={openCreateModal}
    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:from-purple-500 hover:to-pink-400"
  >
    <Plus size={18} />
    Add Task
  </button>
</div>
      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search tasks..."
            className="w-full rounded-xl border border-white/10 bg-[#11182b] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-xl border border-white/10 bg-[#11182b] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        >
          <option value="All">
            All Statuses
          </option>
          <option value="Todo">
            Todo
          </option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>
        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value)
          }
          className="rounded-xl border border-white/10 bg-[#11182b] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        >
          <option value="All">
            All Priorities
          </option>
          <option value="High">
            High
          </option>
          <option value="Medium">
            Medium
          </option>
          <option value="Low">
            Low
          </option>
        </select>
      </div>
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-red-400">
              {error}
            </span>
            <button
              onClick={loadTaskData}
              disabled={loading}
              className="w-fit rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#11182b] py-20 text-center">
          <p className="text-slate-400">
            Loading tasks...
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#11182b] py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
            <ListTodo
              size={26}
              className="text-purple-400"
            />
          </div>
          <h2 className="text-lg font-semibold text-white">
            No tasks found
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            {searchTerm ||
            statusFilter !== 'All' ||
            priorityFilter !== 'All'
              ? 'Try changing your search or filters.'
              : 'Create your first task to get started.'}
          </p>
          {!searchTerm &&
            statusFilter === 'All' &&
            priorityFilter === 'All' && (
              <button
                onClick={openCreateModal}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                Create Task
              </button>
            )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#11182b]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Task
                  </th>
                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Project
                  </th>
                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Assigned To
                  </th>
                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Priority
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-white/5 last:border-0 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-white">
                          {task.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {task.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <FolderKanban
                          size={15}
                          className="text-purple-400"
                        />
                        {getProjectName(
                          task.projectId
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <User
                          size={15}
                          className="text-blue-400"
                        />
                        {getUserName(
                          task.assignedTo
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          task.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : task.status === 'In Progress'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-orange-500/10 text-orange-400'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          task.priority === 'High'
                            ? 'bg-red-500/10 text-red-400'
                            : task.priority === 'Medium'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEditModal(task)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                          title="Edit task"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            openDeleteModal(task)
                          }
                          disabled={
                            deletingId === task.id
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <TaskModal isOpen={isModalOpen} task={editingTask} projects={projects}
        users={users} onSubmit={handleSubmit} onCancel={closeModal}
      />
      <DeleteModal isOpen={Boolean(deleteTask)} project={deleteTask} onConfirm={handleDelete}
        onCancel={closeDeleteModal} loading={Boolean(deletingId)}
      />
    </div>
  )
}
export default Tasks