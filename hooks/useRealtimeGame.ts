// hooks/useRealtimeGame.ts
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Definimos los tipos para que TypeScript no se queje
export type GameStatus = 'waiting' | 'playing' | 'finished'
export type TurnPhase = 'asking' | 'answering'

interface Message {
    id: number
    content: string
    sender_id: string
    created_at: string
    is_system_message: boolean
}

interface UseRealtimeGameReturn {
    status: GameStatus
    currentTurn: string | null
    turnPhase: TurnPhase
    messages: Message[]
    winnerId: string | null
}

export function useRealtimeGame(roomId: string, initialStatus: GameStatus): UseRealtimeGameReturn {
    const supabase = createClient()
    const router = useRouter()

    // Estado local
    const [status, setStatus] = useState<GameStatus>(initialStatus)
    const [currentTurn, setCurrentTurn] = useState<string | null>(null)
    const [turnPhase, setTurnPhase] = useState<TurnPhase>('asking') // <--- ESTE ES EL IMPORTANTE
    const [messages, setMessages] = useState<Message[]>([])
    const [winnerId, setWinnerId] = useState<string | null>(null)

    useEffect(() => {
        // 1. Cargar estado inicial y mensajes
        const fetchRoomData = async () => {
            // Cargar mensajes viejos
            const { data: msgs } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', roomId)
                .order('created_at', { ascending: true })

            if (msgs) setMessages(msgs)

            // Cargar estado de la sala
            const { data: room } = await supabase
                .from('rooms')
                .select('status, current_turn, winner_id, turn_phase')
                .eq('id', roomId)
                .single()

            if (room) {
                setStatus(room.status)
                setCurrentTurn(room.current_turn)
                setWinnerId(room.winner_id)
                // Si la DB tiene null o algo raro, por defecto es 'asking'
                setTurnPhase(room.turn_phase || 'asking')
            }
        }

        fetchRoomData()

        // 2. Suscripción a Realtime
        const channel = supabase
            .channel(`room:${roomId}`)
            // Escuchar cambios en la SALA (Turnos, Fases, Jugadores)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
                (payload) => {
                    const newRoom = payload.new as any
                    setStatus(newRoom.status)
                    setCurrentTurn(newRoom.current_turn)
                    setWinnerId(newRoom.winner_id)
                    setTurnPhase(newRoom.turn_phase || 'asking') // Actualizamos la fase en vivo

                    router.refresh()
                }
            )
            // Escuchar nuevos MENSAJES
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
                (payload) => {
                    const newMsg = payload.new as Message
                    setMessages((prev) => [...prev, newMsg])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, supabase, router])

    // 3. RETORNO (Acá estaba faltando exportarlo bien antes)
    return {
        status,
        currentTurn,
        turnPhase,
        messages,
        winnerId
    }
}