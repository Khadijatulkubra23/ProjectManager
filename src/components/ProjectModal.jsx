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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#11182b] p-6 shadow-2xl">
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {project ? 'Edit Project' : 'Create Project'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {project
                ? 'Update the project details.'
                : 'Create a new project.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
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