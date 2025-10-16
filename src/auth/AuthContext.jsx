import { createContext, useContext, useMemo, useState } from 'react'
import { register as apiRegister, login as apiLogin, logout as apiLogout } from '../utils/api.db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  async function register(email, password){
    const r = await apiRegister(email, password)
    if (r?.id) { setCurrentUser({ id:r.id, email:r.email, role:r.role }); return r }
    throw new Error(r?.error || 'register failed')
  }
  async function login(email, password){
    const r = await apiLogin(email, password)
    if (r?.id) { setCurrentUser({ id:r.id, email:r.email, role:r.role }); return r }
    throw new Error(r?.error || 'login failed')
  }
  async function logout(){ await apiLogout(); setCurrentUser(null) }

  const value = useMemo(()=>({ currentUser, register, login, logout }),[currentUser])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth(){ return useContext(AuthContext) }
