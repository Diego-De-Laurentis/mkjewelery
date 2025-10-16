// src/utils/api.db.js
function emitCartChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart:changed'));
  }
}

// Auth
export async function register(email, password){
  const r = await fetch('/api/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password}),
    credentials:'include'
  });
  return r.json();
}
export async function login(email, password){
  const r = await fetch('/api/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password}),
    credentials:'include'
  });
  return r.json();
}
export async function logout(){
  const r = await fetch('/api/logout',{ method:'POST', credentials:'include' });
  return r.json();
}

// Products
export async function getProducts(){
  const r = await fetch('/api/products',{ credentials:'include' });
  return r.json();
}
export async function createProduct(p){
  const r = await fetch('/api/products',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(p),
    credentials:'include'
  });
  return r.json();
}
export async function updateProduct(id, p){
  const r = await fetch('/api/products/'+id,{
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(p),
    credentials:'include'
  });
  return r.json();
}
export async function deleteProduct(id){
  const r = await fetch('/api/products/'+id,{
    method:'DELETE',
    credentials:'include'
  });
  return r.json();
}

// Cart
export async function getCart(){
  const r = await fetch('/api/cart',{ credentials:'include' });
  return r.json();
}
export async function addToCart(product_id, qty){
  const r = await fetch('/api/cart/items',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({product_id, qty}),
    credentials:'include'
  });
  const j = await r.json();
  emitCartChanged();
  return j;
}
export async function removeCartItem(id){
  const r = await fetch('/api/cart/items/'+id,{ method:'DELETE', credentials:'include' });
  const j = await r.json();
  emitCartChanged();
  return j;
}
