// src/components/Controls.jsx
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
