// hooks/useSound.ts
'use client'

import { useCallback, useEffect, useRef } from 'react'

export default function useSound(soundPath: string, volume: number = 1) {
    // Usamos useRef para mantener el objeto Audio entre renderizados sin recrearlo
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Solo instanciamos Audio en el cliente (navegador)
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio(soundPath);
            audioRef.current.volume = volume;
            // Precargamos para que suene instantáneo
            audioRef.current.load();
        }
    }, [soundPath, volume]);

    const play = useCallback(() => {
        // Si el audio existe...
        if (audioRef.current) {
            // Reseteamos el tiempo a 0 para poder tocarlo varias veces seguidas rápido
            audioRef.current.currentTime = 0;
            // Le damos play (con un catch por si el navegador bloquea el autoplay)
            audioRef.current.play().catch((e) => console.error("No se pudo reproducir sonido:", e));
        }
    }, []);

    return play;
}