import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Success = () => {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen flex items-center justify-center pt-24 px-margin">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(19,255,67,0.1)_0%,_transparent_70%)] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 md:p-24 text-center max-w-3xl relative z-10"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, delay: 0.2 }}
          className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_50px_rgba(19,255,67,0.5)]"
        >
          <span className="material-symbols-outlined text-background text-5xl font-bold">check</span>
        </motion.div>

        <h1 className="font-headline text-5xl md:text-7xl mb-6 uppercase italic tracking-tighter">{t('success_title')}</h1>
        <p className="font-body text-xl text-on-surface-variant mb-12 max-w-xl mx-auto italic opacity-70">
          {t('success_desc')}
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link to="/profile">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="neon-border px-10 py-5 font-mono text-xs text-primary uppercase tracking-widest hover:bg-primary hover:text-background transition-all"
            >
              {t('success_cta')}
            </motion.button>
          </Link>
          <Link to="/catalog">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 font-mono text-xs text-on-surface-variant uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all"
            >
              {t('back_to_catalog')}
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

export default Success
