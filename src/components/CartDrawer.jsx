
import React from 'react'
import { formatCurrencyEUR } from '../utils/format.js'

export default function CartDrawer({ open, items, total, setQty, removeItem, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-white border-l border-neutral-200 shadow-xl flex flex-col">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="font-medium">Your Cart</div>
          <button onClick={onClose} className="px-2 py-1 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors">Close</button>
        </div>
        <div className="flex-1 overflow-auto divide-y divide-neutral-200">
          {items.length === 0 && (<div className="p-6 text-sm text-neutral-500">Cart is empty.</div>)}
          {items.map(({ product: p, qty }) => (
            <div key={p.id} className="p-4 flex gap-3">
              <img src={p.image} alt={p.name} className="h-16 w-16 rounded-lg object-cover border border-neutral-200 transition-transform duration-200 hover:scale-[1.03]" />
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-neutral-500">{p.category}</div>
                <div className="mt-1 font-semibold">{formatCurrencyEUR(p.price)}</div>
                <div className="mt-2 inline-flex items-center rounded-xl border border-neutral-300 bg-white">
                  <button onClick={() => setQty(p.id, Math.max(0, qty - 1))} className="px-3 py-1.5 hover:bg-neutral-50 transition-colors">-</button>
                  <div className="px-3">{qty}</div>
                  <button onClick={() => setQty(p.id, qty + 1)} className="px-3 py-1.5 hover:bg-neutral-50 transition-colors">+</button>
                </div>
              </div>
              <button onClick={() => removeItem(p.id)} className="self-start px-2 py-1 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors">Remove</button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center justify-between text-sm"><div>Subtotal</div><div className="font-semibold">{formatCurrencyEUR(total)}</div></div>
          <button className="mt-3 w-full px-4 py-2 rounded-xl text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">Checkout</button>
          <p className="mt-2 text-xs text-neutral-500">Checkout is a demo. Integrate Stripe or your provider.</p>
        </div>
      </aside>
    </div>
  )
}
