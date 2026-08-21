import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('projectManagerUser')

    return savedUser
      ? JSON.parse(savedUser)
      : null
  })

  const login = (email, password) => {
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required.',
      }
    }

    const loggedInUser = {
      name: 'Ahmed Khan',
      email,
      role: 'Developer',
    }

    localStorage.setItem(
      'projectManagerUser',
      JSON.stringify(loggedInUser)
    )

    setUser(loggedInUser)

    return {
      success: true,
    }
  }

  const logout = () => {
    localStorage.removeItem('projectManagerUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthProvider }