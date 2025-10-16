// src/components/Controls.jsx
import { useEffect, useState } from 'react'
import { getProducts } from '../utils/api.db'

export default function Controls({ onData=()=>{} }){
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')

  // Kategorieliste aus aktuellen Produkten ableiten
  const [cats, setCats] = useState([])
  useEffect(()=>{
    (async ()=>{
      const all = await getProducts()
      const uniq = Array.from(new Set((all||[]).map(p=>p.category).filter(Boolean))).sort()
      setCats(uniq)
    })()
  },[])// src/components/Controls.jsx
import { useEffect, useState } from 'react'
import { getCategories, getProducts } from '../utils/api.db'

export default function Controls({ onData=()=>{} }){
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [cats, setCats] = useState([])

  useEffect(()=>{
    (async ()=>{
      const list = await getCategories()
      setCats(list || [])
    })()
  },[])

  async function apply(){
    const data = await getProducts({ q, category })
    onData(data || [])
  }

  useEffect(()=>{ apply() },[]) // initial

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-6 space-y-4">
      <div className="flex gap-3">
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Search products…"
          className="flex-1 border rounded-full px-4 py-2"
        />
        <button onClick={apply} className="px-4 py-2 rounded-full border">Search</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={()=>{ setCategory(''); setTimeout(apply,0); }}
          className={`px-3 py-1.5 rounded-full border ${category===''?'bg-black text-white':'bg-white'}`}
        >
          All
        </button>
        {cats.map(c=>(
          <button
            key={c}
            onClick={()=>{ setCategory(c); setTimeout(apply,0); }}
            className={`px-3 py-1.5 rounded-full border ${category===c?'bg-black text-white':'bg-white'}`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}


  async function apply(){
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (category) params.set('category', category)
    const url = '/api/products' + (params.toString()?`?${params}`:'')
    const r = await fetch(url, { credentials:'include' }).then(r=>r.json())
    onData(r || [])
  }

  useEffect(()=>{ apply() },[]) // initial

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder="Search products…"
        className="flex-1 border rounded-full px-4 py-2"
      />
      <select
        value={category}
        onChange={e=>setCategory(e.target.value)}
        className="border rounded-full px-4 py-2 min-w-[180px]"
      >
        <option value="">All categories</option>
        {cats.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <button onClick={apply} className="px-4 py-2 rounded-full border">
        Filter
      </button>
    </div>
  )
}
