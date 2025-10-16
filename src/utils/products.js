export const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Astra Solitaire Ring', price: 1299, category: 'Rings', image: 'https://images.unsplash.com/photo-1612304568860-2347f0c9b2b4?q=80&w=1200&auto=format&fit=crop', description: '14K white gold solitaire with brilliant-cut center stone.' },
  { id: 'p2', name: 'Luna Pendant Necklace', price: 890, category: 'Necklaces', image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1200&auto=format&fit=crop', description: 'Delicate pendant on an adjustable chain in 18K gold.' },
  { id: 'p3', name: 'Aria Hoop Earrings', price: 420, category: 'Earrings', image: 'https://images.unsplash.com/photo-1520962918287-7448c2878f65?q=80&w=1200&auto=format&fit=crop', description: 'Timeless hoops with secure clasps and mirror finish.' },
  { id: 'p4', name: 'Seraphine Tennis Bracelet', price: 2150, category: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220c?q=80&w=1200&auto=format&fit=crop', description: 'Continuous line bracelet with prong-set stones.' },
]
export function filterProducts(list, category, query) {
  const q = (query || '').toLowerCase()
  return list.filter(p => (category === 'All' || p.category === category) && (!q || [p.name, p.description, p.category].join(' ').toLowerCase().includes(q)))
}
export function calcCartTotal(products, cart) {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(x => x.id === id)
    return p ? sum + p.price * qty : sum
  }, 0)
}
export const THEMES = {
  classic: { name: 'Classic', accent: 'from-amber-400 to-yellow-200', ring: 'ring-amber-400' },
  minimal: { name: 'Minimal', accent: 'from-sky-400 to-cyan-200', ring: 'ring-sky-400' },
  luxe: { name: 'Luxe', accent: 'from-rose-400 to-pink-200', ring: 'ring-rose-400' },
}
