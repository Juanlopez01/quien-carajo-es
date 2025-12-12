'use client'

import { Character } from '@/lib/data/characters'
import Image from 'next/image'
import { X, AlertTriangle } from 'lucide-react'

interface Props {
    isOpen: boolean
    onClose: () => void
    onGuess: (charId: string) => void
    board: Character[]
}

export default function GuessModal({ isOpen, onClose, onGuess, board }: Props) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Contenedor Principal del Modal */}
            <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950 shrink-0">
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-widest">
                            ¿A quién acusás?
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Warning Banner */}
                <div className="bg-red-950/50 p-2 text-center text-xs md:text-sm text-red-300 font-bold uppercase border-b border-red-900/30 shrink-0">
                    ⚠️ Cuidado: Si fallás, perdés la partida.
                </div>

                {/* 👇👇👇 CAMBIOS CLAVE AQUÍ 👇👇👇
           - grid-cols-4 sm:grid-cols-5 md:grid-cols-6: Más columnas para que las fichas sean más chicas.
           - gap-4 sm:gap-5: Más espacio entre ellas para que no se toquen.
        */}
                <div className="overflow-y-auto p-5 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 sm:gap-5">
                    {board.map((char) => (
                        <button
                            key={char.id}
                            onClick={() => onGuess(char.id)}
                            // Mantenemos hover:z-10 para que no se superpongan al agrandarse
                            className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-800 hover:border-red-500 transition-all duration-200 hover:scale-105 hover:z-10 shadow-sm hover:shadow-xl hover:shadow-red-900/20"
                        >
                            {/* Fondo por si falla la imagen */}
                            <div className="absolute inset-0 bg-slate-800" />

                            <Image
                                src={char.image}
                                alt={char.name}
                                fill
                                className="object-cover transition-opacity group-hover:opacity-80 relative z-0"
                                sizes="(max-width: 768px) 25vw, 16vw"
                            />

                            {/* Gradiente y Texto (Achicado un poco el texto) */}
                            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/90 via-black/50 to-transparent p-1.5 z-10">
                                <span className="text-[8px] md:text-[10px] font-bold text-white uppercase text-center leading-tight group-hover:text-red-300">
                                    {char.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}