'use client'

import Image from 'next/image'
import { Character } from '@/lib/data/characters'
import { clsx } from 'clsx'
import useSound from '@/hooks/useSound' // <--- 1. Importar

interface Props {
    character: Character
    isDiscarded: boolean
    onClick: () => void
}

export default function CharacterCard({ character, isDiscarded, onClick }: Props) {
    // 2. Inicializar el sonido de click (volumen 0.4 suave)
    const playClick = useSound('/click.wav', 0.4);

    return (
        <div
            onClick={() => {
                playClick(); // <--- 3. Reproducir al hacer click
                onClick();   // Ejecutar la lógica original
            }}
            className={clsx(
                "group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200 shadow-sm active:scale-95",
                isDiscarded
                    ? "border-slate-800 bg-slate-900 grayscale opacity-50 hover:opacity-70"
                    : "border-yellow-500/30 bg-slate-900 hover:border-yellow-400 hover:shadow-md hover:shadow-yellow-900/20 hover:-translate-y-0.5"
            )}
        >
            {/* Fondo por si falla la imagen */}
            <div className="absolute inset-0 bg-slate-800 animate-pulse" />

            <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 relative z-0"
                sizes="(max-width: 768px) 33vw, 20vw"
                priority={character.id === 'messi' || character.id === 'maradona'}
            />

            {/* Gradiente y Nombre */}
            <div className={clsx(
                "absolute inset-0 flex items-end justify-center p-1.5 z-10 transition-colors",
                isDiscarded ? "bg-black/60" : "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            )}>
                <span className={clsx(
                    "text-[9px] md:text-[11px] font-bold uppercase text-center leading-tight truncate w-full",
                    isDiscarded ? "text-slate-400 line-through decoration-2" : "text-white group-hover:text-yellow-300"
                )}>
                    {character.name}
                </span>
            </div>

            {/* Cruz Roja (Opcional) */}
            {isDiscarded && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl opacity-40 text-red-600 select-none">❌</span>
                </div>
            )}
        </div>
    )
}