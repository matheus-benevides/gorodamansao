import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Admin = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [product, setProduct] = useState({
    id: null, name: '', flavor: '', tag: '', price: '', description: '', image: '', color: 'primary'
  })
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.is_admin) {
      navigate('/')
    }
    if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'products') {
      fetchProducts()
    }
  }, [navigate, activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://127.0.0.1:3001/api/admin/users', {
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

  const fetchProducts = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://127.0.0.1:3001/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        console.log('Admin Products fetched:', data)
        setProducts(data)
      } else {
        console.error('Failed to fetch admin products:', res.status)
      }
    } catch (err) {
      console.error('Error fetching admin products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRole = async (userId, currentRole) => {
    const token = localStorage.getItem('token')
    const newRole = currentRole === 1 ? 0 : 1
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/admin/users/${userId}/role`, {
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

  const handleToggleProductStatus = async (productId, currentStatus) => {
    const token = localStorage.getItem('token')
    const newStatus = currentStatus === 1 ? 0 : 1
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/admin/products/${productId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: newStatus })
      })
      if (res.ok) {
        setProducts(products.map(p => p.id === productId ? { ...p, active: newStatus } : p))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditProduct = (p) => {
    setProduct(p)
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmitProduct = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const url = isEditing 
      ? `http://127.0.0.1:3001/api/admin/products/${product.id}` 
      : 'http://127.0.0.1:3001/api/products'
    const method = isEditing ? 'PUT' : 'POST'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      })

      if (res.ok) {
        setMessage(isEditing ? 'Produto atualizado!' : t('admin_prod_success'))
        setProduct({ id: null, name: '', flavor: '', tag: '', price: '', description: '', image: '', color: 'primary' })
        setIsEditing(false)
        fetchProducts()
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
          <div key="products" className="space-y-12">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card p-8 md:p-16">
              <h2 className="font-headline text-3xl mb-12 uppercase italic tracking-tighter">
                {isEditing ? 'Editar Produto' : t('admin_add_prod')}
              </h2>
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
                      <option value="primary-fixed">Primary Fixed (Yellow)</option>
                      <option value="tertiary-fixed">Tertiary Fixed (Purple)</option>
                      <option value="secondary-container">Secondary Container (Emerald)</option>
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

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 neon-border py-6 font-mono text-sm uppercase tracking-[0.4em] text-primary hover:bg-primary hover:text-background transition-all">
                    {isEditing ? 'Salvar Alterações' : t('admin_prod_btn')}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(false); setProduct({ id: null, name: '', flavor: '', tag: '', price: '', description: '', image: '', color: 'primary' }) }} className="px-8 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/5 transition-colors">
                      Cancelar
                    </button>
                  )}
                </div>

                {message && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-mono text-xs text-primary italic">
                    {message}
                  </motion.p>
                )}
              </form>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 md:p-12 overflow-x-auto">
              <h2 className="font-headline text-3xl mb-12 uppercase italic tracking-tighter">Produtos Cadastrados</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="p-4 font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">Produto</th>
                    <th className="p-4 font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">Preço</th>
                    <th className="p-4 font-mono text-[10px] uppercase text-on-surface-variant tracking-widest">Status</th>
                    <th className="p-4 font-mono text-[10px] uppercase text-on-surface-variant tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${p.active === 0 ? 'opacity-40 grayscale' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 object-contain" />
                          <div>
                            <p className="font-headline text-sm uppercase">{p.name}</p>
                            <p className="font-mono text-[8px] text-on-surface-variant uppercase">{p.tag}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs">R$ {p.price}</td>
                      <td className="p-4">
                        <span className={`font-mono text-[8px] uppercase px-2 py-1 rounded ${p.active === 1 ? 'bg-primary/20 text-primary' : 'bg-white/10 text-on-surface-variant'}`}>
                          {p.active === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEditProduct(p)} className="material-symbols-outlined text-lg text-primary hover:text-white transition-colors">edit</button>
                        <button onClick={() => handleToggleProductStatus(p.id, p.active)} className="material-symbols-outlined text-lg text-on-surface-variant hover:text-error transition-colors">
                          {p.active === 1 ? 'visibility_off' : 'visibility'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.section>
          </div>
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
