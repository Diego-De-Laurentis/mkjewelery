
import React, { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../utils/storage.js'

const AuthContext = createContext(null)
const ADMIN_SEED = { id: 'u_admin', email: 'admin@mkjewel.example', password: 'admin123', role: 'admin', createdAt: Date.now() }

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('mkj:users', [])
  const [session, setSession] = useLocalStorage('mkj:session', null)

  useEffect(() => {
    if (!Array.isArray(users) || users.length === 0 || !users.find(u => u.role === 'admin')) {
      setUsers(prev => {
        const exists = (prev || []).find(u => u.email === ADMIN_SEED.email)
        if (exists) return prev
        return [ADMIN_SEED, ...(prev || [])]
      })
    }
  }, [])

  const currentUser = useMemo(() => users.find(u => session && u.id === session.userId) || null, [users, session])
  const isAdmin = !!currentUser && currentUser.role === 'admin'

  function login(email, password) {
    const u = users.find(x => x.email.toLowerCase() === String(email).toLowerCase())
    if (!u || u.password !== password) throw new Error('Invalid credentials')
    setSession({ userId: u.id })
    return u
  }
  function logout() { setSession(null) }
  function register(email, password) {
    if (users.find(x => x.email.toLowerCase() === String(email).toLowerCase())) throw new Error('Email in use')
    const u = { id: 'u_' + Date.now(), email, password, role: 'user', createdAt: Date.now() }
    setUsers(prev => [u, ...prev])
    setSession({ userId: u.id })
    return u
  }

  function setUserRole(userId, role) { setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u)) }
  function deleteUser(userId) { setUsers(prev => prev.filter(u => u.id !== userId)); if (session && session.userId === userId) setSession(null) }
  function resetPassword(userId, newPass) { setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u)) }

  const value = { users, setUsers, currentUser, isAdmin, login, logout, register, setUserRole, deleteUser, resetPassword }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth(){ const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx }
