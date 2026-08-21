import { useEffect, useState } from 'react'
import {
  required,
  minLength,
} from '../utils/validation'

const initialForm = {
  title: '',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  projectId: '',
  assignedTo: '',
}

function TaskForm({
  task,
  projects,
  users,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Todo',
        priority: task.priority || 'Medium',
        projectId: task.projectId || '',
        assignedTo: task.assignedTo || '',
      })
    } else {
      setForm(initialForm)
    }

    setErrors({})
  }, [task])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: '',
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    const titleRequired = required(
      form.title,
      'Task title is required.'
    )

    const titleLength = minLength(
      form.title,
      3,
      'Task title must be at least 3 characters.'
    )

    const descriptionRequired = required(
      form.description,
      'Task description is required.'
    )

    if (titleRequired) {
      newErrors.title = titleRequired
    } else if (titleLength) {
      newErrors.title = titleLength
    }

    if (descriptionRequired) {
      newErrors.description = descriptionRequired
    }

    if (!form.assignedTo) {
      newErrors.assignedTo =
        'Please assign the task to a user.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      projectId: form.projectId || null,
      assignedTo: form.assignedTo,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Task Title
        </label>

        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Design login page"
          className={`w-full rounded-xl border bg-[#0b1224] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-2 ${
            errors.title
              ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
              : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
          }`}
        />

        {errors.title && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.title}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          placeholder="Describe the task..."
          className={`w-full resize-none rounded-xl border bg-[#0b1224] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-2 ${
            errors.description
              ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
              : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
          }`}
        />

        {errors.description && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.description}
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

      </div>
      <div className="grid gap-4 sm:grid-cols-2">

        <div>
          <label
            htmlFor="projectId"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Project
          </label>

          <select
            id="projectId"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="">
              No project
            </option>

            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="assignedTo"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Assign User
          </label>

          <select
            id="assignedTo"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className={`w-full rounded-xl border bg-[#0b1224] px-4 py-3 text-sm text-white outline-none focus:ring-2 ${
              errors.assignedTo
                ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
            }`}
          >
            <option value="">
              Select user
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name} — {user.role}
              </option>
            ))}
          </select>

          {errors.assignedTo && (
            <p className="mt-1.5 text-xs text-red-400">
              {errors.assignedTo}
            </p>
          )}
        </div>

      </div>
      <div className="flex justify-end gap-3 pt-2">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:from-purple-500 hover:to-pink-400"
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>

      </div>

    </form>
  )
}

export default TaskForm