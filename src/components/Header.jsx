import React from 'react'
import { THEMES } from '../utils/products.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Header({ themeKey, setThemeKey, backend, cartCount, onOpenCart, onOpenAuth, currentUser }) {
  const theme = THEMES[themeKey] ?? THEMES.classic
  const { logout, isAdmin } = useAuth()
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${theme.accent}`} />
            <div className="leading-tight">
              <div className="text-xl font-semibold tracking-tight">MK Jewel</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500">Fine Jewelry</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs border border-neutral-300">{(THEMES[themeKey]?.name) || 'Classic'}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#collections" className="hover:opacity-80 transition-opacity">Collections</a>
            <a href="#about" className="hover:opacity-80 transition-opacity">About</a>
            <a href="#care" className="hover:opacity-80 transition-opacity">Care</a>
          </nav>
          <div className="flex items-center gap-2">
            {backend ? (
              <span className="hidden sm:inline text-xs px-2 py-1 rounded-lg border border-green-600/40 text-green-700">API</span>
            ) : (
              <span className="hidden sm:inline text-xs px-2 py-1 rounded-lg border border-neutral-300 text-neutral-500">Local</span>
            )}
            <select aria-label="Theme" value={themeKey} onChange={e => setThemeKey(e.target.value)} className="hidden sm:block text-sm px-2 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors">
              {Object.entries(THEMES).map(([k, t]) => (<option key={k} value={k}>{t.name}</option>))}
            </select>
            {!currentUser ? (
              <button onClick={onOpenAuth} className="px-2 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-50 text-sm">Sign in</button>
            ) : (
              <>
                <span className="text-sm text-neutral-700">{currentUser.email}{isAdmin && ' · admin'}</span>
                <button onClick={logout} className="px-2 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-50 text-sm">Sign out</button>
              </>
            )}
            <button onClick={onOpenCart} className="relative p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 transition-colors" aria-label="Open cart">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 3h2l3.6 7.59-1.35 2.45A2 2 0 0 0 9 16h9a2 2 0 0 0 1.79-1.11l3-6A1 1 0 0 0 21 8H7"/></svg>
              {cartCount > 0 && (<span className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 rounded-full text-[10px] bg-neutral-900 text-white flex items-center justify-center">{cartCount}</span>)}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
