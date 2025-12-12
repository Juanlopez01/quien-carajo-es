// components/game/CharacterCard.tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Character } from '@/lib/data/characters'
import { clsx } from 'clsx'

interface Props {
    character: Character
    isDiscarded: boolean
    onClick: () => void
}

export default function CharacterCard({ character, isDiscarded, onClick }: Props) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={clsx(
                "relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300",
                // Estilos condicionales: Si está descartado, gris y opaco. Si no, borde amarillo activo.
                isDiscarded
                    ? "border-slate-700 bg-slate-800 grayscale opacity-60"
                    : "border-yellow-400 bg-slate-900 shadow-lg shadow-yellow-900/20"
            )}
        >
            {/* Imagen del Personaje */}
            <div className="relative h-4/5 w-full">
                {/* Placeholder mientras no tengas las fotos reales */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-xs text-slate-500">
                    Sin Foto
                </div>

                <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 15vw"
                    // Esto evita errores si la imagen no existe aún
                    onError={(e) => {
                        e.currentTarget.style.display = 'none'
                    }}
                />

                {/* Cruz roja si está descartado (Opcional, queda muy visual) */}
                {isDiscarded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-6xl font-bold text-red-600/80">❌</span>
                    </div>
                )}
            </div>

            {/* Nombre */}
            <div className="flex h-1/5 items-center justify-center bg-slate-950 p-1">
                <span className={clsx(
                    "text-center text-xs font-bold leading-tight uppercase sm:text-sm",
                    isDiscarded ? "text-slate-500 line-through" : "text-white"
                )}>
                    {character.name}
                </span>
            </div>
        </motion.div>
    )
}