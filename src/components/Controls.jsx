// src/components/Controls.jsx
import { useEffect, useState } from 'react'
import { getCategories, getProducts } from '../utils/api.db'

export default function Controls({ onData = () => {} }) {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [cats, setCats] = useState([])

  // Kategorien laden
  useEffect(() => {
    ;(async () => {
      const list = await getCategories()
      setCats(list || [])
    })()
  }, [])

  // Server-Filter immer anwenden, wenn q/category sich ändern
  useEffect(() => {
    ;(async () => {
      const data = await getProducts({ q, category })
      onData(data || [])
    })()
  }, [q, category, onData])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-6 space-y-4">
      <div className="flex gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="flex-1 border rounded-full px-4 py-2"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('')}
          className={`px-3 py-1.5 rounded-full border ${
            category === '' ? 'bg-black text-white' : 'bg-white'
          }`}
        >
          All
        </button>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full border ${
              category === c ? 'bg-black text-white' : 'bg-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
