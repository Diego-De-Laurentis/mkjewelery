// src/components/Controls.jsx
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import AddProductModal from './AddProductModal'

export default function Controls({ onChanged=()=>{} }){
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'
  const [openAdd, setOpenAdd] = useState(false)

  if (!isAdmin) return null

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 py-3">
        <button
          onClick={()=>setOpenAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
        >
          <span>＋</span> <span>Add product</span>
        </button>
      </div>

      <AddProductModal
        open={openAdd}
        onClose={()=>setOpenAdd(false)}
        onCreated={onChanged}
      />
    </>
  )
}
