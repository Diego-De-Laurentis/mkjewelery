// src/components/AuthModal.jsx
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function AuthModal({ open=true, onClose=()=>{} }){
  const [mode, setMode] = useState('register') // 'register' | 'login'
  const { register, login } = useAuth()

  if (!open) return null

  async function onSubmit(e){
    e.preventDefault()
    const email = e.target.email.value.trim()
    const password = e.target.password.value
    if (mode === 'register') await register(email, password)
    else await login(email, password)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{mode==='register'?'Create account':'Sign in'}</h2>
          <button onClick={onClose} className="px-2 py-1 rounded hover:bg-gray-100">Close</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="email" type="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
          <input name="password" type="password" placeholder="Password" required className="w-full border rounded px-3 py-2" />
          <button type="submit" className="w-full rounded bg-black text-white py-2">
            {mode==='register'?'Create account':'Sign in'}
          </button>
        </form>
        <div className="text-sm">
          {mode==='register' ? (
            <button className="underline" onClick={()=>setMode('login')}>Have an account? Sign in</button>
          ) : (
            <button className="underline" onClick={()=>setMode('register')}>Need an account? Create one</button>
          )}
        </div>
      </div>
    </div>
  )
}
