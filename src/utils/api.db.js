// src/utils/api.db.js
export async function getProducts(){
  const res = await fetch('/api/products');
  return res.json();
}
export async function getCart(){
  const res = await fetch('/api/cart', { credentials: 'include' });
  return res.json();
}
export async function addToCart(product_id, qty=1){
  const res = await fetch('/api/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ product_id, qty })
  });
  return res.json();
}
