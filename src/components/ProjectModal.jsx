import { X } from 'lucide-react'
import ProjectForm from './ProjectForm'

function ProjectModal({
  isOpen,
  project,
  onSubmit,
  onCancel,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#11182b] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {project ? 'Edit Project' : 'Create Project'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {project
                ? 'Update your project details.'
                : 'Add a new project to your workspace.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <ProjectForm
          project={project}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  )
}

export default ProjectModal