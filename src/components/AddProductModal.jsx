// src/components/AddProductModal.jsx
import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { createProduct } from '../utils/api.db'

export default function AddProductModal({ open=false, onClose=()=>{}, onCreated=()=>{} }){
  useEffect(()=>{
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key==='Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return ()=>{ document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  },[open, onClose])

  if (!open) return null

  async function onSubmit(e){
    e.preventDefault()
    const p = {
      sku: e.target.sku.value.trim(),
      name: e.target.name.value.trim(),
      image_url: e.target.image_url.value.trim(),
      category: e.target.category.value.trim(),
      price_cents: Math.round(Number(e.target.price.value)*100) || 0,
      description: e.target.description.value.trim()
    }
    const r = await createProduct(p)
    if (r?.id){ onCreated(); onClose() }
  }

  const ui = (
    <>
      <div className="fixed inset-0 bg-black/50 z-[12000]" onClick={onClose} />
      <div className="fixed inset-0 z-[12010] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Add Product</h2>
            <button onClick={onClose} className="px-2 py-1 rounded border">Close</button>
          </div>
          <form onSubmit={onSubmit} className="space-y-3">
            <input name="sku" placeholder="SKU" required className="w-full border rounded px-3 py-2" />
            <input name="name" placeholder="Name" required className="w-full border rounded px-3 py-2" />
            <input name="image_url" placeholder="Image URL" className="w-full border rounded px-3 py-2" />
            <input name="category" placeholder="Category (e.g. ring, necklace)" className="w-full border rounded px-3 py-2" />
            <input name="price" type="number" step="0.01" placeholder="Price €" required className="w-full border rounded px-3 py-2" />
            <textarea name="description" placeholder="Description" className="w-full border rounded px-3 py-2" />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
              <button type="submit" className="px-3 py-2 rounded bg-black text-white">Create</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
  return createPortal(ui, document.body)
}
