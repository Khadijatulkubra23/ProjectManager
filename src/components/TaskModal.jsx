import { X } from 'lucide-react'
import TaskForm from './TaskForm'

function TaskModal({
  isOpen,
  task,
  projects,
  users,
  onSubmit,
  onCancel,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#11182b] p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {task ? 'Edit Task' : 'Create Task'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {task
                ? 'Update the task details.'
                : 'Add a new task to your project.'}
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

        <TaskForm
          task={task}
          projects={projects}
          users={users}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />

      </div>
    </div>
  )
}

export default TaskModal