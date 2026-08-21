import { useEffect, useState } from 'react'
import {
  required,
  minLength,
} from '../utils/validation'

const initialForm = {
  name: '',
  description: '',
  status: 'Planning',
}

function ProjectForm({
  project,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'Planning',
      })
    } else {
      setForm(initialForm)
    }

    setErrors({})
  }, [project])

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

    const nameRequired = required(
      form.name,
      'Project name is required.'
    )

    const nameLength = minLength(
      form.name,
      3,
      'Project name must be at least 3 characters.'
    )

    const descriptionRequired = required(
      form.description,
      'Project description is required.'
    )

    if (nameRequired) {
      newErrors.name = nameRequired
    } else if (nameLength) {
      newErrors.name = nameLength
    }

    if (descriptionRequired) {
      newErrors.description =
        descriptionRequired
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
      name: form.name.trim(),
      description: form.description.trim(),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Project Name
        </label>

        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. HR Management System"
          className={`w-full rounded-xl border bg-[#0b1224] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-2 ${
            errors.name
              ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
              : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
          }`}
        />

        {errors.name && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.name}
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
          rows="4"
          placeholder="Describe the project..."
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
          <option value="Planning">
            Planning
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>
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
          {project
            ? 'Update Project'
            : 'Create Project'}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm