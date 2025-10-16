import React from 'react'

export default function Controls({ categories, category, setCategory, query, setQuery, onAddProduct }) {
  return (
    <section id="collections" className="border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${category === cat ? 'bg-neutral-900 text-white' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}>{cat}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products" className="w-full md:w-64 px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-neutral-200 outline-none transition-shadow" />
            <button onClick={onAddProduct} className="px-3 py-2 rounded-xl border border-neutral-300 bg-white text-sm hover:bg-neutral-50 transition-colors">+ Add product</button>
          </div>
        </div>
        <div className="mt-2 text-xs text-neutral-500">Products save automatically in your browser.</div>
      </div>
    </section>
  )
}
