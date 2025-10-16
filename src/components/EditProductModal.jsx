// src/components/EditProductModal.jsx
import { updateProduct, deleteProduct } from '../utils/api.db'

export default function EditProductModal({ product, open=true, onClose=()=>{}, onSaved=()=>{} }){
  if (!open || !product) return null
  async function onSubmit(e){
    e.preventDefault()
    const p = {
      name: e.target.name.value.trim(),
      image_url: e.target.image_url.value.trim(),
      price_cents: Math.round(Number(e.target.price.value) * 100) || product.price_cents,
      description: e.target.description.value.trim()
    }
    await updateProduct(product.id, p)
    onSaved()
    onClose()
  }
  async function onDelete(){
    await deleteProduct(product.id)
    onSaved()
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold">Edit Product</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" defaultValue={product.name} className="w-full border rounded px-3 py-2" required />
          <input name="image_url" defaultValue={product.image_url} className="w-full border rounded px-3 py-2" />
          <input name="price" type="number" step="0.01" defaultValue={(product.price_cents||0)/100} className="w-full border rounded px-3 py-2" />
          <textarea name="description" defaultValue={product.description} className="w-full border rounded px-3 py-2" />
          <div className="flex gap-2 justify-between">
            <button type="button" onClick={onDelete} className="px-3 py-2 rounded border text-red-600">Delete</button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
              <button type="submit" className="px-3 py-2 rounded bg-black text-white">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
