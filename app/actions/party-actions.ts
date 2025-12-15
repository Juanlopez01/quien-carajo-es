'use server'
import { createClient } from '@/lib/supabase/server'
import { CHARACTERS } from '@/lib/data/characters'

function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array]
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr
}

export async function startPartyRound(roomId: string) {
    const supabase = await createClient()

    // 1. Buscamos participantes
    const { data: participants } = await supabase.from('participants').select('*').eq('room_id', roomId)
    if (!participants || participants.length < 2) throw new Error('Necesitan ser al menos 2 para jugar')

    // 2. FILTRAR: ¿Quién NO fue Rey todavía?
    const eligibleKings = participants.filter(p => !p.has_been_king)

    // --- CASO A: YA FUERON TODOS REY -> FIN DEL JUEGO ---
    if (eligibleKings.length === 0) {
        await supabase.from('rooms').update({ round_status: 'ended' }).eq('id', roomId)
        return
    }

    // --- CASO B: SIGUE EL JUEGO ---

    // Elegimos Rey de los que faltan
    const randomUser = eligibleKings[Math.floor(Math.random() * eligibleKings.length)]

    // Marcamos que YA fue rey
    await supabase.from('participants').update({ has_been_king: true, is_eliminated: false }).eq('user_id', randomUser.user_id).eq('room_id', roomId)

    // Revivimos al resto también (para que adivinen)
    await supabase.from('participants').update({ is_eliminated: false }).eq('room_id', roomId)

    // Selección de 30 personajes
    const shuffledChars = shuffleArray(CHARACTERS)
    const selectedBoard = shuffledChars.slice(0, 30)
    const randomChar = selectedBoard[Math.floor(Math.random() * selectedBoard.length)]

    // Actualizamos sala
    await supabase
        .from('rooms')
        .update({
            round_status: 'playing',
            secret_holder_id: randomUser.user_id,
            party_secret_char: randomChar.id,
            active_board: selectedBoard.map(c => c.id)
        })
        .eq('id', roomId)
}

// ... (guessParty y sendPartyMessage quedan IGUAL que antes, no hace falta tocarlos) ...
// (Asegurate de mantenerlos en el archivo o copiar el archivo anterior y solo cambiar startPartyRound)
// Pero para que no te confundas, acá te dejo guessParty y sendPartyMessage resumidos:

export async function guessParty(roomId: string, userId: string, charId: string) {
    const supabase = await createClient()
    const { data: room } = await supabase.from('rooms').select('party_secret_char, secret_holder_id').eq('id', roomId).single()
    if (!room) return { error: 'Sala no encontrada' }

    if (room.party_secret_char === charId) {
        const { data: p } = await supabase.from('participants').select('score').eq('user_id', userId).eq('room_id', roomId).single()
        await supabase.from('participants').update({ score: (p?.score || 0) + 1 }).eq('user_id', userId).eq('room_id', roomId)
        await supabase.from('rooms').update({ round_status: 'finished', current_turn: userId }).eq('id', roomId)
        return { result: 'WIN' }
    } else {
        await supabase.from('participants').update({ is_eliminated: true }).eq('user_id', userId).eq('room_id', roomId)
        const { count } = await supabase.from('participants').select('*', { count: 'exact', head: true }).eq('room_id', roomId).eq('is_eliminated', false)

        if (count === 1 && room.secret_holder_id) {
            // Gana el Rey
            const { data: k } = await supabase.from('participants').select('score').eq('user_id', room.secret_holder_id).eq('room_id', roomId).single()
            await supabase.from('participants').update({ score: (k?.score || 0) + 1 }).eq('user_id', room.secret_holder_id).eq('room_id', roomId)
            await supabase.from('rooms').update({ round_status: 'finished', current_turn: room.secret_holder_id }).eq('id', roomId)
            return { result: 'KING_WINS' }
        }
        return { result: 'ELIMINATED' }
    }
}

export async function sendPartyMessage(roomId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: p } = await supabase.from('participants').select('is_eliminated').eq('room_id', roomId).eq('user_id', user.id).single()
    if (p?.is_eliminated) return
    await supabase.from('messages').insert({ room_id: roomId, sender_id: user.id, content: content })
}

// --- NUEVO: REINICIAR PARTIDA (REVANCHA) ---
export async function restartPartyGame(roomId: string) {
    const supabase = await createClient()
    // 1. Resetear participantes (score 0, has_been_king false, is_eliminated false)
    await supabase.from('participants').update({ score: 0, has_been_king: false, is_eliminated: false }).eq('room_id', roomId)
    // 2. Resetear sala a Lobby
    await supabase.from('rooms').update({ round_status: 'lobby', secret_holder_id: null }).eq('id', roomId)
}

// DESEMPATAR (RULETA RUSA)
export async function spinRoulette(roomId: string) {
    const supabase = await createClient()

    // 1. Buscamos a todos los participantes y sus puntajes
    const { data: participants } = await supabase.from('participants').select('*').eq('room_id', roomId)
    if (!participants) return

    // 2. Encontramos el puntaje máximo
    const maxScore = Math.max(...participants.map(p => p.score))

    // 3. Filtramos a los campeones (los empatados)
    const champions = participants.filter(p => p.score === maxScore)

    // 4. Elegimos UNO al azar
    const luckyWinner = champions[Math.floor(Math.random() * champions.length)]

    // 5. Guardamos al ganador en la sala (esto dispara el evento Realtime en el front)
    await supabase
        .from('rooms')
        .update({ final_winner_id: luckyWinner.user_id })
        .eq('id', roomId)
}