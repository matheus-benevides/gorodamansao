import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart } = useCart()
  const { lang, setLang, t } = useLanguage()
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isCheckout = location.pathname === '/checkout'

  useEffect(() => {
    const handleSync = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) setUser(JSON.parse(storedUser))
    }
    
    handleSync()
    window.addEventListener('storage', handleSync)
    return () => window.removeEventListener('storage', handleSync)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  if (isCheckout) return null

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-3xl border-b-[0.5px] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex justify-between items-center px-6 md:px-16 h-20 md:h-24">
      <div className="hidden md:flex items-center gap-12 font-serif text-neutral-50 tracking-widest uppercase text-xs">
        <Link
          to="/catalog"
          className={`transition-all duration-500 ${location.pathname === '/catalog' ? 'text-emerald-400 font-bold border-b border-emerald-400 pb-1' : 'text-neutral-400 hover:text-emerald-300'}`}
        >
          {t('nav_collections')}
        </Link>
        <Link
          to="/"
          className="text-neutral-400 hover:text-emerald-300 transition-all duration-500 ease-in-out"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault()
              document.getElementById('ciencia-do-goro')?.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          {t('nav_mansion')}
        </Link>
      </div>

      <Link to="/" className="text-2xl md:text-4xl font-serif text-neutral-50 tracking-tighter italic scale-95 active:scale-90 transition-transform">
        GORÓ DA MANSÃO
      </Link>

      <div className="hidden md:flex items-center gap-12 font-serif text-neutral-50 tracking-widest uppercase text-xs">
        <div className="flex items-center gap-6">
          {/* Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="font-mono text-[10px] text-on-surface-variant hover:text-primary transition-colors border border-white/10 px-2 py-1 rounded"
          >
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>

          <Link to="/checkout" className="relative group/cart">
            <span className="material-symbols-outlined text-neutral-50 cursor-pointer hover:text-emerald-300 transition-colors">shopping_bag</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-background text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <Link to="/profile" className="font-mono text-[10px] text-emerald-400 uppercase tracking-tighter hover:text-white transition-colors cursor-pointer">{user.name}</Link>
              <span 
                onClick={handleLogout}
                className="material-symbols-outlined text-neutral-50 cursor-pointer hover:text-error transition-colors text-sm"
              >logout</span>
            </div>
          ) : (
            <Link to="/login">
              <span className="material-symbols-outlined text-neutral-50 cursor-pointer hover:text-emerald-300 transition-colors">person</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Toggle & Icons */}
      <div className="flex md:hidden items-center gap-6">
        <button 
          onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          className="font-mono text-[8px] text-on-surface-variant border border-white/10 px-2 py-1 rounded"
        >
          {lang === 'pt' ? 'EN' : 'PT'}
        </button>
        <Link to="/checkout" className="relative">
          <span className="material-symbols-outlined text-neutral-50">shopping_bag</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-background text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="material-symbols-outlined text-neutral-50">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-neutral-900 border-b border-white/10 p-8 flex flex-col gap-6 font-mono text-[10px] uppercase tracking-widest md:hidden"
          >
            <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>{t('nav_collections')}</Link>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>{t('nav_mansion')}</Link>
            {user ? (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-emerald-400">{t('nav_profile')} ({user.name})</Link>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>{t('nav_login')}</Link>
            )}
            {user && (
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-error text-left">{t('nav_logout')}</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
