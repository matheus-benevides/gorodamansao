import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Admin = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [product, setProduct] = useState({
    name: '', flavor: '', tag: '', price: '', description: '', image: '', color: 'primary'
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.is_admin) {
      navigate('/')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
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
    <main className="min-h-screen pt-40 px-margin max-w-4xl mx-auto pb-20">
      <header className="mb-16">
        <h1 className="font-headline text-5xl md:text-7xl mb-4 italic uppercase tracking-tighter">{t('admin_title')}</h1>
        <div className="h-1 w-20 bg-primary"></div>
      </header>

      <section className="glass-card p-8 md:p-16">
        <h2 className="font-headline text-3xl mb-12 uppercase italic tracking-tighter">{t('admin_add_prod')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
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
      </section>
    </main>
  )
}

export default Admin
