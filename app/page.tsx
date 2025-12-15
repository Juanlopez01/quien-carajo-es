'use client'

import { createRoom, enterRoom, getGamesCount } from '@/app/actions/lobby'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Coffee, Gamepad2, Heart, Users, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isLoading, setIsLoading] = useState<'classic' | 'party' | 'joining' | null>(null)
  const [totalGames, setTotalGames] = useState<number | null>(null)
  const [nickname, setNickname] = useState('') // <--- ESTADO PARA EL NOMBRE
  const router = useRouter()

  useEffect(() => {
    getGamesCount().then(count => setTotalGames(count))
    // Recuperar nombre guardado si existe
    const savedName = localStorage.getItem('player_name')
    if (savedName) setNickname(savedName)
  }, [])

  const saveNickname = () => {
    if (nickname.trim()) localStorage.setItem('player_name', nickname.trim())
  }

  const handleCreate = async (mode: 'classic' | 'party') => {
    if (!nickname.trim()) { alert('¡Ponete un nombre che!'); return }
    saveNickname()
    setIsLoading(mode)
    try {
      await createRoom(mode, nickname)
    } catch (e) {
      console.error(e)
      setIsLoading(null)
    }
  }

  const handleJoinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!nickname.trim()) { alert('¡Ponete un nombre che!'); return }
    saveNickname()

    setIsLoading('joining')
    const formData = new FormData(e.currentTarget)
    const code = formData.get('code')?.toString().toUpperCase()
    if (!code) { setIsLoading(null); return }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const { error: anonError } = await supabase.auth.signInAnonymously()
      if (anonError) { alert('Error de login'); setIsLoading(null); return }
    }

    const res = await enterRoom(code, nickname)
    if (res.error) {
      alert(res.error)
      setIsLoading(null)
    } else {
      router.push(`/game/${code}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md space-y-6 text-center z-10">

        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2 mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-yellow-400 uppercase tracking-tighter drop-shadow-xl">
            ¿Quién<br />Carajo<br />Es?
          </h1>
          <p className="text-slate-400 font-medium">Edición Cultura Argentina 🇦🇷</p>
          {totalGames !== null && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs text-slate-400 mt-2">
              <Gamepad2 size={12} className="text-yellow-500" />
              <span><span className="font-bold text-white">{totalGames}</span> partidas jugadas</span>
            </motion.div>
          )}
        </motion.div>

        {/* INPUT DE NOMBRE (VISUALMENTE DESTACADO) */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-yellow-400 ml-1 uppercase tracking-wider">Tu Apodo</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ej: El Comandante"
            maxLength={15}
            className="w-full rounded-xl border-2 border-slate-700 bg-slate-900 px-4 py-3 text-lg font-bold text-white placeholder-slate-600 focus:border-yellow-400 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-3 pt-2">
          <button onClick={() => handleCreate('party')} disabled={!!isLoading} className="w-full rounded-xl bg-yellow-400 py-4 text-xl font-bold text-black shadow-[0_4px_0_0_rgba(161,98,7,1)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgba(161,98,7,1)] active:translate-y-1 active:shadow-none disabled:opacity-50 flex items-center justify-center gap-3">
            {isLoading === 'party' ? <Loader2 className="animate-spin" /> : <Users className="w-8 h-8" />}
            <div className="text-left leading-none">
              <div className="text-xs font-bold opacity-70 mb-1">RECOMENDADO</div>
              <div>MODO FIESTA</div>
            </div>
          </button>

          <button onClick={() => handleCreate('classic')} disabled={!!isLoading} className="w-full rounded-xl bg-slate-800 border-2 border-slate-700 py-3 text-sm font-bold text-white hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
            {isLoading === 'classic' ? <Loader2 className="animate-spin h-4 w-4" /> : <User className="text-slate-400 h-4 w-4" />}
            Crear Clásico (1 vs 1)
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="mx-4 flex-shrink text-slate-500 text-xs uppercase tracking-widest">o unirse</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <form onSubmit={handleJoinSubmit} className="flex gap-2">
            <input name="code" type="text" placeholder="CÓDIGO" maxLength={4} className="w-full rounded-xl border-2 border-slate-700 bg-slate-900 px-4 py-3 text-center text-lg font-bold uppercase tracking-widest text-white placeholder-slate-600 focus:border-yellow-400 focus:outline-none transition-colors" required />
            <button type="submit" disabled={!!isLoading} className="rounded-xl bg-slate-800 border-2 border-slate-700 px-6 font-bold text-white transition-all hover:bg-slate-700 hover:border-slate-600 flex items-center justify-center min-w-[100px]">
              {isLoading === 'joining' ? <Loader2 className="animate-spin" /> : 'ENTRAR'}
            </button>
          </form>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-8">
          <a href="#" className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#009EE3]/10 hover:bg-[#009EE3]/20 text-[#009EE3] text-sm font-bold transition-all hover:scale-105 border border-[#009EE3]/30">
            <Coffee size={16} className="group-hover:animate-bounce" />
            Tirame unos pesos
            <Heart size={12} className="text-red-500 fill-red-500" />
          </a>
        </motion.div>
      </div>
    </main>
  )
}