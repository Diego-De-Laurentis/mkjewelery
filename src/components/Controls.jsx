// src/components/Controls.jsx
import { useEffect, useState } from 'react'
import { getCategories, getProducts } from '../utils/api.db'

export default function Controls({ onData = () => {} }) {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [cats, setCats] = useState([])

  useEffect(() => { (async () => setCats(await getCategories()))() }, [])

  useEffect(() => { (async () => onData(await getProducts({ q, category })))() }, [q, category, onData])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-4 space-y-4">
      <div className="flex gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="flex-1 border rounded-full px-4 py-2" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCategory('')} className={`px-3 py-1.5 rounded-full border ${category===''?'bg-black text-white':'bg-white'}`}>All</button>
        {(cats||[]).map(c=>(
          <button key={c.id} onClick={()=>setCategory(c.name)} className={`px-3 py-1.5 rounded-full border ${category===c.name?'bg-black text-white':'bg-white'}`}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
