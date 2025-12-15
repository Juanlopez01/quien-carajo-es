import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CHARACTERS } from '@/lib/data/characters'
import GameUI from '@/components/game/GameUI'
import PartyGameUI from '@/components/game/PartyGameUI' // <--- Importamos
import AutoJoin from '@/components/game/AutoJoin'

interface PageProps {
    params: Promise<{ code: string }>
}

export default async function GamePage({ params }: PageProps) {
    const { code } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return <AutoJoin code={code} />

    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .single()

    if (!room) notFound()

    // --- LÓGICA DE DISTRIBUCIÓN ---

    // CASO 1: MODO FIESTA (Nuevo)
    if (room.mode === 'party') {
        // Buscar participantes para inicializar
        const { data: participants } = await supabase.from('participants').select('*').eq('room_id', room.id)

        // Si no estoy en la lista, AutoJoin me mete
        const amIParticipant = participants?.some(p => p.user_id === user.id)
        if (!amIParticipant) return <AutoJoin code={code} />

        return (
            <PartyGameUI
                roomId={room.id}
                roomCode={code}
                userId={user.id}
                initialParticipants={participants || []}
            />
        )
    }

    // CASO 2: MODO CLÁSICO (Legacy 1v1)
    const isPlayer1 = room.player_1_id === user.id
    const isPlayer2 = room.player_2_id === user.id

    if (!isPlayer1 && !isPlayer2) return <AutoJoin code={code} />

    const boardIds = room.active_board as string[]
    const boardCharacters = boardIds.map(id => CHARACTERS.find(c => c.id === id)).filter(Boolean) as typeof CHARACTERS
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