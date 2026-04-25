import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

const Catalog = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err))
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  }

  return (
    <main className="pt-24 md:pt-40 pb-section-gap px-margin max-w-container-max mx-auto">
      <header className="mb-stack-lg">
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-headline text-5xl md:text-[84px] mb-stack-sm max-w-4xl leading-tight uppercase"
        >
          {t('cat_title')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-body text-body-lg text-on-surface-variant max-w-2xl opacity-70 italic"
        >
          {t('cat_desc')}
        </motion.p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter"
      >
        {products.map((p, i) => (
          <motion.div 
            key={i}
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="glass-card p-6 md:p-10 flex flex-col group transition-all duration-500 hover:bg-white/[0.07] relative overflow-hidden"
          >
            <div className="relative h-[300px] md:h-[400px] mb-8 flex items-center justify-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className={`absolute w-40 h-40 bg-${p.color}-container/20 rounded-full blur-[80px]`}
              ></motion.div>
              <img 
                src={p.image} 
                className="h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 drop-shadow-2xl" 
                alt={p.name}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4 relative z-10">
              <span className={`font-mono text-[10px] px-3 py-1 bg-${p.color}-container/10 text-${p.color}-fixed border border-${p.color}-container/20 uppercase tracking-widest`}>{p.flavor}</span>
              <span className="font-mono text-[10px] px-3 py-1 bg-surface-container-high text-on-surface-variant border border-white/5 uppercase tracking-widest">{p.tag}</span>
            </div>
            
            <h3 className="font-headline text-3xl mb-2 relative z-10">{p.name}</h3>
            <p className="font-body text-sm text-on-surface-variant mb-8 flex-grow relative z-10 opacity-80">{p.description}</p>
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddToCart(p)}
              className={`w-full py-5 px-6 border border-${p.color}-container text-${p.color}-container font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-${p.color}-container hover:text-background relative z-10 overflow-hidden group/btn`}
            >
              <span className="relative z-10">{t('add_to_cart')}</span>
              <div className={`absolute inset-0 bg-${p.color}-container opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`}></div>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </main>
  )
}

export default Catalog
