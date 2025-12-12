'use client'

import { createRoom, joinRoom, getGamesCount } from '@/app/actions/lobby' // <--- Importamos getGamesCount
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Coffee, Gamepad2, Heart } from 'lucide-react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [totalGames, setTotalGames] = useState<number | null>(null)

  // Cargamos el contador al entrar
  useEffect(() => {
    getGamesCount().then(count => setTotalGames(count))
  }, [])

  const handleCreate = async () => {
    setIsLoading(true)
    await createRoom()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-white relative overflow-hidden">

      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md space-y-8 text-center z-10">

        {/* TÍTULO */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-2"
        >
          <h1 className="text-5xl md:text-6xl font-black text-yellow-400 uppercase tracking-tighter drop-shadow-xl">
            ¿Quién<br />Carajo<br />Es?
          </h1>
          <p className="text-slate-400 font-medium">Edición Cultura Argentina 🇦🇷</p>

          {/* CONTADOR DE PARTIDAS (EL "CORTADOR" CHIQUITO) */}
          {totalGames !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs text-slate-400 mt-2"
            >
              <Gamepad2 size={12} className="text-yellow-500" />
              <span><span className="font-bold text-white">{totalGames}</span> partidas jugadas</span>
            </motion.div>
          )}
        </motion.div>

        {/* BOTONES PRINCIPALES */}
        <div className="space-y-4">
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="w-full rounded-xl bg-yellow-400 py-4 text-xl font-bold text-black shadow-[0_4px_0_0_rgba(161,98,7,1)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgba(161,98,7,1)] active:translate-y-1 active:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><Loader2 className="animate-spin" /> Creando...</>
            ) : (
              "CREAR SALA NUEVA"
            )}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="mx-4 flex-shrink text-slate-500 text-xs uppercase tracking-widest">o unite a una</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <form action={joinRoom} className="flex gap-2">
            <input
              name="code"
              type="text"
              placeholder="CÓDIGO (ej: ABCD)"
              maxLength={4}
              className="w-full rounded-xl border-2 border-slate-700 bg-slate-900 px-4 py-3 text-center text-lg font-bold uppercase tracking-widest text-white placeholder-slate-600 focus:border-yellow-400 focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-800 border-2 border-slate-700 px-6 font-bold text-white transition-all hover:bg-slate-700 hover:border-slate-600"
            >
              ENTRAR
            </button>
          </form>
        </div>

        {/* BOTÓN DE DONACIÓN (MERCADOPAGO) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-8"
        >
          <a
            href="https://mpago.la/1c94NDG" // <--- ⚠️ PONÉ TU LINK ACÁ
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#009EE3]/10 hover:bg-[#009EE3]/20 text-[#009EE3] text-sm font-bold transition-all hover:scale-105 border border-[#009EE3]/30"
          >
            <Coffee size={16} className="group-hover:animate-bounce" />
            Tirame unos pesos (MercadoPago)
            <Heart size={12} className="text-red-500 fill-red-500" />
          </a>
          <p className="text-[10px] text-slate-600 mt-2 max-w-xs mx-auto">
            El server no se paga solo, máquina. Si te gustó, ayudame a mantenerlo vivo.
          </p>
        </motion.div>

      </div>

      {/* Footer Chiquito */}
      <footer className="absolute bottom-4 text-center text-[10px] text-slate-700">
        Hecho con odio y Next.js
      </footer>
    </main>
  )
}