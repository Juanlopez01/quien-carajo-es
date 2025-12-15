'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CHARACTERS } from '@/lib/data/characters'
import CharacterCard from '@/components/game/CharacterCard'
import { startPartyRound, guessParty, sendPartyMessage, restartPartyGame, spinRoulette } from '@/app/actions/party-actions'
import { Crown, Play, Trophy, Loader2, Send, MessageCircle, ListOrdered, ThumbsUp, ThumbsDown, Skull, Medal, Dices } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import useSound from '@/hooks/useSound'

interface Participant {
    user_id: string
    score: number
    is_host: boolean
    is_eliminated: boolean
    has_been_king: boolean
    nickname: string
}

interface Message {
    id: string
    sender_id: string
    content: string
    created_at: string
}

interface Props {
    roomId: string
    roomCode: string
    userId: string
    initialParticipants: Participant[]
}

export default function PartyGameUI({ roomId, roomCode, userId, initialParticipants }: Props) {
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
    const [messages, setMessages] = useState<Message[]>([])
    const [roomState, setRoomState] = useState<any>(null)
    const [discardedIds, setDiscardedIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [msgInput, setMsgInput] = useState('')
    const [activeTab, setActiveTab] = useState<'chat' | 'ranking'>('chat')

    // Estados para la Ruleta
    const [isSpinning, setIsSpinning] = useState(false)
    const [rouletteDisplay, setRouletteDisplay] = useState('???')

    const chatEndRef = useRef<HTMLDivElement>(null)

    // Sonidos
    const playWin = useSound('/sounds/win.mp3')
    const playLose = useSound('/sounds/lose.mp3')
    const playStart = useSound('/sounds/turn.mp3')
    const playMsg = useSound('/sounds/click.mp3', 0.2)

    const supabase = createClient()

    // 1. Escuchar ROOM y CHAT
    useEffect(() => {
        supabase.from('rooms').select('*').eq('id', roomId).single().then(({ data }) => setRoomState(data))
        supabase.from('messages').select('*').eq('room_id', roomId).order('created_at', { ascending: true }).then(({ data }) => {
            if (data) setMessages(data)
        })

        const channel = supabase.channel('party_room_all')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, (payload) => {
                setRoomState(payload.new)

                // Efectos según estado
                if (payload.new.round_status === 'playing') {
                    setDiscardedIds([])
                    playStart()
                }
                if (payload.new.round_status === 'finished') {
                    playWin()
                    confetti()
                }
                if (payload.new.round_status === 'ended') {
                    playWin()
                    // Lluvia masiva de confeti inicial
                    const duration = 3000
                    const end = Date.now() + duration
                    const frame = () => {
                        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } })
                        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } })
                        if (Date.now() < end) requestAnimationFrame(frame)
                    }
                    frame()
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message])
                playMsg()
                setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [roomId])

    // 2. Escuchar PARTICIPANTES
    useEffect(() => {
        const channel = supabase.channel('party_participants')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` }, () => {
                supabase.from('participants').select('*').eq('room_id', roomId).then(({ data }) => {
                    if (data) setParticipants(data)
                })
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [roomId])

    // 3. Escuchar RULETA (Ganador Definitivo)
    useEffect(() => {
        if (roomState?.final_winner_id && !isSpinning && roomState.round_status === 'ended') {
            triggerRouletteAnimation(roomState.final_winner_id)
        }
    }, [roomState?.final_winner_id])

    // --- ACTIONS ---

    const handleStart = async () => {
        setIsLoading(true)
        await startPartyRound(roomId)
        setIsLoading(false)
    }

    const toggleDiscard = (id: string) => {
        setDiscardedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    const attemptGuess = async (charId: string) => {
        if (confirm(`⚠️ CUIDADO: Si fallás quedás ELIMINADO de la ronda.\n\n¿Estás seguro que es ${CHARACTERS.find(c => c.id === charId)?.name}?`)) {
            const res = await guessParty(roomId, userId, charId)
            if (res?.result === 'ELIMINATED') {
                playLose()
            }
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!msgInput.trim()) return
        const txt = msgInput
        setMsgInput('')
        await sendPartyMessage(roomId, txt)
    }

    const sendQuickResponse = async (text: 'SÍ' | 'NO') => {
        await sendPartyMessage(roomId, text)
    }

    // --- LOGICA DE RULETA VISUAL ---
    const triggerRouletteAnimation = (winnerId: string) => {
        setIsSpinning(true)
        const winnerName = participants.find(p => p.user_id === winnerId)?.nickname || 'Ganador'

        // Candidatos (los que tengan el puntaje más alto)
        const maxScore = Math.max(...participants.map(x => x.score))
        const candidates = participants.filter(p => p.score === maxScore).map(p => p.nickname)
        // Si por alguna razón no hay candidatos (raro), usamos todos
        const pool = candidates.length > 0 ? candidates : participants.map(p => p.nickname)

        let speed = 50
        let counter = 0
        const cycles = 40 // Cuánto dura girando

        const spin = () => {
            setRouletteDisplay(pool[counter % pool.length] || '...')
            playMsg()
            counter++

            if (counter < cycles) {
                setTimeout(spin, speed)
                speed += 5 // Efecto de frenado
            } else {
                setRouletteDisplay(winnerName)
                playWin()
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } })
                // Esperamos un poco y mostramos el podio final estático
                setTimeout(() => setIsSpinning(false), 3000)
            }
        }
        spin()
    }

    // --- RENDER HELPERS ---

    if (!roomState) return <div className="flex h-screen items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin" /></div>

    const isHost = participants.find(p => p.user_id === userId)?.is_host
    const me = participants.find(p => p.user_id === userId)
    const amIEliminated = me?.is_eliminated
    const amITheKing = roomState.secret_holder_id === userId
    const winner = participants.find(p => p.user_id === roomState.current_turn)

    const activeBoardIds = roomState.active_board as string[] || []
    const currentBoard = activeBoardIds.length > 0
        ? activeBoardIds.map(id => CHARACTERS.find(c => c.id === id)).filter(Boolean) as typeof CHARACTERS
        : CHARACTERS

    const secretChar = CHARACTERS.find(c => c.id === roomState.party_secret_char)
    const sortedParticipants = [...participants].sort((a, b) => b.score - a.score)

    // -- COMPONENTES INTERNOS --

    const renderLeaderboard = () => (
        <div className="flex flex-col gap-2 p-4 h-full overflow-y-auto">
            <h3 className="text-yellow-400 font-bold uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
                <Trophy size={16} /> Ranking
            </h3>
            {sortedParticipants.map((p, i) => (
                <div key={p.user_id} className={`flex items-center justify-between p-2 rounded-lg ${p.user_id === userId ? 'bg-slate-800 border border-slate-700' : 'bg-slate-900/50'} ${p.is_eliminated ? 'opacity-50 grayscale' : ''}`}>
                    <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-black' : 'bg-slate-700 text-slate-400'}`}>
                            {i + 1}
                        </span>
                        <div className="flex flex-col leading-none">
                            <span className={`text-sm ${p.user_id === userId ? 'text-white font-bold' : 'text-slate-300'} ${p.is_eliminated ? 'line-through decoration-red-500' : ''}`}>
                                {p.nickname || 'Jugador'}
                            </span>
                            {p.user_id === userId && <span className="text-[10px] text-slate-500">(Vos)</span>}
                        </div>
                        {p.is_host && <Crown size={12} className="text-yellow-500" />}
                        {p.user_id === roomState.secret_holder_id && <span className="text-[10px] bg-purple-600 px-1 rounded text-white">REY</span>}
                        {p.is_eliminated && <Skull size={14} className="text-red-500 animate-pulse" />}
                    </div>
                    <span className="font-bold text-yellow-500">{p.score} pts</span>
                </div>
            ))}
        </div>
    )

    const renderChat = () => (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map(m => {
                    const isMe = m.sender_id === userId
                    const sender = participants.find(p => p.user_id === m.sender_id)
                    const isSenderKing = m.sender_id === roomState.secret_holder_id
                    const isSenderDead = sender?.is_eliminated

                    return (
                        <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[9px] text-slate-500 px-1 mb-0.5 flex items-center gap-1">
                                {sender?.nickname || 'Jugador'}
                                {isSenderKing && <Crown size={10} className="text-purple-400" />}
                                {isSenderDead && <Skull size={10} className="text-red-500" />}
                            </span>
                            <div className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs shadow-sm 
                 ${isSenderKing
                                    ? (m.content === 'SÍ' ? 'bg-green-600 text-white font-black text-lg' : m.content === 'NO' ? 'bg-red-600 text-white font-black text-lg' : 'bg-purple-600 text-white font-bold')
                                    : isMe ? 'bg-yellow-500 text-black font-medium' : 'bg-slate-700 text-slate-200'
                                } ${isSenderDead ? 'opacity-70 italic' : ''}`}>
                                {m.content}
                            </div>
                        </div>
                    )
                })}
                <div ref={chatEndRef} />
            </div>

            <div className="p-2 border-t border-slate-800 bg-slate-900">
                {amITheKing ? (
                    <div className="flex gap-2 h-10">
                        <button onClick={() => sendQuickResponse('SÍ')} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-black rounded flex items-center justify-center gap-2 transition-colors"><ThumbsUp size={16} /> SÍ</button>
                        <button onClick={() => sendQuickResponse('NO')} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black rounded flex items-center justify-center gap-2 transition-colors"><ThumbsDown size={16} /> NO</button>
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input disabled={amIEliminated} className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:border-yellow-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed" placeholder={amIEliminated ? "Estás eliminado (Solo lectura) 😶" : "Preguntale al Rey..."} value={msgInput} onChange={e => setMsgInput(e.target.value)} />
                        <button type="submit" disabled={amIEliminated} className="bg-slate-800 text-yellow-400 p-2 rounded hover:bg-slate-700 disabled:opacity-50"><Send size={16} /></button>
                    </form>
                )}
            </div>
        </div>
    )

    // ============================================
    // VISTA 1: FIN DEL JUEGO (PODIUM / RULETA)
    // ============================================
    if (roomState.round_status === 'ended') {
        // Si está girando la ruleta, mostramos SOLO la ruleta
        if (isSpinning) {
            return (
                <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
                    <h2 className="text-yellow-500 font-bold tracking-widest animate-pulse mb-8">DESEMPATANDO...</h2>
                    <div className="text-4xl md:text-8xl font-black text-white bg-slate-900 px-8 py-12 rounded-2xl border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)] w-full max-w-2xl break-words">
                        {rouletteDisplay}
                    </div>
                </div>
            )
        }

        const winners = [...participants].sort((a, b) => b.score - a.score)
        const topScore = winners[0]?.score || 0
        // Filtramos campeones por puntaje
        const champions = winners.filter(p => p.score === topScore)
        const isTie = champions.length > 1

        // Verificamos si ya hay un "Ganador Definitivo" (Ruleta)
        const ultimateWinnerId = roomState.final_winner_id
        const ultimateWinner = participants.find(p => p.user_id === ultimateWinnerId)

        return (
            <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center text-center overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/20 blur-[100px] rounded-full animate-pulse"></div>
                </div>

                <Link href="/">
                    <h1 className="text-4xl font-black text-yellow-400 mb-4 cursor-pointer hover:scale-105 transition-transform relative z-10">FIN DEL JUEGO 🏁</h1>
                </Link>

                {/* EMPATE DETECTADO (Sin resolver aún) */}
                {isTie && !ultimateWinner && (
                    <div className="bg-slate-900 p-6 rounded-xl border-2 border-orange-500 mb-8 animate-bounce relative z-10 max-w-md w-full">
                        <p className="text-2xl font-black text-orange-500 uppercase mb-2">¡EMPATE MORTAL!</p>
                        <p className="text-slate-400 text-sm mb-4">Hay {champions.length} jugadores con {topScore} puntos.</p>

                        {isHost ? (
                            <button
                                onClick={() => spinRoulette(roomId)}
                                className="bg-orange-600 hover:bg-orange-500 text-white font-black px-8 py-4 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.5)] flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95 w-full md:w-auto"
                            >
                                <Dices size={24} /> GIRAR RULETA DE LA MUERTE
                            </button>
                        ) : (
                            <p className="text-orange-300 font-bold animate-pulse">Esperando que el Host gire la ruleta...</p>
                        )}
                    </div>
                )}

                {/* PODIO FINAL (Si no hay empate O si ya se resolvió) */}
                {(!isTie || ultimateWinner) && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-500 mb-12 relative z-10">
                        <Crown size={60} className="text-yellow-400 mb-4 animate-bounce drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />

                        <div className="text-yellow-400 font-bold tracking-widest mb-2">CAMPEÓN SUPREMO</div>

                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-1 rounded-full shadow-[0_0_40px_rgba(234,179,8,0.6)]">
                            <div className="w-32 h-32 rounded-full bg-slate-950 flex items-center justify-center border-4 border-yellow-200 p-2">
                                <span className="text-xl font-black text-white break-words leading-tight">
                                    {ultimateWinner ? ultimateWinner.nickname : winners[0].nickname}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 bg-slate-800 px-6 py-2 rounded-full font-black text-yellow-500 border border-slate-700">
                            {ultimateWinner ? ultimateWinner.score : winners[0].score} PUNTOS
                        </div>
                    </div>
                )}

                {/* Tabla completa */}
                <div className="w-full max-w-md bg-slate-900/80 p-4 rounded-xl border border-slate-800 mb-8 max-h-40 overflow-y-auto relative z-10">
                    {winners.map((p, i) => (
                        <div key={p.user_id} className={`flex justify-between items-center py-2 border-b border-slate-800 last:border-0 text-sm ${p.user_id === ultimateWinnerId ? 'bg-yellow-500/10 -mx-2 px-2 rounded' : ''}`}>
                            <span className="text-slate-400 flex items-center gap-2">
                                #{i + 1} <span className={p.user_id === ultimateWinnerId ? "text-yellow-400 font-bold" : "text-white font-bold"}>{p.nickname}</span> {p.user_id === userId && '(VOS)'}
                                {p.user_id === ultimateWinnerId && <Crown size={12} className="text-yellow-500" />}
                            </span>
                            <span className="font-bold text-yellow-500">{p.score} pts</span>
                        </div>
                    ))}
                </div>

                {isHost ? (
                    <div className="flex flex-col gap-3 w-full max-w-xs relative z-10">
                        <button onClick={async () => { setIsLoading(true); await restartPartyGame(roomId); setIsLoading(false); }} className="w-full bg-green-500 hover:bg-green-600 text-black font-black py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" /> : '🔄 JUGAR REVANCHA'}
                        </button>
                        <Link href="/" className="text-slate-500 text-sm hover:text-white mt-2">Volver al menú principal</Link>
                    </div>
                ) : (
                    <div className="relative z-10 text-center">
                        <p className="text-slate-400 animate-pulse mb-4">Esperando que el anfitrión decida...</p>
                        <Link href="/" className="px-6 py-3 bg-slate-800 rounded-xl text-white font-bold hover:bg-slate-700">Salir al Menú</Link>
                    </div>
                )}
            </div>
        )
    }

    // ============================================
    // VISTA 2: LOBBY / ENTRE RONDAS
    // ============================================
    if (roomState.round_status === 'lobby' || roomState.round_status === 'finished') {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
                <Link href="/">
                    <h1 className="text-4xl font-black text-yellow-400 mb-2 cursor-pointer hover:scale-105 transition-transform text-center">MODO FIESTA 🎉</h1>
                </Link>

                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 mb-8 text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">CÓDIGO DE SALA</p>
                    <p className="text-5xl font-mono font-black text-white select-all">{roomCode}</p>
                </div>

                <div className="w-full max-w-md h-64 bg-slate-900/50 rounded-xl border border-slate-800 mb-6 flex flex-col overflow-hidden">
                    <div className="flex border-b border-slate-800">
                        <button onClick={() => setActiveTab('ranking')} className={`flex-1 py-2 text-xs font-bold uppercase ${activeTab === 'ranking' ? 'bg-slate-800 text-yellow-400' : 'text-slate-500 hover:text-white'}`}>Ranking</button>
                        <button onClick={() => setActiveTab('chat')} className={`flex-1 py-2 text-xs font-bold uppercase ${activeTab === 'chat' ? 'bg-slate-800 text-yellow-400' : 'text-slate-500 hover:text-white'}`}>Chat</button>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        {activeTab === 'ranking' ? renderLeaderboard() : renderChat()}
                    </div>
                </div>

                {roomState.round_status === 'finished' && winner && (
                    <div className="mb-6 text-center animate-bounce">
                        {winner.user_id === roomState.secret_holder_id ? (
                            <>
                                <p className="text-xl text-purple-400 font-bold">¡GANÓ EL REY!</p>
                                <p className="text-slate-400 text-sm">Nadie adivinó que era <span className="text-white font-bold">{secretChar?.name}</span></p>
                            </>
                        ) : (
                            <>
                                <p className="text-xl text-green-400 font-bold">¡GANÓ {participants.find(p => p.user_id === winner.user_id)?.nickname || 'JUGADOR'}!</p>
                                <p className="text-slate-400 text-sm">Adivinó que era <span className="text-white font-bold">{secretChar?.name}</span></p>
                            </>
                        )}
                    </div>
                )}

                {isHost ? (
                    <button onClick={handleStart} disabled={isLoading} className="w-full max-w-md bg-green-500 hover:bg-green-600 text-black font-black text-xl py-4 rounded-xl shadow-[0_4px_0_0_rgba(20,83,45,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Play fill="black" />}
                        {roomState.round_status === 'finished' ? 'SIGUIENTE RONDA' : 'INICIAR PARTIDA'}
                    </button>
                ) : (
                    <p className="text-slate-500 animate-pulse text-center">Esperando al anfitrión...</p>
                )}
            </div>
        )
    }

    // ============================================
    // VISTA 3: JUEGO ACTIVO
    // ============================================
    return (
        <div className="flex h-[100dvh] w-full bg-slate-950 text-white overflow-hidden flex-col md:flex-row relative">

            {/* SIDEBAR (Desktop) */}
            <aside className="hidden md:flex w-80 flex-col border-r border-slate-800 bg-slate-900 shrink-0 z-20">
                <div className="p-4 border-b border-slate-800">
                    <Link href="/">
                        <h1 className="font-black text-yellow-400 uppercase leading-none cursor-pointer hover:opacity-80 transition-opacity">
                            Quién Carajo<br />Es? <span className="text-white text-xs bg-purple-600 px-1 rounded ml-2">FIESTA</span>
                        </h1>
                    </Link>
                    {amITheKing && <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/50 rounded text-center">
                        <p className="text-[10px] text-purple-300 uppercase tracking-widest">SOS EL REY, TU SECRETO:</p>
                        <p className="font-black text-white text-lg">{secretChar?.name}</p>
                    </div>}
                </div>
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex border-b border-slate-800 shrink-0">
                        <button onClick={() => setActiveTab('ranking')} className={`flex-1 py-2 text-xs font-bold uppercase ${activeTab === 'ranking' ? 'bg-slate-800 text-yellow-400' : 'text-slate-500 hover:text-white'}`}>Ranking</button>
                        <button onClick={() => setActiveTab('chat')} className={`flex-1 py-2 text-xs font-bold uppercase ${activeTab === 'chat' ? 'bg-slate-800 text-yellow-400' : 'text-slate-500 hover:text-white'}`}>Chat</button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {activeTab === 'ranking' ? renderLeaderboard() : renderChat()}
                    </div>
                </div>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <div className="flex-1 flex flex-col min-h-0 relative">
                <header className="flex md:hidden h-14 shrink-0 items-center justify-between bg-slate-900 px-4 border-b border-slate-800 z-20">
                    {amITheKing ? (
                        <div className="flex items-center gap-2">
                            <Crown size={16} className="text-yellow-400" />
                            <span className="text-xs font-bold text-white">TU SECRETO: {secretChar?.name}</span>
                        </div>
                    ) : (
                        <span className="text-xs font-bold text-slate-400">ADIVINÁ EL PERSONAJE DEL REY</span>
                    )}
                    <div className="flex gap-2">
                        <button onClick={() => setActiveTab(activeTab === 'chat' ? 'ranking' : 'chat')} className="p-2 bg-slate-800 rounded text-yellow-400">
                            {activeTab === 'chat' ? <ListOrdered size={18} /> : <MessageCircle size={18} />}
                        </button>
                    </div>
                </header>

                {/* TABLERO */}
                <main className="flex-1 overflow-y-auto p-2 bg-slate-950 relative">
                    {/* OVERLAY DE MUERTE */}
                    {amIEliminated && (
                        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
                            <div className="bg-slate-900 border-2 border-red-600 p-6 rounded-2xl text-center transform rotate-[-5deg] animate-in zoom-in shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                                <Skull className="w-16 h-16 text-red-600 mx-auto mb-2 animate-pulse" />
                                <h2 className="text-3xl font-black text-red-600 uppercase tracking-tighter">ELIMINADO</h2>
                                <p className="text-slate-400 text-sm mt-2">Seguí mirando el chat 👀</p>
                            </div>
                        </div>
                    )}

                    {amITheKing ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
                            <div className="relative w-48 h-64 rounded-xl overflow-hidden border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                                {secretChar && <Image src={secretChar.image} alt={secretChar.name} fill className="object-cover" />}
                            </div>
                            <h2 className="text-3xl font-black text-white">{secretChar?.name}</h2>
                            <p className="text-slate-400 text-sm max-w-xs">Respondé en el chat si es <span className="text-green-500 font-bold">SÍ</span> o <span className="text-red-500 font-bold">NO</span>.</p>
                        </div>
                    ) : (
                        <div className={`mx-auto grid max-w-4xl grid-cols-3 gap-1.5 md:gap-4 md:grid-cols-4 lg:grid-cols-5 pb-20 transition-all duration-500 ${amIEliminated ? 'filter grayscale blur-sm' : ''}`}>
                            {currentBoard.map((char) => (
                                <div key={char.id} className="relative group">
                                    <CharacterCard
                                        character={char}
                                        isDiscarded={discardedIds.includes(char.id)}
                                        onClick={() => toggleDiscard(char.id)}
                                    />
                                    {!discardedIds.includes(char.id) && !amIEliminated && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); attemptGuess(char.id); }}
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20"
                                        >
                                            ARRIESGAR
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* PANEL MOBILE */}
                <div className="md:hidden h-[35vh] border-t border-slate-800 bg-slate-900 flex flex-col z-20">
                    <div className="flex border-b border-slate-800 shrink-0">
                        <button onClick={() => setActiveTab('ranking')} className={`flex-1 py-2 text-xs font-bold uppercase ${activeTab === 'ranking' ? 'bg-slate-800 text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-500'}`}>Ranking</button>
                        <button onClick={() => setActiveTab('chat')} className={`flex-1 py-2 text-xs font-bold uppercase ${activeTab === 'chat' ? 'bg-slate-800 text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-500'}`}>Chat</button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {activeTab === 'ranking' ? renderLeaderboard() : renderChat()}
                    </div>
                </div>
            </div>
        </div>
    )
}