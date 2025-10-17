// src/components/Controls.jsx
import React from 'react'

export default function Controls({
  categories = [],
  category = 'All',
  setCategory = () => {},
  query = '',
  setQuery = () => {},
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      {/* Suche: reagiert bei onChange */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full border rounded-full px-4 py-3"
      />

      {/* Kategorien: alles via onClick */}
      <div className="mt-3 flex flex-wrap gap-2">
        {['All', ...categories.filter(Boolean).filter((v,i,arr)=>arr.indexOf(v)===i)].map((c) => {
          const active = String(category).toLowerCase() === String(c).toLowerCase()
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full border ${
                active ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>
    </div>
  )
}
