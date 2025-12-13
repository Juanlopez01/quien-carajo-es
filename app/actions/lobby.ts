// app/actions/lobby.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getRandomBoard } from '@/lib/data/characters'

// Generador de código simple (4 letras mayúsculas)
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Sin I, O, 0, 1 para evitar confusión
    let result = ''
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export async function createRoom() {
    const supabase = await createClient()

    // 1. Loguear anónimamente si no existe sesión
    let { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        const { data: authData, error } = await supabase.auth.signInAnonymously()
        if (error) throw new Error('Error al autenticar')
        user = authData.user
    }

    // 2. Preparar la sala
    const code = generateRoomCode()
    const board = getRandomBoard() // Elegimos los 24 para esta partida

    // Extraemos SOLO los IDs para guardarlos
    const boardIds = board.map(c => c.id)

    // 3. Elegir personajes secretos al azar de ESOS 24
    const p1Secret = board[Math.floor(Math.random() * board.length)].id
    const p2Secret = board[Math.floor(Math.random() * board.length)].id

    // 4. Insertar en DB
    const { data, error } = await supabase
        .from('rooms')
        .insert({
            code,
            player_1_id: user?.id,
            active_board: boardIds,
            player_1_secret_char: p1Secret,
            player_2_secret_char: p2Secret,
            status: 'waiting'
        })
        .select()
        .single()

    if (error) {
        console.error(error)
        throw new Error('Error al crear sala')
    }

    // 5. Redirigir al juego
    redirect(`/game/${code}`)
}

export async function joinRoom(formData: FormData) {
    const code = formData.get('code')?.toString().toUpperCase()
    if (!code) return

    const supabase = await createClient()

    // 1. Auth check
    let { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        const { data: authData } = await supabase.auth.signInAnonymously()
        user = authData.user
    }

    // 2. Buscar sala
    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .single()

    if (!room) throw new Error('Sala no encontrada')
    if (room.player_2_id) throw new Error('La sala está llena')
    if (room.player_1_id === user?.id) redirect(`/game/${code}`) // Ya sos el dueño

    // 3. Unirse como Player 2
    await supabase
        .from('rooms')
        .update({
            player_2_id: user?.id,
            status: 'playing', // ¡Arranca el juego!
            current_turn: room.player_1_id // Arranca siempre el que creó (simpleza)
        })
        .eq('id', room.id)

    redirect(`/game/${code}`)
}

export async function getGamesCount() {
    const supabase = await createClient()
    // count: 'exact' nos devuelve el número total sin traerse todos los datos (rápido y liviano)
    const { count } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true })

    return count || 0
}

export async function enterRoom(code: string) {
    const supabase = await createClient()

    // 1. Verificamos quién soy
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No estás autenticado')

    // 2. Buscamos la sala
    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .single()

    if (!room) return { error: 'Sala no encontrada' }

    // 3. Si ya soy Player 1 o Player 2, no hago nada (ya estoy adentro)
    if (room.player_1_id === user.id || room.player_2_id === user.id) {
        return { success: true }
    }

    // 4. Si la sala está llena, error
    if (room.player_2_id) return { error: 'La sala está llena' }

    // 5. Si hay lugar, me meto como Player 2
    await supabase
        .from('rooms')
        .update({
            player_2_id: user.id,
            status: 'playing',
            current_turn: room.player_1_id
        })
        .eq('id', room.id)

    return { success: true }
}