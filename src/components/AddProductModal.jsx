// src/components/AddProductModal.jsx
import { createProduct } from '../utils/api.db'

export default function AddProductModal({ open=true, onClose=()=>{}, onCreated=()=>{} }){
  if (!open) return null
  async function onSubmit(e){
    e.preventDefault()
    const p = {
      sku: e.target.sku.value.trim(),
      name: e.target.name.value.trim(),
      description: e.target.description.value.trim(),
      price_cents: Math.round(Number(e.target.price.value) * 100) || 0,
      image_url: e.target.image_url.value.trim()
    }
    await createProduct(p)
    onCreated()
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold">Add Product</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="sku" placeholder="SKU" className="w-full border rounded px-3 py-2" required />
          <input name="name" placeholder="Name" className="w-full border rounded px-3 py-2" required />
          <input name="image_url" placeholder="Image URL" className="w-full border rounded px-3 py-2" />
          <input name="price" type="number" step="0.01" placeholder="Price €" className="w-full border rounded px-3 py-2" required />
          <textarea name="description" placeholder="Description" className="w-full border rounded px-3 py-2" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
            <button type="submit" className="px-3 py-2 rounded bg-black text-white">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}
