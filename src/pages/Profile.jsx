import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Profile = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('perfil')
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zip: '' })
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [newPayment, setNewPayment] = useState({ card_holder: '', card_number: '', expiry: '', type: 'Credit Card' })

  const fetchProfile = () => {
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login')

    fetch('http://localhost:3001/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      setProfile(data)
      return fetch('http://localhost:3001/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    })
    .then(res => res.json())
    .then(data => {
      setOrders(data)
      setLoading(false)
    })
    .catch(() => navigate('/login'))
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: profile.name, email: profile.email, avatar: profile.avatar })
    })
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify({ ...profile }))
      window.dispatchEvent(new Event('storage'))
      setMessage(t('profile_save_success'))
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/api/profile/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newAddress)
    })
    if (res.ok) {
      setShowAddressForm(false)
      setNewAddress({ street: '', city: '', state: '', zip: '' })
      fetchProfile()
    }
  }

  const handleAddPayment = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/api/profile/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newPayment)
    })
    if (res.ok) {
      setShowPaymentForm(false)
      setNewPayment({ card_holder: '', card_number: '', expiry: '', type: 'Credit Card' })
      fetchProfile()
    }
  }

  if (loading || !profile) return <div className="min-h-screen flex items-center justify-center font-mono text-emerald-400">{t('loading')}</div>

  const tabs = [
    { id: 'perfil', label: t('profile_tab_info') },
    { id: 'pedidos', label: t('profile_tab_orders') },
    { id: 'endereços', label: t('profile_tab_addr') },
    { id: 'pagamentos', label: t('profile_tab_pay') }
  ]

  return (
    <main className="pt-32 pb-section-gap px-margin max-w-6xl mx-auto min-h-screen">
      <header className="mb-16 flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-secondary-fixed-dim/20 blur-3xl rounded-full"></div>
          <img src={profile.avatar} className="w-32 h-32 rounded-full object-cover relative z-10 border-2 border-white/10" />
        </div>
        <div>
          <h1 className="font-headline text-5xl uppercase tracking-tighter mb-2">{profile.name}</h1>
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{profile.email} • {t('profile_title')}</p>
        </div>
      </header>

      <div className="flex gap-12 border-b border-white/5 mb-12 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-4 font-mono text-[10px] uppercase tracking-[0.2em] relative whitespace-nowrap ${activeTab === tab.id ? 'text-primary' : 'text-on-surface-variant'}`}>
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'perfil' && (
          <motion.div key="perfil" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 md:p-12">
            <form onSubmit={handleUpdateProfile} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{t('profile_name_label')}</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 pb-3 text-xl font-headline focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{t('profile_email_label')}</label>
                  <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 pb-3 text-xl font-headline focus:border-primary focus:outline-none" />
                </div>
              </div>
              <button className="neon-border px-12 py-4 font-mono text-[10px] text-secondary-fixed-dim uppercase tracking-[0.3em] hover:bg-secondary-fixed-dim hover:text-background transition-all">{t('profile_save')}</button>
              {message && <span className="ml-6 font-mono text-[10px] text-primary uppercase">{message}</span>}
            </form>
          </motion.div>
        )}

        {activeTab === 'pedidos' && (
          <motion.div key="pedidos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {orders.length === 0 ? (
              <div className="glass-card p-12 text-center border-dashed">
                <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">{t('order_empty')}</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="glass-card p-8 group">
                  <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant">{t('order_id')}</p>
                      <h3 className="font-mono text-lg text-primary">#MSN-{order.id}</h3>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</p>
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Processing</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {order.items.map(item => {
                      const nameKey = `p_${item.name.toLowerCase().replace(' ', '_')}_name`;
                      return (
                        <div key={item.id} className="flex gap-4 items-center">
                          <img src={item.image} className="w-12 h-12 object-contain" />
                          <div>
                            <p className="font-headline text-sm uppercase">{t(nameKey)}</p>
                            <p className="font-mono text-[8px] text-on-surface-variant uppercase">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-end">
                     <div>
                        <p className="font-mono text-[8px] uppercase text-on-surface-variant">{t('order_total')}</p>
                        <p className="font-headline text-2xl text-primary">R$ {(order.total + order.shipping).toFixed(2).replace('.', ',')}</p>
                     </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'endereços' && (
          <motion.div key="endereços" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-3xl italic uppercase">{t('addr_saved')}</h2>
              <button onClick={() => setShowAddressForm(!showAddressForm)} className="font-mono text-[10px] text-primary border-b border-primary/30 uppercase tracking-widest hover:border-primary">
                {showAddressForm ? t('addr_cancel') : t('addr_new')}
              </button>
            </div>

            {showAddressForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="glass-card p-10 mb-12 overflow-hidden">
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input type="text" placeholder={t('addr_street')} value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="col-span-full bg-transparent border-b border-white/10 pb-3 font-mono text-sm focus:border-primary focus:outline-none" required />
                  <input type="text" placeholder={t('addr_city')} value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="bg-transparent border-b border-white/10 pb-3 font-mono text-sm focus:border-primary focus:outline-none" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder={t('addr_state')} value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="bg-transparent border-b border-white/10 pb-3 font-mono text-sm focus:border-primary focus:outline-none" required />
                    <input type="text" placeholder={t('addr_zip')} value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="bg-transparent border-b border-white/10 pb-3 font-mono text-sm focus:border-primary focus:outline-none" required />
                  </div>
                  <button className="col-span-full neon-border py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-background transition-all">{t('addr_save')}</button>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {profile.addresses.map(addr => (
                <div key={addr.id} className="glass-card p-8 relative group">
                  <h3 className="font-headline text-xl mb-1 uppercase">{addr.street}</h3>
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{addr.city}, {addr.state} {addr.zip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'pagamentos' && (
          <motion.div key="pagamentos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-3xl italic uppercase">{t('pay_methods')}</h2>
              <button onClick={() => setShowPaymentForm(!showPaymentForm)} className="font-mono text-[10px] text-primary border-b border-primary/30 uppercase tracking-widest hover:border-primary">
                {showPaymentForm ? t('addr_cancel') : t('pay_new')}
              </button>
            </div>

            {showPaymentForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="glass-card p-10 mb-12 overflow-hidden">
                <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input type="text" placeholder={t('pay_holder')} value={newPayment.card_holder} onChange={e => setNewPayment({...newPayment, card_holder: e.target.value})} className="col-span-full bg-transparent border-b border-white/10 pb-3 font-mono text-sm focus:border-primary focus:outline-none" required />
                  <input type="text" placeholder={t('pay_number')} value={newPayment.card_number} onChange={e => setNewPayment({...newPayment, card_number: e.target.value})} className="bg-transparent border-b border-white/10 pb-3 font-mono text-sm focus:border-primary focus:outline-none" required />
                  <input type="text" placeholder={t('pay_expiry')} value={newPayment.expiry} onChange={e => setNewPayment({...newPayment, expiry: e.target.value})} className="bg-transparent border-b border-white/10 pb-3 font-mono text-sm focus:border-primary focus:outline-none" required />
                  <button className="col-span-full neon-border py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-background transition-all">{t('pay_save')}</button>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {profile.payments.map(pm => (
                <div key={pm.id} className="glass-card p-10 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden">
                  <p className="font-mono text-lg tracking-[0.2em] mb-6">•••• •••• •••• {pm.card_number.slice(-4)}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-headline text-xl uppercase">{pm.card_holder}</p>
                    </div>
                    <span className="font-mono text-sm">{pm.expiry}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Profile
