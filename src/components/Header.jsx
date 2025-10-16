// src/components/Header.jsx
import { useEffect, useState } from 'react'
import CartDrawer from './CartDrawer'
import { getCart } from '../utils/api.db'

export default function Header(){
  const [openCart, setOpenCart] = useState(false)
  const [count, setCount] = useState(0)

  async function refreshCount(){
    const r = await getCart()
    const c = (r.items||[]).reduce((s,i)=> s + Number(i.qty||0), 0)
    setCount(c)
  }

  useEffect(()=>{
    refreshCount()
    const handler = ()=> refreshCount()
    window.addEventListener('cart:changed', handler)
    return ()=> window.removeEventListener('cart:changed', handler)
  },[])

  return (
    <>
      <nav className="w-full border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="font-semibold">MK Jewel</a>
          <div className="flex items-center gap-3">
            {/* weitere Nav-Items hier */}
            <button
              onClick={()=>setOpenCart(true)}
              className="relative rounded-full border w-10 h-10 flex items-center justify-center"
              aria-label="Open cart"
            >
              {/* simple cart icon */}
              <span className="inline-block w-5 h-5 border-b-2 border-black rounded-b-sm" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full bg-black text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer open={openCart} onClose={()=>setOpenCart(false)} />
    </>
  )
}
