'use client'

import { Character } from '@/lib/data/characters'
import Image from 'next/image'
import { X } from 'lucide-react'

interface Props {
    isOpen: boolean
    onClose: () => void
    onGuess: (charId: string) => void
    board: Character[] // Pasamos el tablero para mostrar solo los disponibles
}

export default function GuessModal({ isOpen, onClose, onGuess, board }: Props) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header Modal */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
                    <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">
                        ¿A quién acusás?
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Warning */}
                <div className="bg-red-900/20 p-3 text-center text-xs text-red-400 font-bold uppercase border-b border-red-900/30">
                    ⚠️ Si fallás, perdés la partida automáticamente.
                </div>

                {/* Grid de Personajes */}
                <div className="overflow-y-auto p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {board.map((char) => (
                        <button
                            key={char.id}
                            onClick={() => onGuess(char.id)}
                            className="group relative aspect-[3/4] overflow-hidden rounded-lg border-2 border-slate-700 hover:border-red-500 transition-all hover:scale-105"
                        >
                            <Image src={char.image} alt={char.name} fill className="object-cover" />
                            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 to-transparent p-2">
                                <span className="text-[10px] font-bold text-white uppercase text-center leading-none group-hover:text-red-400">
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