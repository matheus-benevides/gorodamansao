import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10 px-margin">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-3xl font-serif text-neutral-50 tracking-tighter italic mb-6 block">
            GORÓ DA MANSÃO
          </Link>
          <p className="font-body text-on-surface-variant max-w-sm opacity-60 italic">
            {t('footer_desc')}
          </p>
        </div>
        
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-6">{t('footer_shop')}</h4>
          <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
            <li><Link to="/catalog" className="hover:text-white transition-colors">{t('nav_collections')}</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">{t('nav_mansion')}</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-6">{t('footer_support')}</h4>
          <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
            <li><a href="#" className="hover:text-white transition-colors">{t('footer_terms')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('footer_privacy')}</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-container-max mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant opacity-40">
          © 2025 GORÓ DA MANSÃO. {t('footer_rights')}
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-on-surface-variant hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">brand_awareness</span></a>
          <a href="#" className="text-on-surface-variant hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">public</span></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
