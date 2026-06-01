import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (token: string, user: string) => void;
  logout: () => void;
  loading: boolean;
}>({
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = (token: string, user: string) => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
