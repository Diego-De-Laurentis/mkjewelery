// src/components/ProductsSection.jsx
import { useEffect, useState } from 'react'
import Controls from './Controls'
import { getProducts } from '../utils/api.db'
import ProductCard from './ProductCard'

export default function ProductsSection() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    ;(async () => {
      const p = await getProducts()
      setProducts(p || [])
    })()
  }, [])

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-2">Our Products</h2>

      <Controls onData={setProducts} />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {products.length === 0 && (
          <div className="text-gray-500">No products found</div>
        )}
      </div>
    </section>
  )
}
