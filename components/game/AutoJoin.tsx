'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { enterRoom } from '@/app/actions/lobby'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AutoJoin({ code }: { code: string }) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleJoin = async () => {
            const supabase = createClient()

            // 1. Intentar loguear anónimamente (si ya está logueado, no pasa nada)
            const { error: authError } = await supabase.auth.signInAnonymously()
            if (authError) {
                setError('Error al iniciar sesión')
                return
            }

            // 2. Ejecutar la acción de servidor para meterse en la DB
            const res = await enterRoom(code)

            if (res?.error) {
                setError(res.error)
            } else {
                // 3. Si salió todo bien, recargamos la página para que el servidor nos deje pasar
                router.refresh()
            }
        }

        handleJoin()
    }, [code, router])

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-slate-950 text-white gap-4">
                <h1 className="text-3xl font-black text-red-500">UPS...</h1>
                <p className="text-slate-400">{error}</p>
                <a href="/" className="px-4 py-2 bg-slate-800 rounded-lg">Volver al Inicio</a>
            </div>
        )
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-950 text-white gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
            <p className="text-lg font-bold animate-pulse">Uniéndose a la sala {code}...</p>
        </div>
    )
}