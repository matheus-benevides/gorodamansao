import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      } else {
        setError(data.error || 'Credenciais inválidas')
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
          <h1 className="font-headline text-4xl italic mb-2 uppercase">Entrar</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Acesse a Mansão</p>
        </header>

        {error && <p className="text-error font-mono text-xs mb-6 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-8">
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
            Entrar no Vazio
          </motion.button>
        </form>

        <p className="mt-12 text-center font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
          Ainda não tem convite? <Link to="/register" className="text-primary hover:text-secondary-fixed-dim border-b border-white/10">Solicitar Acesso</Link>
        </p>
      </motion.div>
    </main>
  )
}

export default Login
