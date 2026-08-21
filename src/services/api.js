import axios from 'axios'
import seedData from '../../db.json'

const API_URL = import.meta.env.VITE_API_BASE_URL

const STORAGE_KEY = 'projectFlowData'

const getLocalData = () => {
  const savedData = localStorage.getItem(STORAGE_KEY)

  if (savedData) {
    return JSON.parse(savedData)
  }

  const initialData = {
    users: seedData.users || [],
    projects: seedData.projects || [],
    tasks: seedData.tasks || [],
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(initialData)
  )

  return initialData
}

const saveLocalData = (data) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  )
}

const localApi = {
  async get(url) {
    const data = getLocalData()
    const resource = url.replace('/', '')

    return {
      data: data[resource] || [],
    }
  },

  async post(url, payload) {
    const data = getLocalData()
    const resource = url.replace('/', '')

    const newItem = {
      ...payload,
      id: Date.now().toString(),
    }

    data[resource] = data[resource] || []
    data[resource].push(newItem)

    saveLocalData(data)

    return {
      data: newItem,
    }
  },

  async patch(url, payload) {
    const data = getLocalData()
    const parts = url.split('/')
    const resource = parts[1]
    const id = parts[2]

    const index = data[resource]?.findIndex(
      (item) => String(item.id) === String(id)
    )

    if (index === -1 || index === undefined) {
      throw new Error('Item not found')
    }

    data[resource][index] = {
      ...data[resource][index],
      ...payload,
    }

    saveLocalData(data)

    return {
      data: data[resource][index],
    }
  },

  async delete(url) {
    const data = getLocalData()
    const parts = url.split('/')
    const resource = parts[1]
    const id = parts[2]

    data[resource] = (data[resource] || []).filter(
      (item) => String(item.id) !== String(id)
    )

    saveLocalData(data)

    return {
      data: {},
    }
  },
}

const api = API_URL
  ? axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  : localApi

export default api