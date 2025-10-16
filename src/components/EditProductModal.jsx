// src/components/EditProductModal.jsx
import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { updateProduct, deleteProduct } from '../utils/api.db'

export default function EditProductModal({ product, open=false, onClose=()=>{}, onSaved=()=>{} }){
  useEffect(()=>{
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key==='Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return ()=>{ document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  },[open, onClose])

  if (!open || !product) return null

  async function onSubmit(e){
    e.preventDefault()
    const p = {
      name: e.target.name.value.trim(),
      image_url: e.target.image_url.value.trim(),
      price_cents: Math.round(Number(e.target.price.value)*100) || product.price_cents,
      description: e.target.description.value.trim()
    }
    const r = await updateProduct(product.id, p)
    if (r?.ok){ onSaved(); onClose() }
  }
  async function onDelete(){
    const r = await deleteProduct(product.id)
    if (r?.ok){ onSaved(); onClose() }
  }

  const ui = (
    <>
      <div className="fixed inset-0 bg-black/50 z-[10015]" onClick={onClose} />
      <div className="fixed inset-0 z-[10016] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Edit Product</h2>
            <button onClick={onClose} className="px-2 py-1 rounded border">Close</button>
          </div>
          <form onSubmit={onSubmit} className="space-y-3">
            <input name="name" defaultValue={product.name} className="w-full border rounded px-3 py-2" required />
            <input name="image_url" defaultValue={product.image_url} className="w-full border rounded px-3 py-2" />
            <input name="price" type="number" step="0.01" defaultValue={(product.price_cents||0)/100} className="w-full border rounded px-3 py-2" />
            <textarea name="description" defaultValue={product.description} className="w-full border rounded px-3 py-2" />
            <div className="flex justify-between items-center">
              <button type="button" onClick={onDelete} className="px-3 py-2 rounded border text-red-600">Delete</button>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-3 py-2 rounded bg-black text-white">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
  return createPortal(ui, document.body)
}
