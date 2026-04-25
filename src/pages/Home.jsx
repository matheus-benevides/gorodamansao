import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

const Home = () => {
  const { t } = useLanguage()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const bottleY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const glowScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  }

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
        <motion.div 
          style={{ scale: glowScale }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(19,255,67,0.12)_0%,_transparent_70%)] pointer-events-none"
        ></motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="z-10 text-center max-w-5xl px-margin mb-stack-lg"
        >
          <motion.h1 variants={itemVariants} className="font-headline text-5xl md:text-[84px] text-primary mb-stack-sm uppercase leading-[0.9] tracking-tighter">
            {t('hero_title')}<br/>
            <span className="text-secondary-fixed-dim bg-clip-text text-transparent bg-gradient-to-r from-secondary-fixed-dim to-emerald-400">{t('hero_subtitle')}</span><br/>
            {t('hero_vibe')}
          </motion.h1>
          <motion.p variants={itemVariants} className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto italic opacity-80">
            {t('hero_desc')}
          </motion.p>
        </motion.div>

        <motion.div 
          style={{ y: bottleY }}
          initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl aspect-video flex items-center justify-center"
        >
          <div className="absolute w-80 h-[600px] bg-secondary-fixed-dim/15 blur-[140px] rounded-full animate-pulse"></div>
          <motion.img 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 2, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-20 h-full w-auto object-contain drop-shadow-[0_0_60px_rgba(19,255,67,0.4)]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9i67M9qChp2kbcmwSYYPXujMgzy2hrUEAx4qegOsuNoDdqBqP4OZO_QPSrvcPSbbYhHu-yi3K-7P6Kso_adCll90W6gKqpMIG6zN0Yf5tVJhp21i-Wsrwapb6oMDxcP25kKEaM77yf0iOjvQcuTg5DU3AIpJ5ysJOU5S5BuhKyv-OtzUcnahkUh0dA5u0vhhLbg_B-XkEkNfWG7pdU9-UdvBD6C5Ynbn3qSU6kIGe7D6_q_tSm9XDnk9Poh15fuH3UR_unj0wXtU"
            alt="Garrafa de Goró"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-stack-lg z-10">
          <Link to="/catalog">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(19,255,67,0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="neon-border px-16 py-6 font-mono text-sm text-secondary-fixed-dim uppercase tracking-[0.3em] hover:bg-secondary-fixed-dim hover:text-background transition-all duration-500 neon-glow overflow-hidden relative group"
            >
              <span className="relative z-10">{t('hero_cta')}</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </motion.button>
          </Link>
        </motion.div>
      </header>

      {/* Vozes da Mansão */}
      <section className="py-section-gap">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="px-margin mb-stack-md">
          <h2 className="font-headline text-3xl md:text-4xl text-primary italic border-l-2 border-secondary-fixed-dim pl-6 uppercase">Vozes da Mansão</h2>
        </motion.div>
        
        <div className="flex overflow-x-auto hide-scrollbar gap-gutter px-margin pb-12 snap-x">
          {[
            { name: "Lucca M.", role: "Techno Artist", text: "O único drink que me permite performar no palco e na academia sem o crash do café.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1HvSc5RcNe9lGfg-Cc72VTGSDEgfRnzy8uIkoZ56Frd4nXagvo5NewN2B2Nhapr-uDpslipuvX49inl2zmbbxegJNFQ37b4olDB3qfcgQ8tIZL2N2qwvwkyON9Jk9E3nN8PHq1ziYCgKWayU0aAD83oM2_RIoczTdZR71NtiCZOh4lGwz9-BxRdgVOJC0s78HEu9aat4Vnhfqfi5XyFKhL0wbvSQN-JlmHPdVmcHOHfnW_qmp4qXvFwLSvNCzG4BfBoHovwfzcd4" },
            { name: "Felipe R.", role: "Fitness Curator", text: "Redução de danos nunca foi tão sexy. O shape agradece e a mente flutua.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnrjtzDrjVYgQPK_L_C-nd6G_A1tg3S3lgP27cTBMRpsmLyNhJslUrnuN4xWP6_2sy6BlcgOdywekL0zzxglJLrJQNvcEgweS07RKtzG7DQjFaYl4esJtxfZhF0sTBXl-MrIj8OQ5yV4CF4qLgfoLY-Du6NwNnwD2UNdtcPUuDJXs8AJA2txpV8z0SRECgkGqKLy59nx_RFv-f3KTMjue5bt8buTXUSGryhQD-re4Qg4QoqaGr03_wA27Tpl0yxL9u5ZJleO11jlg" },
            { name: "Bia S.", role: "Visual Designer", text: "Substituí o álcool por Goró e minha criatividade triplicou. Mansão lifestyle.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBI94CEBTUVfws5YrTeTFYnu0EIQCbLrHQg4LLKIootlvqlxQLzKgXdjr2sfI-TlYkoXfXAzfeC0UAOqkdCZ9Z5Ep5F_nNuESCOirZraN9gT_hd-uPgG5OMfJIkuM2k30pLm7afhzZb1XlOTX9aw6AwuWX_7WYmIObiUX0WgxmLuNMYfcU4If38vLDrHr3qMhc35xJANMjzD7kgFbTkuHH15ZewN8dYHigECbs80hK8m0LYtnJudD9ZwAHOQnxYv4RKaqFJreDwvdg" }
          ].map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} className="glass-card min-w-[300px] md:min-w-[400px] p-6 md:p-10 flex flex-col justify-between snap-center">
              <span className="material-symbols-outlined text-secondary-fixed-dim text-4xl mb-6">format_quote</span>
              <p className="font-headline text-2xl text-primary italic mb-8 leading-snug">"{v.text}"</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <img className="w-12 h-12 rounded-full grayscale" src={v.img} alt={v.name} />
                <div>
                  <p className="font-mono text-xs text-primary uppercase">{v.name}</p>
                  <p className="font-mono text-[10px] text-neutral-500 uppercase">{v.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ciência do Goró */}
      <div id="ciencia-do-goro">
        <section className="px-16 mb-stack-lg text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="max-w-4xl mx-auto">
            <span className="font-mono text-xs text-secondary-fixed-dim mb-4 block uppercase tracking-[0.3em]">Por que o Goró?</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary leading-tight uppercase">A Ciência do Shape Inexplicável</h2>
            <p className="font-body text-body-lg text-on-surface-variant mt-6 max-w-2xl mx-auto italic">
              Esqueça o colapso. Desenvolvemos a alquimia perfeita para quem vive no limite entre a performance do dia e o caos da noite.
            </p>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 border-y border-white/5">
          <div className="relative bg-neutral-900/30 p-16 flex flex-col justify-center border-r border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-error-container/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10 space-y-12">
              <div className="inline-block px-4 py-1 border border-error text-error font-mono text-xs uppercase tracking-widest">O Perigo</div>
              <h2 className="font-headline text-4xl text-error uppercase">Energético Comum + Álcool = Caos Cardíaco</h2>
              <div className="grid gap-8">
                {[
                  { icon: "heart_broken", title: "Taquicardia Descontrolada", text: "O excesso de cafeína sintética mascara a embriaguez e sobrecarrega o miocárdio em tempo recorde." },
                  { icon: "psychology_alt", title: "Ansiedade & Queda", text: "O pico de açúcar seguido pela queda brusca gera irritabilidade e uma 'bad trip' garantida no dia seguinte." },
                  { icon: "bolt", title: "Burnout Celular", text: "Estresse oxidativo agressivo que drena sua energia vital e destrói sua recuperação muscular." }
                ].map((item, i) => (
                  <div key={i} className="glass-card p-8 flex items-start gap-6 border-error/20">
                    <span className="material-symbols-outlined text-error text-4xl">{item.icon}</span>
                    <div>
                      <h4 className="font-mono text-sm text-on-background mb-2">{item.title}</h4>
                      <p className="text-on-surface-variant text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative bg-background p-16 flex flex-col justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10 space-y-12">
              <div className="inline-block px-4 py-1 border border-secondary-container text-secondary-container font-mono text-xs uppercase tracking-widest">A Revolução</div>
              <h2 className="font-headline text-4xl text-secondary-fixed-dim uppercase">Goró da Mansão = Vibe Pura & Redução de Danos</h2>
              <div className="grid gap-8">
                {[
                  { icon: "water_drop", title: "Hidratação Inteligente", text: "Eletrólitos biodisponíveis que mantêm o equilíbrio osmótico mesmo sob o efeito do álcool." },
                  { icon: "verified", title: "Foco & Vitaminas", text: "Complexo B e Nootrópicos naturais que protegem o fígado e mantêm a mente afiada na pista." },
                  { icon: "energy_savings_leaf", title: "Sem Ressaca Atômica", text: "Curadoria de ervas adaptógenas que suavizam a descida, garantindo um despertar sem arrependimentos." }
                ].map((item, i) => (
                  <div key={i} className="glass-card p-8 flex items-start gap-6 border-secondary-container/20">
                    <span className="material-symbols-outlined text-secondary-container text-4xl">{item.icon}</span>
                    <div>
                      <h4 className="font-mono text-sm text-on-background mb-2">{item.title}</h4>
                      <p className="text-on-surface-variant text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="py-section-gap px-margin text-center">
        <Link to="/catalog">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="neon-border px-16 py-6 font-mono text-lg text-secondary-fixed-dim uppercase tracking-[0.4em] hover:bg-secondary-fixed-dim hover:text-background transition-all duration-500 neon-glow">
            {t('hero_cta')}
          </motion.button>
        </Link>
      </section>
    </div>
  )
}

export default Home
