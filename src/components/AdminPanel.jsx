
import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'

export default function AdminPanel() {
  const { users, currentUser, setUserRole, deleteUser, resetPassword } = useAuth()
  const [tempPass, setTempPass] = useState({})
  return (
    <section className="border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Admin · Users</h2>
          <div className="text-xs text-neutral-600">Only admins see this panel</div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-neutral-200 rounded-xl overflow-hidden">
            <thead className="bg-neutral-100">
              <tr>
                <th className="text-left p-2 border-b">Email</th>
                <th className="text-left p-2 border-b">Role</th>
                <th className="text-left p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-b-0">
                  <td className="p-2">{u.email}{u.id===currentUser?.id && <span className="ml-2 text-xs px-2 py-0.5 border rounded-full">you</span>}</td>
                  <td className="p-2">
                    <select value={u.role} onChange={e=>setUserRole(u.id, e.target.value)} className="px-2 py-1 rounded border border-neutral-300 bg-white">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-2 space-x-2">
                    <input placeholder="new password" value={tempPass[u.id]||''} onChange={e=>setTempPass(prev=>({...prev,[u.id]:e.target.value}))} className="px-2 py-1 rounded border border-neutral-300 bg-white" />
                    <button onClick={()=>{ resetPassword(u.id, tempPass[u.id]||'changeme'); }} className="px-2 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-50">Reset</button>
                    <button onClick={()=>{ if (u.id!==currentUser?.id) deleteUser(u.id) }} className="px-2 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-50" disabled={u.id===currentUser?.id}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
