import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projects: [],
  loading: false,
  error: '',
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,

  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload
    },

    addProject: (state, action) => {
      state.projects.push(action.payload)
    },

    updateProject: (state, action) => {
      const index = state.projects.findIndex(
        (project) =>
          project.id === action.payload.id
      )

      if (index !== -1) {
        state.projects[index] = action.payload
      }
    },

    removeProject: (state, action) => {
      state.projects = state.projects.filter(
        (project) =>
          project.id !== action.payload
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
  setProjects,
  addProject,
  updateProject,
  removeProject,
  setLoading,
  setError,
} = projectsSlice.actions

export default projectsSlice.reducer