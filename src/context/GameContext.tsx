'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface GameState {
    inventory: string[]
    flags: Record<string, boolean | string | number>
}

interface GameContextType {
    state: GameState
    addItem: (item: string) => void
    removeItem: (item: string) => void
    setFlag: (key: string, value: boolean | string | number) => void
    resetGame: () => void
    isLoaded: boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children, storySlug }: { children: React.ReactNode, storySlug: string }) {
    const [state, setState] = useState<GameState>({
        inventory: [],
        flags: {}
    })
    const [isLoaded, setIsLoaded] = useState(false)

    const storageKey = `story_save_${storySlug}`

    // Load state on mount
    useEffect(() => {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
            try {
                setState(JSON.parse(saved))
            } catch (e) {
                console.error('Error loading game state', e)
            }
        }
        setIsLoaded(true)
    }, [storageKey])

    // Save state on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(storageKey, JSON.stringify(state))
        }
    }, [state, isLoaded, storageKey])

    const addItem = (item: string) => {
        setState(prev => ({
            ...prev,
            inventory: prev.inventory.includes(item) ? prev.inventory : [...prev.inventory, item]
        }))
    }

    const removeItem = (item: string) => {
        setState(prev => ({
            ...prev,
            inventory: prev.inventory.filter(i => i !== item)
        }))
    }

    const setFlag = (key: string, value: boolean | string | number) => {
        setState(prev => ({
            ...prev,
            flags: { ...prev.flags, [key]: value }
        }))
    }

    const resetGame = () => {
        setState({ inventory: [], flags: {} })
        localStorage.removeItem(storageKey)
    }

    return (
        <GameContext.Provider value={{ state, addItem, removeItem, setFlag, resetGame, isLoaded }}>
            {children}
        </GameContext.Provider>
    )
}

export function useGame() {
    const context = useContext(GameContext)
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider')
    }
    return context
}
