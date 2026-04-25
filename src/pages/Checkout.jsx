import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Checkout = () => {
  const { t } = useLanguage()
  const [cart, setCart] = useState([])
  const [addresses, setAddresses] = useState([])
  const [payments, setPayments] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false)
  const [newCard, setNewCard] = useState({ card_holder: '', card_number: '', expiry: '' })
  const [saveCard, setSaveCard] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)

    const token = localStorage.getItem('token')
    if (token) {
      fetch('http://localhost:3001/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setAddresses(data.addresses || [])
        setPayments(data.payments || [])
        if (data.addresses?.length > 0) setSelectedAddress(data.addresses[0].id)
        if (data.payments?.length > 0) setSelectedPayment(data.payments[0].id)
      })
    }
  }, [])

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + shipping

  const removeFromCart = (id) => {
    const newCart = cart.filter(item => item.id !== id)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const q = Math.max(1, item.quantity + delta)
        return { ...item, quantity: q }
      }
      return item
    })
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login')

    setIsProcessing(true)

    try {
      let finalPaymentId = selectedPayment

      // If new card and save is checked
      if (showNewPaymentForm && saveCard) {
        const cardRes = await fetch('http://localhost:3001/api/profile/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ ...newCard, type: 'Credit Card' })
        })
        const cardData = await cardRes.json()
        finalPaymentId = cardData.id
      }

      const res = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          items: cart,
          total: subtotal,
          shipping,
          address_id: selectedAddress,
          payment_id: finalPaymentId
        })
      })

      if (res.ok) {
        localStorage.removeItem('cart')
        navigate('/success')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-background">
      <div className="w-full md:w-[450px] lg:w-[600px] p-8 md:p-24 pt-32 bg-white/[0.02] border-r border-white/5 flex flex-col">
        <header className="mb-16">
          <h1 className="font-headline text-5xl mb-4 italic uppercase tracking-tighter">{t('checkout_title')}</h1>
          <div className="h-1 w-20 bg-primary"></div>
        </header>

        <div className="flex-grow space-y-8 overflow-y-auto pr-4 hide-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-20 opacity-30 font-mono text-xs uppercase tracking-widest">{t('checkout_empty')}</div>
          ) : (
            cart.map(item => {
              const nameKey = `p_${item.name.toLowerCase().replace(' ', '_')}_name`;
              return (
                <div key={item.id} className="glass-card p-6 flex gap-6 items-center">
                  <img src={item.image} className="w-20 h-20 object-contain" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline text-lg uppercase">{t(nameKey)}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-error opacity-50 hover:opacity-100">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-4 bg-white/5 px-2 py-1 rounded">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span className="font-mono text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <span className="font-mono text-xs">R$ {item.price}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-4 pt-10 border-t border-white/5 text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">
          <div className="flex justify-between"><span>{t('checkout_subtotal')}</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
          <div className="flex justify-between"><span>{t('checkout_shipping')}</span><span>{shipping === 0 ? t('checkout_shipping_free') : `R$ ${shipping.toFixed(2).replace('.', ',')}`}</span></div>
          <div className="flex justify-between items-end pt-6 text-primary font-headline text-3xl lowercase italic">
            <span className="text-lg">{t('checkout_total')}</span>
            <span className="not-italic">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 md:p-24 pt-32 bg-background flex flex-col">
        <form onSubmit={handleConfirm} className="max-w-xl space-y-12">
          <section>
            <h2 className="font-headline text-3xl mb-8 italic uppercase tracking-tighter">{t('checkout_delivery')}</h2>
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <Link to="/profile" className="block glass-card p-8 border-dashed text-center hover:border-primary transition-colors">
                  <p className="font-mono text-[10px] uppercase text-on-surface-variant">{t('order_empty')}</p>
                </Link>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`glass-card p-6 cursor-pointer border transition-all ${selectedAddress === addr.id ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/20'}`}>
                    <p className="font-headline text-lg uppercase">{addr.street}</p>
                    <p className="font-mono text-[10px] text-on-surface-variant">{addr.city}, {addr.state}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="font-headline text-3xl mb-8 italic uppercase tracking-tighter">{t('checkout_payment')}</h2>
            <div className="space-y-4">
              {payments.map(pm => (
                <div key={pm.id} onClick={() => { setSelectedPayment(pm.id); setShowNewPaymentForm(false); }} className={`glass-card p-6 cursor-pointer border transition-all ${selectedPayment === pm.id && !showNewPaymentForm ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/20'}`}>
                  <p className="font-mono text-sm tracking-widest">•••• •••• •••• {pm.card_number.slice(-4)}</p>
                  <p className="font-headline text-lg uppercase mt-1">{pm.card_holder}</p>
                </div>
              ))}
              
              <div 
                onClick={() => { setShowNewPaymentForm(true); setSelectedPayment(null); }}
                className={`glass-card p-6 cursor-pointer border transition-all ${showNewPaymentForm ? 'border-primary bg-primary/5' : 'border-dashed border-white/10 hover:border-white/30'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">add_card</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest">{t('checkout_new_card')}</span>
                </div>
                
                <AnimatePresence>
                  {showNewPaymentForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-8 space-y-6 overflow-hidden">
                      <input type="text" placeholder={t('checkout_card_holder')} value={newCard.card_holder} onChange={e => setNewCard({...newCard, card_holder: e.target.value})} className="w-full bg-transparent border-b border-white/10 pb-2 font-mono text-xs focus:border-primary focus:outline-none" required={showNewPaymentForm} />
                      <input type="text" placeholder={t('checkout_card_number')} value={newCard.card_number} onChange={e => setNewCard({...newCard, card_number: e.target.value})} className="w-full bg-transparent border-b border-white/10 pb-2 font-mono text-xs focus:border-primary focus:outline-none" required={showNewPaymentForm} />
                      <div className="flex gap-4">
                        <input type="text" placeholder={t('checkout_expiry')} value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} className="flex-1 bg-transparent border-b border-white/10 pb-2 font-mono text-xs focus:border-primary focus:outline-none" required={showNewPaymentForm} />
                        <input type="text" placeholder={t('checkout_cvv')} className="w-20 bg-transparent border-b border-white/10 pb-2 font-mono text-xs focus:border-primary focus:outline-none" required={showNewPaymentForm} />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} className="hidden" />
                        <div className={`w-4 h-4 border ${saveCard ? 'bg-primary border-primary' : 'border-white/20'} flex items-center justify-center transition-all`}>
                          {saveCard && <span className="material-symbols-outlined text-[10px] text-background">check</span>}
                        </div>
                        <span className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant group-hover:text-white transition-colors">{t('checkout_save_card')}</span>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          <button type="submit" disabled={isProcessing || cart.length === 0 || !selectedAddress || (!selectedPayment && !showNewPaymentForm)} className="w-full neon-border py-6 font-mono text-xs uppercase tracking-[0.4em] text-secondary-fixed-dim hover:bg-secondary-fixed-dim hover:text-background transition-all disabled:opacity-30 disabled:hover:bg-transparent">
            {isProcessing ? t('checkout_processing') : t('checkout_finalize')}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Checkout
