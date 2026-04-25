import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, subtotal, shipping, updateQuantity, removeFromCart, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [addresses, setAddresses] = useState([])
  const [payments, setPayments] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

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
    .catch(err => console.error(err))
  }, [navigate])

  const handleConfirm = async (e) => {
    e.preventDefault()
    if (cart.length === 0 || !selectedAddress || !selectedPayment) return
    
    setIsProcessing(true)
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          total: subtotal,
          shipping: shipping,
          address_id: selectedAddress,
          payment_id: selectedPayment,
          items: cart
        })
      })

      if (res.ok) {
        setTimeout(() => {
          setIsProcessing(false)
          setIsSuccess(true)
          clearCart()
        }, 1500)
      } else {
        setIsProcessing(false)
        alert('Falha ao processar pedido')
      }
    } catch (err) {
      setIsProcessing(false)
      console.error(err)
    }
  }

  const total = subtotal + shipping

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-16 max-w-lg w-full border-primary/20">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10">
            <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
          </div>
          <h2 className="font-headline text-5xl mb-6 italic uppercase tracking-tighter">Pedido Confirmado</h2>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest leading-loose mb-12">
            Sua jornada sensorial começou. Prepare-se para elevar sua experiência ao nível Mansão.
          </p>
          <Link to="/profile" className="block w-full py-5 bg-primary text-background font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-secondary-fixed-dim transition-all">Ver meus pedidos</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-stretch">
      <div className="w-full md:w-[45%] bg-surface-container-low p-8 md:p-20 flex flex-col pt-32">
        <Link to="/catalog" className="flex items-center gap-4 text-on-surface-variant hover:text-primary transition-colors mb-12 group">
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="font-mono text-[10px] uppercase tracking-widest">Retornar ao Catálogo</span>
        </Link>
        
        <h1 className="font-headline text-4xl italic mb-10 uppercase tracking-tighter">Sua Seleção</h1>
        
        <div className="space-y-6 flex-grow overflow-y-auto max-h-[50vh] pr-4 hide-scrollbar mb-10">
          {cart.length === 0 ? (
            <div className="text-center py-20 opacity-30 font-mono text-xs uppercase tracking-widest">Seu carrinho está vazio</div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="glass-card p-6 flex gap-6 items-center">
                <img src={item.image} className="w-20 h-20 object-contain" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-headline text-lg uppercase">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-error opacity-50 hover:opacity-100">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-4 bg-white/5 px-2 py-1 rounded">
                      <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-primary transition-colors">-</button>
                      <span className="font-mono text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-primary transition-colors">+</button>
                    </div>
                    <span className="font-mono text-xs">R$ {item.price}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4 pt-10 border-t border-white/5 text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">
          <div className="flex justify-between"><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
          <div className="flex justify-between"><span>Frete</span><span>{shipping === 0 ? 'Cortesia' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}</span></div>
          <div className="flex justify-between items-end pt-6 text-primary font-headline text-3xl lowercase italic">
            <span className="text-lg">Total</span>
            <span className="not-italic">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 md:p-24 pt-32 bg-background flex flex-col">
        <form onSubmit={handleConfirm} className="max-w-xl space-y-12">
          <section>
            <h2 className="font-headline text-3xl mb-8 italic uppercase tracking-tighter">Entrega</h2>
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <Link to="/profile" className="block glass-card p-8 border-dashed text-center hover:border-primary transition-colors">
                  <p className="font-mono text-[10px] uppercase text-on-surface-variant">Nenhum endereço salvo. Cadastre no perfil.</p>
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
            <h2 className="font-headline text-3xl mb-8 italic uppercase tracking-tighter">Pagamento</h2>
            <div className="space-y-4">
              {payments.length === 0 ? (
                <Link to="/profile" className="block glass-card p-8 border-dashed text-center hover:border-primary transition-colors">
                  <p className="font-mono text-[10px] uppercase text-on-surface-variant">Nenhum cartão salvo. Cadastre no perfil.</p>
                </Link>
              ) : (
                payments.map(pm => (
                  <div key={pm.id} onClick={() => setSelectedPayment(pm.id)} className={`glass-card p-6 cursor-pointer border transition-all ${selectedPayment === pm.id ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/20'}`}>
                    <p className="font-mono text-sm tracking-widest">•••• •••• •••• {pm.card_number.slice(-4)}</p>
                    <p className="font-headline text-lg uppercase mt-1">{pm.card_holder}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <button type="submit" disabled={isProcessing || cart.length === 0 || !selectedAddress || !selectedPayment} className="w-full neon-border py-6 font-mono text-xs uppercase tracking-[0.4em] text-secondary-fixed-dim hover:bg-secondary-fixed-dim hover:text-background transition-all disabled:opacity-30 disabled:hover:bg-transparent">
            {isProcessing ? 'Sincronizando Alquimia...' : 'Finalizar Pedido'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Checkout
