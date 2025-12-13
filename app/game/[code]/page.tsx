import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { CHARACTERS } from '@/lib/data/characters'
import GameUI from '@/components/game/GameUI'
import AutoJoin from '@/components/game/AutoJoin' // <--- IMPORTAR ESTO

interface PageProps {
    params: Promise<{ code: string }>
}

export default async function GamePage({ params }: PageProps) {
    const { code } = await params
    const supabase = await createClient()

    // 1. Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()

    // --- CAMBIO CLAVE AQUÍ ---
    // Si NO hay usuario, en vez de echarlo, mostramos la pantalla de "AutoJoin"
    // que se encarga de loguearlo y meterlo.
    if (!user) {
        return <AutoJoin code={code} />
    }
    // -------------------------

    // 2. Buscar la sala
    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .single()

    if (!room) notFound()

    // 3. Validar si el usuario PERTENECE a la sala
    const isPlayer1 = room.player_1_id === user.id
    const isPlayer2 = room.player_2_id === user.id

    // --- SEGUNDO CAMBIO CLAVE ---
    // Si tengo usuario pero NO soy ni player 1 ni 2 (soy un tercero intentando entrar),
    // también mostramos AutoJoin para ver si hay lugar y me mete como Player 2.
    if (!isPlayer1 && !isPlayer2) {
        return <AutoJoin code={code} />
    }
    // ----------------------------

    // 4. Preparar datos del tablero (Resto igual que antes)
    const boardIds = room.active_board as string[]
    const boardCharacters = boardIds.map(id =>
        CHARACTERS.find(c => c.id === id)
    ).filter(Boolean) as typeof CHARACTERS

    const mySecretId = isPlayer1 ? room.player_1_secret_char : room.player_2_secret_char
    const mySecretCharacter = CHARACTERS.find(c => c.id === mySecretId)

    if (!mySecretCharacter) return <div>Error: Personaje no encontrado</div>

    return (
        <GameUI
            roomCode={code}
            roomId={room.id}
            userId={user.id}
            board={boardCharacters}
            mySecret={mySecretCharacter}
            initialStatus={room.status}
        />
    )
}