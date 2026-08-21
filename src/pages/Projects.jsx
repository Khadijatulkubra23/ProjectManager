import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FolderKanban,
  Plus,
  Search,
  Pencil,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'

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
  const [statusFilter, setStatusFilter] = useState('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const [deleteProject, setDeleteProject] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(''))

      const projectsData = await getProjects()

      dispatch(
        setProjects(
          Array.isArray(projectsData)
            ? projectsData
            : []
        )
      )
    } catch (error) {
      console.error(error)
      dispatch(
        setError('Unable to load project data.')
      )
    } finally {
      dispatch(setLoading(false))
    }
  }

  const openCreateModal = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const openEditModal = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
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
        const newProject =
          await createProject(projectData)

        dispatch(addProject(newProject))

        toast.success(
          'Project created successfully.'
        )
      }

      closeModal()
    } catch (error) {
      console.error(error)

      toast.error(
        editingProject
          ? 'Unable to update project.'
          : 'Unable to create project.'
      )
    }
  }

  const openDeleteModal = (project) => {
    setDeleteProject(project)
  }

  const closeDeleteModal = () => {
    if (deletingId) {
      return
    }

    setDeleteProject(null)
  }

  const handleDelete = async () => {
    if (!deleteProject) {
      return
    }

    try {
      setDeletingId(deleteProject.id)

      await deleteProjectApi(
        deleteProject.id
      )

      dispatch(
        removeProject(deleteProject.id)
      )

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

  const safeProjects = Array.isArray(projects)
    ? projects
    : []

  const filteredProjects =
    safeProjects.filter((project) => {
      const search =
        searchTerm.toLowerCase()

      const matchesSearch =
        project.name
          ?.toLowerCase()
          .includes(search) ||
        project.description
          ?.toLowerCase()
          .includes(search)

      const matchesStatus =
        statusFilter === 'All' ||
        project.status === statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })

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

        <div className="rounded-2xl border border-white/10 bg-[#11182b] py-20 text-center">
          <p className="text-slate-400">
            Loading projects...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-purple-400">
            Workspace
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Projects
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage and track all your projects.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:from-purple-500 hover:to-pink-400"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search projects..."
            className="w-full rounded-xl border border-white/10 bg-[#11182b] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-white/10 bg-[#11182b] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
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
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <div className="flex items-center justify-between gap-4">
            <span>{error}</span>

            <button
              type="button"
              onClick={loadProjects}
              className="font-medium text-red-300 hover:text-white"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#11182b] py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
            <FolderKanban
              size={26}
              className="text-purple-400"
            />
          </div>

          <h2 className="text-lg font-semibold text-white">
            No projects found
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            {searchTerm ||
            statusFilter !== 'All'
              ? 'Try changing your search or filter.'
              : 'Create your first project to get started.'}
          </p>

          {!searchTerm &&
            statusFilter === 'All' && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                Create Project
              </button>
            )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map(
            (project) => (
              <div
                key={project.id}
                className="group rounded-2xl border border-white/10 bg-[#11182b] p-5 transition hover:-translate-y-1 hover:border-purple-500/30"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                      <FolderKanban
                        size={20}
                        className="text-purple-400"
                      />
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-white">
                        {project.name}
                      </h2>

                      <p className="text-xs text-slate-500">
                        Project #{project.id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      project.status ===
                      'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : project.status ===
                          'In Progress'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-orange-500/10 text-orange-400'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="min-h-12 text-sm leading-6 text-slate-400">
                  {project.description}
                </p>

                <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(project)
                    }
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-blue-500/10 hover:text-blue-400"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openDeleteModal(project)
                    }
                    disabled={
                      deletingId ===
                      project.id
                    }
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={15} />

                    {deletingId ===
                    project.id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
      <ProjectModal
        isOpen={isModalOpen}
        project={editingProject}
        onSubmit={handleSubmit}
        onCancel={closeModal}
      />
      <DeleteModal
        isOpen={Boolean(deleteProject)}
        project={deleteProject}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        loading={Boolean(deletingId)}
      />
    </div>
  )
}

export default Projects