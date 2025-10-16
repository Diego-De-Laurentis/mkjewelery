// src/components/AdminPanel.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { adminListUsers, adminSetRole, adminDeleteUser, adminResetPassword, getProducts } from '../utils/api.db'
import EditProductModal from './EditProductModal'

export default function AdminPanel(){
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [edit, setEdit] = useState(null)

  async function load(){
    const [u, p] = await Promise.all([adminListUsers(), getProducts()])
    setUsers(u || [])
    setProducts(p || [])
  }
  useEffect(()=>{ if(isAdmin) load() },[isAdmin])

  if (!isAdmin) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin</h1>

      {/* Users */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Users</h2>
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
                    <select defaultValue={u.role} onChange={async e=>{ await adminSetRole(u.id, e.target.value); load(); }} className="border rounded px-2 py-1">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-2 space-x-2">
                    <button onClick={async ()=>{ const np = prompt('New password'); if(np){ await adminResetPassword(u.id, np); alert('Password reset'); } }} className="px-2 py-1 border rounded">Reset PW</button>
                    <button onClick={async ()=>{ if(confirm('Delete user?')){ await adminDeleteUser(u.id); load(); } }} className="px-2 py-1 border rounded text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
              {users.length===0 && <tr><td className="p-3 text-gray-500" colSpan={3}>No users</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Products */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p=>(
            <div key={p.id} className="border rounded-2xl p-4 space-y-2">
              <img src={p.image_url} alt={p.name} className="w-full h-36 object-cover rounded-xl" />
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">{(p.price_cents||0)/100} €</div>
              <button onClick={()=>setEdit(p)} className="w-full px-3 py-2 rounded border">Edit</button>
            </div>
          ))}
          {products.length===0 && <div className="text-gray-500">No products</div>}
        </div>
      </section>

      <EditProductModal open={!!edit} product={edit} onClose={()=>setEdit(null)} onSaved={load} />
    </div>
  )
}
