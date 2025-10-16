// src/components/CartDrawer.jsx
import { useEffect, useState } from 'react'
import { getCart, addToCart, removeCartItem } from '../utils/api.db'

export default function CartDrawer({ open=true, onClose=()=>{} }){
  const [items, setItems] = useState([])
  async function load(){ const r = await getCart(); setItems((r.items||[]).map(i => ({ id:i.id, qty:i.qty, productId:i.product?.id, product:i.product }))) }
  useEffect(()=>{ if(open) load() },[open])

  async function setQty(item, q){
    const qty = Number(q)
    await addToCart(item.productId, qty) // qty<=0 -> Server löscht
    await load()
  }
  async function remove(item){
    await removeCartItem(item.id)
    await load()
  }

  if (!open) return null
  const total = items.reduce((s,i)=> s + (i.product?.price_cents||0)*i.qty, 0)

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="h-full w-full max-w-md bg-white p-4 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Cart</h2>
          <button onClick={onClose} className="px-2 py-1 rounded border">Close</button>
        </div>
        <div className="flex-1 overflow-auto space-y-3">
          {items.map(i=>(
            <div key={i.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{i.product?.name}</div>
                <div className="text-sm text-gray-500">{(i.product?.price_cents||0)/100} €</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={i.qty} onChange={e=>setQty(i, e.target.value)} className="w-16 border rounded px-2 py-1" />
                <button onClick={()=>remove(i)} className="px-2 py-1 rounded border">Remove</button>
              </div>
            </div>
          ))}
          {items.length===0 && <div className="text-sm text-gray-500">Empty</div>}
        </div>
        <div className="pt-3 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total</span><span>{(total/100).toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  )
}
