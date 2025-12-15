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

// AHORA RECIBE NICKNAME
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
    const p1Secret = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id
    const p2Secret = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id
    const boardIds = CHARACTERS.map(c => c.id)

    // Crear Room
    const { data: room, error } = await supabase
        .from('rooms')
        .insert({
            code,
            player_1_id: finalUser.id,
            player_1_secret_char: p1Secret,
            player_2_secret_char: p2Secret,
            active_board: boardIds,
            current_turn: finalUser.id,
            mode: mode,
            round_status: 'lobby'
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    // Si es PARTY, agregamos al creador con su NOMBRE
    if (mode === 'party') {
        await supabase.from('participants').insert({
            room_id: room.id,
            user_id: finalUser.id,
            is_host: true,
            nickname: nickname.trim() || 'Anfitrión' // <--- GUARDAMOS EL NOMBRE
        })
    }

    redirect(`/game/${code}`)
}

// AHORA RECIBE NICKNAME TAMBIÉN
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
            // Si ya existe, actualizamos el nombre por si lo cambió
            await supabase.from('participants').update({ nickname: nickname }).eq('user_id', user.id).eq('room_id', room.id)
            return { success: true }
        }

        await supabase.from('participants').insert({
            room_id: room.id,
            user_id: user.id,
            is_host: false,
            nickname: nickname.trim() || 'Jugador' // <--- GUARDAMOS EL NOMBRE
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