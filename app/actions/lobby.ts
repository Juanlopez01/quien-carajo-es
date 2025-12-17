'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CHARACTERS } from '@/lib/data/characters'

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

// Función auxiliar para mezclar el array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array]
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr
}

export async function createRoom(mode: 'classic' | 'party' = 'classic', nickname: string = 'Anfitrión') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        const { error } = await supabase.auth.signInAnonymously()
        if (error) throw new Error('Error de autenticación')
    }

    const { data: { user: finalUser } } = await supabase.auth.getUser()
    if (!finalUser) throw new Error('Error crítico')

    const code = generateRoomCode()

    // --- LÓGICA DE 24 PERSONAJES ---

    // 1. Mezclamos todos los personajes disponibles
    const shuffledChars = shuffleArray(CHARACTERS)

    // 2. Seleccionamos solo los primeros 24 para el tablero
    // (Esto crea una grilla de 4x6 perfecta)
    const selectedBoard = shuffledChars.slice(0, 24)

    // 3. Extraemos los IDs para guardarlos en la base de datos
    const boardIds = selectedBoard.map(c => c.id)

    // 4. ELEGIMOS LOS SECRETOS *DENTRO* DE ESOS 24
    // Es fundamental elegir de 'selectedBoard' y no de 'CHARACTERS' globales,
    // si no, podrías tener un personaje secreto que no está en el tablero.
    const p1Secret = selectedBoard[Math.floor(Math.random() * selectedBoard.length)].id
    const p2Secret = selectedBoard[Math.floor(Math.random() * selectedBoard.length)].id

    // 5. Creamos la sala con ese tablero específico
    const { data: room, error } = await supabase
        .from('rooms')
        .insert({
            code,
            player_1_id: finalUser.id,
            player_1_secret_char: p1Secret,
            player_2_secret_char: p2Secret,
            active_board: boardIds, // <--- Acá guardamos los 24 elegidos
            current_turn: finalUser.id,
            mode: mode,
            round_status: 'lobby'
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    // Si es Modo Fiesta, agregamos al host a la lista de participantes
    if (mode === 'party') {
        await supabase.from('participants').insert({
            room_id: room.id,
            user_id: finalUser.id,
            is_host: true,
            nickname: nickname.trim() || 'Anfitrión'
        })
    }

    redirect(`/game/${code}`)
}

export async function enterRoom(code: string, nickname: string = 'Jugador') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const { data: room } = await supabase.from('rooms').select('*').eq('code', code).single()
    if (!room) return { error: 'Sala no encontrada' }

    if (room.mode === 'classic') {
        if (room.player_1_id === user.id || room.player_2_id === user.id) return { success: true }
        if (room.player_2_id) return { error: 'Sala llena' }

        await supabase.from('rooms').update({
            player_2_id: user.id,
            status: 'playing',
            current_turn: room.player_1_id
        }).eq('id', room.id)

        return { success: true }
    }

    if (room.mode === 'party') {
        const { data: existing } = await supabase.from('participants').select('*').eq('room_id', room.id).eq('user_id', user.id).single()

        if (existing) {
            await supabase.from('participants').update({ nickname: nickname }).eq('user_id', user.id).eq('room_id', room.id)
            return { success: true }
        }

        await supabase.from('participants').insert({
            room_id: room.id,
            user_id: user.id,
            is_host: false,
            nickname: nickname.trim() || 'Jugador'
        })

        return { success: true }
    }

    return { error: 'Modo desconocido' }
}

export async function getGamesCount() {
    const supabase = await createClient()
    const { count } = await supabase.from('rooms').select('*', { count: 'exact', head: true })
    return count || 0
}