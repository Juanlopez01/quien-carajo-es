// app/game/[code]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { CHARACTERS } from '@/lib/data/characters'
import GameUI from '@/components/game/GameUI'

interface PageProps {
    params: Promise<{ code: string }>
}

export default async function GamePage({ params }: PageProps) {
    const { code } = await params
    const supabase = await createClient()

    // 1. Obtener usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/')

    // 2. Buscar sala
    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .single()

    if (!room) notFound()

    // 3. Validar jugador
    const isPlayer1 = room.player_1_id === user.id
    const isPlayer2 = room.player_2_id === user.id

    if (!isPlayer1 && !isPlayer2) redirect('/')

    // 4. Preparar datos del tablero
    const boardIds = room.active_board as string[]
    const boardCharacters = boardIds.map(id =>
        CHARACTERS.find(c => c.id === id)
    ).filter(Boolean) as typeof CHARACTERS

    // 5. Mi personaje secreto
    const mySecretId = isPlayer1 ? room.player_1_secret_char : room.player_2_secret_char
    const mySecretCharacter = CHARACTERS.find(c => c.id === mySecretId)

    if (!mySecretCharacter) return <div>Error: Personaje no encontrado</div>

    return (
        <GameUI
            roomCode={code}
            roomId={room.id}        // <--- NUEVO
            userId={user.id}        // <--- NUEVO
            board={boardCharacters}
            mySecret={mySecretCharacter}
            initialStatus={room.status} // <--- NUEVO
        />
    )
}