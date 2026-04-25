import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (res.ok) {
        navigate('/login')
      } else {
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (err) {
      setError('Erro de conexão')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-margin bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(19,255,67,0.05)_0%,_transparent_70%)] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 w-full max-w-md relative z-10"
      >
        <header className="mb-12 text-center">
          <h1 className="font-headline text-4xl italic mb-2 uppercase">Registrar</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Solicite Acesso à Mansão</p>
        </header>

        {error && <p className="text-error font-mono text-xs mb-6 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="relative">
            <label className="block font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Nome Completo</label>
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 pb-3 text-xl font-headline uppercase focus:border-secondary-container focus:outline-none transition-colors" 
              placeholder="SEU NOME"
            />
          </div>
          <div className="relative">
            <label className="block font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">E-mail</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 pb-3 text-xl font-headline focus:border-secondary-container focus:outline-none transition-colors" 
              placeholder="seu@email.com"
            />
          </div>
          <div className="relative">
            <label className="block font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Senha</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 pb-3 text-xl font-headline focus:border-secondary-container focus:outline-none transition-colors" 
              placeholder="••••••••"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 border border-secondary-container text-secondary-container font-mono text-xs uppercase tracking-[0.3em] hover:bg-secondary-container hover:text-background transition-all duration-500 neon-glow"
          >
            Criar Conta
          </motion.button>
        </form>

        <p className="mt-12 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
          Já é um membro? <Link to="/login" className="text-primary hover:text-secondary-fixed-dim border-b border-white/10">Fazer Login</Link>
        </p>
      </motion.div>
    </main>
  )
}

export default Register
