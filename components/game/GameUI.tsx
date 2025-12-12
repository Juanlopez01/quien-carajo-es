'use client'

import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { Character } from '@/lib/data/characters'
import CharacterCard from '@/components/game/CharacterCard'
import GuessModal from '@/components/game/GuessModal'
import { useGameStore } from '@/store/useGameStore'
import { useRealtimeGame } from '@/hooks/useRealtimeGame'
import { sendQuestion, sendAnswer, guessCharacter } from '@/app/actions/game-actions'
import Image from 'next/image'
import { Send, User, ThumbsUp, ThumbsDown, AlertTriangle, Trophy, Skull, MessageCircle, Copy, Check } from 'lucide-react'

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
    const [isGuessModalOpen, setIsGuessModalOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    const isMyTurn = currentTurn === userId
    const isWaitingOpponent = status === 'waiting'
    const isFinished = status === 'finished'

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const getInviteLink = () => typeof window !== 'undefined' ? `${window.location.origin}/game/${roomCode}` : ''

    const handleWhatsApp = () => {
        const link = getInviteLink()
        const text = `¡Jugá conmigo a Quién Carajo Es! 🕵️‍♂️🇦🇷\n\nEntrá acá: ${link}`
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
    }

    const handleCopyLink = async () => {
        const link = getInviteLink()
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) { console.error(err) }
    }

    const handleGuess = async (charId: string) => {
        setIsGuessModalOpen(false)
        await guessCharacter(roomId, charId)
    }

    if (isFinished) {
        const IWon = winnerId === userId
        if (IWon) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6, x: 0.1 }, colors: ['#FACC15', '#ffffff', '#38bdf8'] })
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6, x: 0.9 }, colors: ['#FACC15', '#ffffff', '#38bdf8'] })
        }
        return (
            <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-slate-950 text-white p-4 overflow-hidden">
                <div className="text-center space-y-6 animate-in zoom-in duration-500 relative z-10">
                    {IWon ? (
                        <>
                            <div className="relative inline-block">
                                <Trophy className="w-24 h-24 md:w-32 md:h-32 text-yellow-400 mx-auto drop-shadow-[0_0_25px_rgba(250,204,21,0.6)] animate-bounce" />
                                <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 -z-10 rounded-full"></div>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-yellow-400 uppercase tracking-tighter drop-shadow-xl">¡GANASTE!</h1>
                            <p className="text-lg md:text-2xl text-slate-300 font-medium">Sos el detective del año 🕵️‍♂️🇦🇷</p>
                        </>
                    ) : (
                        <>
                            <Skull className="w-24 h-24 md:w-32 md:h-32 text-red-600 mx-auto animate-pulse" />
                            <h1 className="text-5xl md:text-8xl font-black text-red-600 uppercase tracking-tighter drop-shadow-xl">PERDISTE</h1>
                            <p className="text-lg md:text-2xl text-slate-400 font-medium">Te bailaron sabroso 💀</p>
                        </>
                    )}
                    <div className="pt-8">
                        <a href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 border border-slate-700">
                            Jugar Otra Vez
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        // FIX 1: Contenedor principal con 100dvh y overflow-hidden para evitar scroll del body
        <div className="flex h-[100dvh] w-full flex-col md:flex-row bg-slate-950 text-white overflow-hidden relative">
            <GuessModal isOpen={isGuessModalOpen} onClose={() => setIsGuessModalOpen(false)} onGuess={handleGuess} board={board} />

            {/* --- SIDEBAR DESKTOP (Sin cambios) --- */}
            <aside className="hidden md:flex w-72 flex-col items-center border-r border-slate-800 bg-slate-900 p-6 z-10 shrink-0">
                <h1 className="mb-6 text-2xl font-black text-yellow-400 uppercase text-center leading-none">Quién<br />Carajo<br />Es?</h1>
                <div className="w-full space-y-2 rounded-xl bg-black/20 p-4 border border-slate-800 mb-6">
                    <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Tu Secreto</div>
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-yellow-500/50 shadow-lg">
                        <Image src={mySecret.image} alt={mySecret.name} fill className="object-cover" />
                    </div>
                    <div className="text-center font-bold uppercase text-white">{mySecret.name}</div>
                </div>
                {isWaitingOpponent && (
                    <div className="w-full animate-pulse space-y-3 mb-6">
                        <div className="text-xs text-center text-slate-400 uppercase tracking-widest">Invitar Amigo</div>
                        <button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-green-900/20"><MessageCircle size={20} /> Enviar WhatsApp</button>
                        <button onClick={handleCopyLink} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700">{copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}{copied ? "¡Copiado!" : "Copiar Link"}</button>
                    </div>
                )}
                <div className="mt-auto w-full">
                    <div className="w-full rounded-xl bg-slate-950 p-4 border-2 border-slate-800 text-center shadow-inner group cursor-pointer hover:border-yellow-500/50 transition-colors" onClick={handleCopyLink}>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Código de Sala</p>
                        <p className="text-4xl font-black text-white font-mono tracking-[0.2em] select-all group-hover:text-yellow-400 transition-colors">{roomCode}</p>
                        {copied && <p className="text-[10px] text-green-400 mt-1 font-bold">¡COPIADO!</p>}
                    </div>
                </div>
            </aside>

            {/* --- CENTRO: TABLERO --- */}
            {/* FIX 2: Quitamos 'h-full', usamos 'flex-1' y 'min-h-0' para que se adapte al espacio que sobra */}
            <div className="flex flex-1 flex-col min-h-0 relative">

                {/* HEADER MOBILE: Ahora es más visible y robusto */}
                <header className="flex md:hidden h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-3 z-30 shadow-md">
                    <div className="flex flex-col items-start justify-center" onClick={handleCopyLink}>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">SALA</span>
                        <span className="text-2xl font-black text-yellow-400 font-mono tracking-widest leading-none active:scale-95 transition-transform">{roomCode}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/50 p-1 pr-2 rounded-lg border border-slate-700">
                        <div className="relative h-8 w-8 overflow-hidden rounded bg-slate-700 border border-yellow-500/50">
                            <Image src={mySecret.image} alt="Secret" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-[8px] text-slate-400 uppercase">Sos:</span>
                            <span className="text-[10px] font-bold text-white max-w-[70px] truncate">{mySecret.name}</span>
                        </div>
                    </div>
                </header>

                {/* STATUS BAR */}
                <div className={`
          flex shrink-0 items-center justify-center gap-2 py-2 text-xs md:text-sm font-bold uppercase tracking-wider shadow-md z-20 transition-colors duration-500
          ${isWaitingOpponent ? 'bg-blue-600' : isMyTurn ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'}
        `}>
                    {isWaitingOpponent ? <>⏳ Esperando oponente...</> : isMyTurn ? <>🟢 Tu turno</> : <>🔴 Turno Rival</>}
                </div>

                {/* BOARD */}
                <main className="flex-1 overflow-y-auto bg-slate-950 p-1 md:p-4">
                    <div className="mx-auto grid max-w-4xl grid-cols-3 gap-1.5 md:gap-4 md:grid-cols-4 lg:grid-cols-5 pb-2">
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

            {/* --- DERECHA (MOBILE BOTTOM) --- */}
            {/* FIX 3: Ajustamos altura a 35% máximo en mobile */}
            <aside className="flex h-[35vh] md:h-auto md:w-80 w-full flex-col border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900 shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
                <div className="p-2 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 px-2"><User size={14} /> Chat</div>
                    {isMyTurn && turnPhase === 'asking' && (
                        <button onClick={() => setIsGuessModalOpen(true)} className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg animate-pulse">
                            <AlertTriangle size={12} /> ARRIESGAR
                        </button>
                    )}
                </div>

                {/* CHAT AREA */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-900/50">
                    {isWaitingOpponent && (
                        <div className="flex flex-col items-center justify-center h-full space-y-2 animate-in zoom-in duration-300">
                            <p className="text-center text-xs text-slate-400 max-w-[200px]">Nadie se unió todavía.</p>
                            <button onClick={handleWhatsApp} className="w-full max-w-[200px] bg-[#25D366] hover:bg-[#20bd5a] text-black text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg"><MessageCircle size={16} /> WhatsApp</button>
                            <button onClick={handleCopyLink} className="w-full max-w-[200px] bg-slate-800 border border-slate-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2"><Copy size={16} /> Link</button>
                        </div>
                    )}

                    {!isWaitingOpponent && messages.length === 0 && <div className="text-center text-[10px] text-slate-600 mt-2">¡Arrancó la partida!</div>}
                    {!isWaitingOpponent && messages.map((msg) => {
                        const isMe = msg.sender_id === userId
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[90%] rounded-lg px-2.5 py-1.5 text-xs shadow-sm ${isMe ? 'bg-yellow-500 text-black font-medium' : 'bg-slate-700 text-slate-200'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* INPUTS */}
                <div className="p-2 bg-slate-950 border-t border-slate-800 shrink-0">
                    {!isWaitingOpponent && isMyTurn && turnPhase === 'asking' && (
                        <form onSubmit={async (e) => { e.preventDefault(); if (!msgInput.trim()) return; const text = msgInput; setMsgInput(''); await sendQuestion(roomId, text); }} className="flex gap-2">
                            <input autoFocus type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} placeholder="¿Tiene sombrero?" className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:border-yellow-400 outline-none transition-colors" />
                            <button type="submit" className="bg-yellow-500 text-black p-2 rounded-lg font-bold hover:bg-yellow-400"><Send size={16} /></button>
                        </form>
                    )}

                    {!isWaitingOpponent && !isMyTurn && turnPhase === 'answering' && (
                        <div className="flex gap-2">
                            <button onClick={() => sendAnswer(roomId, 'SÍ')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-black text-sm shadow-lg flex items-center justify-center gap-1"><ThumbsUp size={16} /> SÍ</button>
                            <button onClick={() => sendAnswer(roomId, 'NO')} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-black text-sm shadow-lg flex items-center justify-center gap-1"><ThumbsDown size={16} /> NO</button>
                        </div>
                    )}

                    {!isWaitingOpponent && !isMyTurn && turnPhase === 'asking' && <div className="text-center py-2 text-slate-500 text-[10px] bg-slate-900/50 rounded border border-slate-800 border-dashed">⏳ Esperando pregunta...</div>}
                    {!isWaitingOpponent && isMyTurn && turnPhase === 'answering' && <div className="text-center py-2 text-yellow-500/80 text-[10px] bg-yellow-900/10 rounded border border-yellow-500/20 animate-pulse">👀 Esperando respuesta...</div>}

                    {isWaitingOpponent && <div className="text-center py-2 text-blue-400 text-[10px] bg-blue-900/20 rounded border border-blue-800 animate-pulse">Esperando Jugador 2...</div>}
                </div>
            </aside>
        </div>
    )
}