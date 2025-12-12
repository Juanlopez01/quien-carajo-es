'use server'

import { createClient } from '@/lib/supabase/server'

// ACCIÓN 1: HACER LA PREGUNTA
export async function sendQuestion(roomId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Guardar la pregunta en el chat
    await supabase.from('messages').insert({
        room_id: roomId,
        sender_id: user.id,
        content: content,
        is_system_message: false
    })

    // 2. Cambiar fase a "answering" (esperando respuesta del rival)
    // NO cambiamos el turno todavía
    await supabase
        .from('rooms')
        .update({ turn_phase: 'answering' })
        .eq('id', roomId)
}

// ACCIÓN 2: RESPONDER SÍ/NO (Y CAMBIAR TURNO)
export async function sendAnswer(roomId: string, answer: 'SÍ' | 'NO') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Obtener datos de la sala para saber a quién le toca después
    const { data: room } = await supabase.from('rooms').select('*').eq('id', roomId).single()
    if (!room) return

    // 2. Guardar la respuesta en el chat (destacada)
    await supabase.from('messages').insert({
        room_id: roomId,
        sender_id: user.id,
        content: answer,
        is_system_message: false
    })

    // 3. Calcular quién sigue (el otro jugador)
    const nextPlayer = room.current_turn === room.player_1_id ? room.player_2_id : room.player_1_id

    // 4. Resetear fase a "asking" y CAMBIAR DE TURNO
    await supabase
        .from('rooms')
        .update({
            turn_phase: 'asking',
            current_turn: nextPlayer
        })
        .eq('id', roomId)
}

export async function guessCharacter(roomId: string, targetCharacterId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    // 1. Buscar la sala
    const { data: room } = await supabase.from('rooms').select('*').eq('id', roomId).single()
    if (!room) throw new Error('Sala no encontrada')

    // 2. Determinar quién es quién
    const isPlayer1 = room.player_1_id === user.id
    const opponentId = isPlayer1 ? room.player_2_id : room.player_1_id
    const opponentSecret = isPlayer1 ? room.player_2_secret_char : room.player_1_secret_char

    // 3. VALIDAR LA ACUSACIÓN
    if (targetCharacterId === opponentSecret) {
        // ¡GANASTE! 🎉
        await supabase
            .from('rooms')
            .update({
                status: 'finished',
                winner_id: user.id
            })
            .eq('id', roomId)

        return { result: 'WIN' }
    } else {
        // ¡FALLASTE! 💀
        // Si es modo Hardcore, perdés automáticamente.
        // (Asumimos Hardcore por defecto para el MVP)

        await supabase
            .from('rooms')
            .update({
                status: 'finished',
                winner_id: opponentId // Gana el otro por tu error
            })
            .eq('id', roomId)

        return { result: 'LOSE' }
    }
}