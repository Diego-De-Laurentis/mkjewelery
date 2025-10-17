// src/components/AdminPanel.jsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  adminListUsers, adminSetRole, adminDeleteUser, adminResetPassword,
  getProducts, deleteProduct, adminAddCategory, adminDeleteCategory, getCategories
} from '../utils/api.db'
import AddProductModal from './AddProductModal'
import EditProductModal from './EditProductModal'
import { useAuth } from '../auth/AuthContext'

export default function AdminPanel({ open=false, onClose=()=>{} }){
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [cats, setCats] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [editing, setEditing] = useState(null)

  async function load(){
    const [u, p, c] = await Promise.all([adminListUsers(), getProducts(), getCategories()])
    setUsers(u || []); setProducts(p || []); setCats(c || [])
  }
  useEffect(()=>{ if(open && isAdmin){ load() } },[open, isAdmin])

  // Body scroll sperren, ESC schließt
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
        {/* Container mit Header + scrollbarem Content */}
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-2xl">
            <h2 className="text-lg font-semibold">Admin</h2>
            <div className="flex gap-2">
              <button onClick={()=>setOpenAdd(true)} className="px-3 py-1.5 rounded border">+ Add product</button>
              <button onClick={onClose} className="px-3 py-1.5 rounded border">Close</button>
            </div>
          </div>

          {/* Scrollbereich: max Höhe, eigenständiger Overflow */}
          <div className="p-4 grid xl:grid-cols-3 gap-6 overflow-y-auto" style={{maxHeight: '80vh'}}>
            {/* Users */}
            <section className="space-y-3 xl:col-span-1">
              <h3 className="text-md font-semibold">Users</h3>
              <div className="overflow-auto border rounded-xl">
                <table className="
