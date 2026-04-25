import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  if (location.pathname === '/checkout') return null

  return (
    <footer className="bg-black w-full py-40 border-t border-white/5 flex flex-col items-center gap-12 px-16 text-center">
      <Link to="/" className="text-xl font-serif text-neutral-50 italic uppercase tracking-tighter">
        GORÓ DA MANSÃO
      </Link>
      
      <div className="flex flex-wrap justify-center gap-12 mb-12">
        <Link to="#" className="font-sans text-[10px] tracking-[0.3em] uppercase text-neutral-600 hover:text-neutral-50 transition-colors duration-300">Contato</Link>
        <Link to="#" className="font-sans text-[10px] tracking-[0.3em] uppercase text-neutral-600 hover:text-neutral-50 transition-colors duration-300">Envio</Link>
        <Link to="#" className="font-sans text-[10px] tracking-[0.3em] uppercase text-neutral-600 hover:text-neutral-50 transition-colors duration-300">Privacidade</Link>
        <Link to="#" className="font-sans text-[10px] tracking-[0.3em] uppercase text-neutral-600 hover:text-neutral-50 transition-colors duration-300">Sustentabilidade</Link>
      </div>
      
      <div className="flex gap-8 mb-12">
        <span className="material-symbols-outlined text-neutral-500 hover:text-secondary-fixed-dim cursor-pointer transition-colors">public</span>
        <span className="material-symbols-outlined text-neutral-500 hover:text-secondary-fixed-dim cursor-pointer transition-colors">share</span>
        <span className="material-symbols-outlined text-neutral-500 hover:text-secondary-fixed-dim cursor-pointer transition-colors">alternate_email</span>
      </div>
      
      <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-neutral-500 opacity-80 hover:opacity-100 transition-opacity">
        © 2025 GORÓ DA MANSÃO. NASCIDO NO VAZIO.
      </p>
    </footer>
  )
}

export default Footer
