import React from 'react'
import { formatCurrencyEUR } from '../utils/format.js'
import { THEMES } from '../utils/products.js'

export default function ProductCard({ product, onAdd, onShare, themeKey, isAdmin, onEdit, onDelete }) {
  const theme = THEMES[themeKey] ?? THEMES.classic
  const p = product
  return (
    <article className="group border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5">
      <div className="aspect-[4/5] overflow-hidden">
        <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]" />
      </div>
      <div className="p-3 sm:p-4">
        <div className="text-sm text-neutral-500">{p.category}</div>
        <h3 className="font-medium leading-snug mt-0.5">{p.name}</h3>
        <div className="mt-1 font-semibold">{formatCurrencyEUR(p.price)}</div>
        <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{p.description}</p>
        <div className="mt-3 flex gap-2">
          <button onClick={() => onAdd(p)} className={`flex-1 px-3 py-2 rounded-xl text-sm bg-gradient-to-r ${theme.accent} text-neutral-900 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md`}>Add to cart</button>
          <button type="button" onClick={() => onShare(p)} className="px-3 py-2 rounded-xl text-sm border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors">Share</button>
        </div>
        {isAdmin && (
          <div className="mt-2 flex gap-2">
            <button onClick={()=>onEdit(p)} className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-xs">Edit</button>
            <button onClick={()=>onDelete(p)} className="px-3 py-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-xs text-red-700">Delete</button>
          </div>
        )}
      </div>
    </article>
  )
}
