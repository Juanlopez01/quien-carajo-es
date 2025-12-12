// app/page.tsx
'use client'

import { createRoom, joinRoom } from '@/app/actions/lobby'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    setIsLoading(true)
    // Server action
    await createRoom()
    // No ponemos setIsLoading(false) porque hace redirect y desmonta
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-white">
      <div className="w-full max-w-md space-y-8 text-center">

        {/* TÍTULO CON ONDA */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-2"
        >
          <h1 className="text-5xl font-black text-yellow-400 uppercase tracking-tighter drop-shadow-xl">
            ¿Quién<br />Carajo<br />Es?
          </h1>
          <p className="text-slate-400">Edición Cultura Argentina 🇦🇷</p>
        </motion.div>

        {/* BOTONES DE ACCIÓN */}
        <div className="space-y-4">

          {/* CREAR SALA */}
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="w-full rounded-xl bg-yellow-400 py-4 text-xl font-bold text-black shadow-[0_4px_0_0_rgba(161,98,7,1)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgba(161,98,7,1)] active:translate-y-1 active:shadow-none disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> Creando...
              </span>
            ) : (
              "CREAR SALA NUEVA"
            )}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="mx-4 flex-shrink text-slate-500 text-sm">O UNITE A UNA</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          {/* FORM PARA UNIRSE */}
          <form action={joinRoom} className="flex gap-2">
            <input
              name="code"
              type="text"
              placeholder="CÓDIGO (ej: ABCD)"
              maxLength={4}
              className="w-full rounded-xl border-2 border-slate-700 bg-slate-900 px-4 py-3 text-center text-lg font-bold uppercase tracking-widest text-white placeholder-slate-600 focus:border-yellow-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-700 px-6 font-bold text-white transition-colors hover:bg-slate-600"
            >
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}