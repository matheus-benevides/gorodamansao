import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Admin = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [product, setProduct] = useState({
    name: '', flavor: '', tag: '', price: '', description: '', image: '', color: 'primary'
  })
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.is_admin) {
      navigate('/')
    }
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [navigate, activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:3001/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRole = async (userId, currentRole) => {
    const token = localStorage.getItem('token')
    const newRole = currentRole === 1 ? 0 : 1
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_admin: newRole })
      })
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_admin: newRole } : u))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmitProduct = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      })

      if (res.ok) {
        setMessage(t('admin_prod_success'))
        setProduct({ name: '', flavor: '', tag: '', price: '', description: '', image: '', color: 'primary' })
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen pt-40 px-margin max-w-6xl mx-auto pb-20">
      <header className="mb-16">
        <h1 className="font-headline text-5xl md:text-7xl mb-8 italic uppercase tracking-tighter">{t('admin_title')}</h1>
        <div className="flex gap-8 border-b border-white/5">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`pb-4 font-mono text-[10px] uppercase tracking-[0.2em] relative transition-colors ${activeTab === 'products' ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            {t('admin_tab_products')}
            {activeTab === 'products' && <motion.div layoutId="admin-tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />}
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`pb-4 font-mono text-[10px] uppercase tracking-[0.2em] relative transition-colors ${activeTab === 'users' ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            {t('admin_tab_users')}
            {activeTab === 'users' && <motion.div layoutId="admin-tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'products' ? (
          <motion.section key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card p-8 md:p-16">
            <h2 className="font-headline text-3xl mb-12 uppercase italic tracking-tighter">{t('admin_add_prod')}</h2>
            <form onSubmit={handleSubmitProduct} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-on-surface-variant">{t('admin_prod_name')}</label>
                  <input type="text" value={product.name} onChange={e => setProduct({...product, name: e.target.value})} className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary outline-none transition-colors font-body" required />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-on-surface-variant">{t('admin_prod_flavor')}</label>
                  <input type="text" value={product.flavor} onChange={e => setProduct({...product, flavor: e.target.value})} className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary outline-none transition-colors font-body" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-on-surface-variant">{t('admin_prod_tag')}</label>
                  <input type="text" value={product.tag} onChange={e => setProduct({...product, tag: e.target.value})} className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary outline-none transition-colors font-body" required />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-on-surface-variant">{t('admin_prod_price')}</label>
                  <input type="text" value={product.price} onChange={e => setProduct({...product, price: e.target.value})} className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary outline-none transition-colors font-body" required />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-on-surface-variant">{t('admin_prod_color')}</label>
                  <select value={product.color} onChange={e => setProduct({...product, color: e.target.value})} className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary outline-none transition-colors font-body">
                    <option value="primary">Primary (Green)</option>
                    <option value="secondary">Secondary (Lime)</option>
                    <option value="tertiary">Tertiary (Pink)</option>
                    <option value="error">Error (Red)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-on-surface-variant">{t('admin_prod_img')}</label>
                <input type="text" value={product.image} onChange={e => setProduct({...product, image: e.target.value})} className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary outline-none transition-colors font-body" required />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-on-surface-variant">{t('admin_prod_desc')}</label>
                <textarea value={product.description} onChange={e => setProduct({...product, description: e.target.value})} className="w-full bg-white/5 border-b border-white/10 p-4 focus:border-primary outline-none transition-colors font-body h-32" required />
              </div>

              <button type="submit" className="w-full neon-border py-6 font-mono text-sm uppercase tracking-[0.4em] text-primary hover:bg-primary hover:text-background transition-all">
                {t('admin_prod_btn')}
              </button>

              {message && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-mono text-xs text-primary italic">
                  {message}
                </motion.p>
              )}
            </form>
          </motion.section>
        ) : (
          <motion.section key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card p-8 md:p-12 overflow-x-auto">
            <h2 className="font-headline text-3xl mb-12 uppercase italic tracking-tighter">{t('admin_user_list')}</h2>
            
            {loading ? (
              <p className="font-mono text-xs text-primary animate-pulse uppercase">{t('loading')}</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="p-4 font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">{t('admin_user_name')}</th>
                    <th className="p-4 font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">{t('admin_user_email')}</th>
                    <th className="p-4 font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">{t('admin_user_role')}</th>
                    <th className="p-4 font-mono text-[10px] uppercase text-on-surface-variant tracking-widest text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} className="w-8 h-8 rounded-full border border-white/10" />
                          <span className="font-body text-sm">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-on-surface-variant">{u.email}</td>
                      <td className="p-4">
                        <span className={`font-mono text-[8px] uppercase px-2 py-1 rounded ${u.is_admin === 1 ? 'bg-primary/20 text-primary' : 'bg-white/10 text-on-surface-variant'}`}>
                          {u.is_admin === 1 ? t('admin_user_admin') : t('admin_user_member')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleToggleRole(u.id, u.is_admin)}
                          className="font-mono text-[8px] uppercase tracking-widest text-secondary-fixed-dim hover:text-white transition-colors border border-white/10 px-3 py-1 rounded"
                        >
                          {t('admin_user_toggle')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Admin
