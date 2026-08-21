import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FolderKanban,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useDebounce from '../hooks/useDebounce'

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject as deleteProjectApi,
} from '../services/projectService'

import {
  setProjects,
  setLoading,
  setError,
  addProject,
  updateProject as updateProjectState,
  removeProject,
} from '../store/projectsSlice'

import ProjectModal from '../components/ProjectModal'
import DeleteModal from '../components/DeleteModal'

function Projects() {
  const dispatch = useDispatch()

  const {
    projects,
    loading,
    error,
  } = useSelector((state) => state.projects)

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(
    searchTerm,
    400
  )

  const [statusFilter, setStatusFilter] = useState('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const [deleteProject, setDeleteProject] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const loadProjects = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(''))

      const projectsData = await getProjects()

      dispatch(setProjects(projectsData))
    } catch (error) {
      console.error(error)

      dispatch(
        setError('Unable to load project data.')
      )
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const filteredProjects = useMemo(() => {
    const search = debouncedSearchTerm
      .trim()
      .toLowerCase()

    return projects.filter((project) => {
      const matchesSearch =
        !search ||
        project.name
          ?.toLowerCase()
          .includes(search) ||
        project.description
          ?.toLowerCase()
          .includes(search)

      const matchesStatus =
        statusFilter === 'All' ||
        project.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [
    projects,
    debouncedSearchTerm,
    statusFilter,
  ])

  const handleAddProject = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleSubmit = async (projectData) => {
    try {
      if (editingProject) {
        const updatedProject = await updateProject(
          editingProject.id,
          projectData
        )

        dispatch(
          updateProjectState(updatedProject)
        )

        toast.success(
          'Project updated successfully.'
        )
      } else {
        const newProject = await createProject(
          projectData
        )

        dispatch(addProject(newProject))

        toast.success(
          'Project created successfully.'
        )
      }

      setIsModalOpen(false)
      setEditingProject(null)
    } catch (error) {
      console.error(error)

      toast.error(
        editingProject
          ? 'Unable to update project.'
          : 'Unable to create project.'
      )
    }
  }

  const handleDelete = async () => {
    if (!deleteProject) return

    try {
      setDeletingId(deleteProject.id)

      await deleteProjectApi(deleteProject.id)

      dispatch(removeProject(deleteProject.id))

      toast.success(
        'Project deleted successfully.'
      )

      setDeleteProject(null)
    } catch (error) {
      console.error(error)

      toast.error(
        'Unable to delete project.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <p className="text-sm text-purple-400">
            Workspace
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Projects
          </h1>
        </div>

        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#11182b] py-20">
          <p className="text-slate-400">
            Loading projects...
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
            Workspace
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Projects
          </h1>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-red-400">
            {error}
          </p>

          <button
            onClick={loadProjects}
            className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-purple-400">
            Workspace
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Projects
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage and track your projects.
          </p>
        </div>

        <button
          onClick={handleAddProject}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-[#11182b] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-purple-500/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-xl border border-white/10 bg-[#11182b] px-4 py-3 text-sm text-slate-300 outline-none focus:border-purple-500/50"
        >
          <option value="All">
            All Statuses
          </option>

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

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#11182b] px-6 py-16 text-center">
          <FolderKanban
            size={42}
            className="mx-auto text-slate-600"
          />

          <h3 className="mt-4 text-lg font-semibold text-white">
            No projects found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-white/10 bg-[#11182b] p-5 transition hover:border-purple-500/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <FolderKanban
                    size={20}
                    className="text-purple-400"
                  />
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    project.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : project.status === 'In Progress'
                        ? 'bg-orange-500/10 text-orange-400'
                        : 'bg-slate-500/10 text-slate-400'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {project.name}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                {project.description}
              </p>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/5 pt-4">
                <button
                  onClick={() =>
                    handleEditProject(project)
                  }
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                  title="Edit project"
                >
                  <Pencil size={17} />
                </button>

                <button
                  onClick={() =>
                    setDeleteProject(project)
                  }
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                  title="Delete project"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProject(null)
        }}
        onSubmit={handleSubmit}
        project={editingProject}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={Boolean(deleteProject)}
        onClose={() => setDeleteProject(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={
          deleteProject
            ? `Are you sure you want to delete "${deleteProject.name}"? This action cannot be undone.`
            : ''
        }
        loading={Boolean(deletingId)}
      />
    </div>
  )
}

export default Projects