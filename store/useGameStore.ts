// store/useGameStore.ts
import { create } from 'zustand'

interface GameState {
    discardedIds: string[] // Lista de IDs tachados (ej: ['messi', 'fort'])
    toggleDiscard: (id: string) => void
    resetGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
    discardedIds: [],

    toggleDiscard: (id) => set((state) => {
        // Si ya está tachado, lo destachamos. Si no, lo tachamos.
        const isDiscarded = state.discardedIds.includes(id)
        return {
            discardedIds: isDiscarded
                ? state.discardedIds.filter((i) => i !== id)
                : [...state.discardedIds, id],
        }
    }),

    resetGame: () => set({ discardedIds: [] })
}))