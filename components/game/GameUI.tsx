'use client'

import { useState, useEffect, useRef } from 'react'
import { Character } from '@/lib/data/characters'
import CharacterCard from '@/components/game/CharacterCard'
import GuessModal from '@/components/game/GuessModal' // <--- NUEVO
import { useGameStore } from '@/store/useGameStore'
import { useRealtimeGame } from '@/hooks/useRealtimeGame'
import { sendQuestion, sendAnswer, guessCharacter } from '@/app/actions/game-actions' // <--- NUEVO
import Image from 'next/image'
import { Send, User, ThumbsUp, ThumbsDown, AlertTriangle, Trophy, Skull } from 'lucide-react'

interface Props {
    roomCode: string
    roomId: string
    userId: string
    board: Character[]
    mySecret: Character
    initialStatus: 'waiting' | 'playing' | 'finished'
}

export default function GameUI({ roomCode, roomId, userId, board, mySecret, initialStatus }: Props) {
    const { discardedIds, toggleDiscard } = useGameStore()
    const { status, currentTurn, turnPhase, messages, winnerId } = useRealtimeGame(roomId, initialStatus)

    const [msgInput, setMsgInput] = useState('')
    const [isGuessModalOpen, setIsGuessModalOpen] = useState(false) // <--- NUEVO
    const chatEndRef = useRef<HTMLDivElement>(null)

    const isMyTurn = currentTurn === userId
    const isWaitingOpponent = status === 'waiting'
    const isFinished = status === 'finished'

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Lógica para arriesgar
    const handleGuess = async (charId: string) => {
        setIsGuessModalOpen(false)
        await guessCharacter(roomId, charId)
        // No hace falta hacer más nada, el realtime actualizará el status a 'finished'
    }

    // --- PANTALLA DE GAME OVER ---
    if (isFinished) {
        const IWon = winnerId === userId
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 text-white p-4">
                <div className="text-center space-y-6 animate-in zoom-in duration-500">
                    {IWon ? (
                        <>
                            <Trophy className="w-32 h-32 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                            <h1 className="text-6xl font-black text-yellow-400 uppercase tracking-tighter">
                                ¡GANASTE!
                            </h1>
                            <p className="text-xl text-slate-300">Sos el detective del año 🕵️‍♂️🇦🇷</p>
                        </>
                    ) : (
                        <>
                            <Skull className="w-32 h-32 text-red-600 mx-auto" />
                            <h1 className="text-6xl font-black text-red-600 uppercase tracking-tighter">
                                PERDISTE
                            </h1>
                            <p className="text-xl text-slate-400">Te bailaron sabroso 💀</p>
                        </>
                    )}

                    <a href="/" className="inline-block mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
                        Volver al Lobby
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full flex-col md:flex-row bg-slate-950 text-white overflow-hidden">

            {/* MODAL DE ARRIESGAR */}
            <GuessModal
                isOpen={isGuessModalOpen}
                onClose={() => setIsGuessModalOpen(false)}
                onGuess={handleGuess}
                board={board}
            />

            {/* --- 1. IZQUIERDA: TU PERSONAJE --- */}
            <aside className="hidden md:flex w-72 flex-col items-center border-r border-slate-800 bg-slate-900 p-6 z-10 shrink-0">
                <h1 className="mb-6 text-2xl font-black text-yellow-400 uppercase text-center leading-none">
                    Quién<br />Carajo<br />Es?
                </h1>
                <div className="w-full space-y-2 rounded-xl bg-black/20 p-4 border border-slate-800">
                    <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Tu Secreto
                    </div>
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-yellow-500/50 shadow-lg">
                        <Image src={mySecret.image} alt={mySecret.name} fill className="object-cover" />
                    </div>
                    <div className="text-center font-bold uppercase text-white">{mySecret.name}</div>
                </div>
                <div className="mt-auto text-xs text-slate-600">Sala: {roomCode}</div>
            </aside>

            {/* --- 2. CENTRO: TABLERO --- */}
            <div className="flex flex-1 flex-col min-w-0 relative h-full">
                <header className="flex md:hidden h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
                    <span className="font-bold text-yellow-400">QCE?</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Sos:</span>
                        <span className="text-xs font-bold text-white border border-yellow-500 px-2 py-0.5 rounded">{mySecret.name}</span>
                    </div>
                </header>

                <div className={`
          flex shrink-0 items-center justify-center gap-2 py-2 text-sm font-bold uppercase tracking-wider shadow-md z-20 transition-colors duration-500
          ${isWaitingOpponent ? 'bg-blue-600' : isMyTurn ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'}
        `}>
                    {isWaitingOpponent ? <>⏳ Esperando oponente...</> : isMyTurn ? <>🟢 Tu turno</> : <>🔴 Turno Rival</>}
                </div>

                <main className="flex-1 overflow-y-auto p-2 sm:p-4 bg-slate-950">
                    <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 pb-4">
                        {board.map((char) => (
                            <CharacterCard
                                key={char.id}
                                character={char}
                                isDiscarded={discardedIds.includes(char.id)}
                                onClick={() => toggleDiscard(char.id)}
                            />
                        ))}
                    </div>
                </main>
            </div>

            {/* --- 3. DERECHA: CHAT & ACCIONES --- */}
            <aside className="flex h-[35vh] md:h-auto md:w-80 w-full flex-col border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900 shrink-0 z-20">

                {/* Header Chat + Botón ARRIESGAR Mobile/Desktop */}
                <div className="p-2 border-b border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 px-2">
                        <User size={16} /> Chat
                    </div>

                    {/* BOTÓN ARRIESGAR (Solo visible si es mi turno y estoy preguntando) */}
                    {isMyTurn && turnPhase === 'asking' && (
                        <button
                            onClick={() => setIsGuessModalOpen(true)}
                            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg animate-pulse"
                        >
                            <AlertTriangle size={12} /> ARRIESGAR
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
                    {messages.length === 0 && <div className="text-center text-xs text-slate-600 mt-4">La partida comienza...</div>}
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === userId
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${isMe ? 'bg-yellow-500 text-black font-medium' : 'bg-slate-700 text-slate-200'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-3 bg-slate-950 border-t border-slate-800">
                    {/* A. INPUT PREGUNTA */}
                    {isMyTurn && turnPhase === 'asking' && (
                        <form onSubmit={async (e) => {
                            e.preventDefault(); if (!msgInput.trim()) return;
                            const text = msgInput; setMsgInput(''); await sendQuestion(roomId, text);
                        }} className="flex gap-2">
                            <input autoFocus type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} placeholder="¿Es rubio?" className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-3 text-sm focus:border-yellow-400 outline-none transition-colors" />
                            <button type="submit" className="bg-yellow-500 text-black p-3 rounded-lg font-bold hover:bg-yellow-400"><Send size={18} /></button>
                        </form>
                    )}

                    {/* B. BOTONES RESPUESTA */}
                    {!isMyTurn && turnPhase === 'answering' && (
                        <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                            <button onClick={() => sendAnswer(roomId, 'SÍ')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-black text-sm md:text-lg shadow-lg flex items-center justify-center gap-2"><ThumbsUp size={18} /> SÍ</button>
                            <button onClick={() => sendAnswer(roomId, 'NO')} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-black text-sm md:text-lg shadow-lg flex items-center justify-center gap-2"><ThumbsDown size={18} /> NO</button>
                        </div>
                    )}

                    {/* C/D. MENSAJES DE ESPERA */}
                    {!isMyTurn && turnPhase === 'asking' && <div className="text-center py-3 text-slate-500 text-xs bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">⏳ Esperando pregunta...</div>}
                    {isMyTurn && turnPhase === 'answering' && <div className="text-center py-3 text-yellow-500/80 text-xs bg-yellow-900/10 rounded-lg border border-yellow-500/20 animate-pulse">👀 Esperando respuesta...</div>}
                </div>
            </aside>
        </div>
    )
}