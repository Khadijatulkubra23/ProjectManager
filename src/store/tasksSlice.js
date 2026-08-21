import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tasks: [],
  loading: false,
  error: '',
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,

  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload
    },

    addTask: (state, action) => {
      state.tasks.push(action.payload)
    },

    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      )

      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },

    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload
      )
    },

    setLoading: (state, action) => {
      state.loading = action.payload
    },

    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setLoading,
  setError,
} = tasksSlice.actions

export default tasksSlice.reducer