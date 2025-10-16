import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  if (!open) return null
  function reset() { setEmail(''); setPassword(''); setError(null) }
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password)
      reset(); onClose()
    } catch (err) { setError(err?.message || 'Error') }
  }
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(28rem,95vw)] rounded-2xl border border-neutral-200 bg-white shadow-xl">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="font-medium">{mode === 'login' ? 'Sign in' : 'Create account'}</div>
          <button onClick={onClose} className="px-2 py-1 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors">Close</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 grid gap-3">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-neutral-200 outline-none transition-shadow" />
          <input type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-neutral-200 outline-none transition-shadow" />
          <button type="submit" className="px-4 py-2 rounded-xl text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
          <div className="text-xs text-neutral-600">
            {mode === 'login' ? (
              <span>New here? <button type="button" className="underline" onClick={()=>setMode('register')}>Create an account</button></span>
            ) : (
              <span>Have an account? <button type="button" className="underline" onClick={()=>setMode('login')}>Sign in</button></span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
