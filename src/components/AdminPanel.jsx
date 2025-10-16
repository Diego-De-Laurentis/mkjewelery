// src/components/AdminPanel.jsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  adminListUsers, adminSetRole, adminDeleteUser, adminResetPassword,
  getProducts, deleteProduct
} from '../utils/api.db'
import AddProductModal from './AddProductModal'
import EditProductModal from './EditProductModal'
import { useAuth } from '../auth/AuthContext'

export default function AdminPanel({ open=false, onClose=()=>{} }){
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [editing, setEditing] = useState(null)

  async function load(){
    const [u, p] = await Promise.all([adminListUsers(), getProducts()])
    setUsers(u || [])
    setProducts(p || [])
  }

  useEffect(()=>{ if(open && isAdmin){ load() } },[open, isAdmin])

  useEffect(()=>{
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key==='Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return ()=>{ document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  },[open, onClose])

  if (!open || !isAdmin) return null

  const ui = (
    <>
      <div className="fixed inset-0 bg-black/50 z-[11000]" onClick={onClose} />
      <div className="fixed inset-0 z-[11010] flex items-start justify-center p-6">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Admin</h2>
            <div className="flex gap-2">
              <button onClick={()=>setOpenAdd(true)} className="px-3 py-1.5 rounded border">+ Add product</button>
              <button onClick={onClose} className="px-3 py-1.5 rounded border">Close</button>
            </div>
          </div>

          <div className="p-4 grid lg:grid-cols-2 gap-6">
            {/* Users */}
            <section className="space-y-3">
              <h3 className="text-md font-semibold">Users</h3>
              <div className="overflow-auto border rounded-xl">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u=>(
                      <tr key={u.id} className="border-t">
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">
                          <select
                            defaultValue={u.role}
                            onChange={async e=>{ await adminSetRole(u.id, e.target.value); load(); }}
                            className="border rounded px-2 py-1"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="p-2 space-x-2">
                          <button
                            onClick={async ()=>{ const np = prompt('New password'); if(np){ await adminResetPassword(u.id, np); alert('Password reset'); } }}
                            className="px-2 py-1 border rounded"
                          >
                            Reset PW
                          </button>
                          <button
                            onClick={async ()=>{ if(confirm('Delete user?')){ await adminDeleteUser(u.id); load(); } }}
                            className="px-2 py-1 border rounded text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length===0 && <tr><td className="p-3 text-gray-500" colSpan={3}>No users</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Products */}
            <section className="space-y-3">
              <h3 className="text-md font-semibold">Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(p=>(
                  <div key={p.id} className="border rounded-2xl p-4 space-y-2">
                    <img src={p.image_url} alt={p.name} className="w-full h-36 object-cover rounded-xl" />
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-600">{(p.price_cents||0)/100} €</div>
                    <div className="flex gap-2">
                      <button onClick={()=>setEditing(p)} className="flex-1 px-3 py-2 rounded border">Edit</button>
                      <button
                        onClick={async ()=>{ if(confirm('Delete product?')){ await deleteProduct(p.id); load(); } }}
                        className="flex-1 px-3 py-2 rounded border text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {products.length===0 && <div className="text-gray-500">No products</div>}
              </div>
            </section>
          </div>
        </div>
      </div>

      <AddProductModal open={openAdd} onClose={()=>setOpenAdd(false)} onCreated={load} />
      <EditProductModal open={!!editing} product={editing} onClose={()=>setEditing(null)} onSaved={load} />
    </>
  )
  return createPortal(ui, document.body)
}
