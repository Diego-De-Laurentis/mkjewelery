import React, { useEffect, useState } from 'react'

export default function EditProductModal({ open, onClose, onSave, product }) {
  const [form, setForm] = useState(product || null)
  useEffect(()=>{ setForm(product || null) }, [product])
  if (!open || !form) return null
  function update(k, v){ setForm(prev => ({ ...prev, [k]: v })) }
  function submit(e){ e.preventDefault(); onSave(form) }
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(42rem,95vw)] rounded-2xl border border-neutral-200 bg-white shadow-xl">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="font-medium">Edit Product</div>
          <button onClick={onClose} className="px-2 py-1 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors">Close</button>
        </div>
        <form onSubmit={submit} className="p-4 grid sm:grid-cols-2 gap-3">
          <input value={form.name} onChange={e=>update('name', e.target.value)} required placeholder="Name" className="px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-neutral-200 outline-none transition-shadow sm:col-span-2" />
          <input value={form.price} onChange={e=>update('price', e.target.value)} required type="number" min="0" step="0.01" placeholder="Price (EUR)" className="px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-neutral-200 outline-none transition-shadow" />
          <input value={form.category} onChange={e=>update('category', e.target.value)} placeholder="Category" className="px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-neutral-200 outline-none transition-shadow" />
          <input value={form.image} onChange={e=>update('image', e.target.value)} placeholder="Image URL" className="px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-neutral-200 outline-none transition-shadow sm:col-span-2" />
          <textarea value={form.description} onChange={e=>update('description', e.target.value)} placeholder="Description" rows={3} className="px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-neutral-200 outline-none transition-shadow sm:col-span-2" />
          <button type="submit" className="mt-2 sm:mt-0 sm:col-span-2 px-4 py-2 rounded-xl text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">Save changes</button>
        </form>
      </div>
    </div>
  )
}
