'use client'

import { useGame } from '@/context/GameContext'
import { Briefcase, X, RotateCcw } from 'lucide-react'
import { useState } from 'react'

export default function InventoryFloating() {
    const { state, resetGame } = useGame()
    const [isOpen, setIsOpen] = useState(false)

    if (state.inventory.length === 0 && !isOpen) return null

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Notas y Bolsa de Viaje"
                    className="book-volume editorial-frame p-5 w-72 animate-in slide-in-from-bottom-3 duration-200 text-card-foreground"
                >
                    <div className="flex justify-between items-center mb-3 border-b border-border/80 pb-2.5">
                        <h2 className="font-sans font-bold text-xs uppercase tracking-[0.18em] flex items-center gap-2 text-foreground">
                            <Briefcase className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> Bolsa de Viaje
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-muted-foreground hover:text-foreground p-1 focus:outline-none"
                            aria-label="Cerrar bolsa de viaje"
                        >
                            <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="space-y-2 min-h-[88px]">
                        {state.inventory.length === 0 ? (
                            <p className="text-xs font-serif italic text-muted-foreground text-center py-6">
                                Tu bolsa de viaje está vacía...
                            </p>
                        ) : (
                            <ul className="space-y-1.5">
                                {state.inventory.map((item, i) => (
                                    <li
                                        key={i}
                                        className="text-sm font-serif py-1.5 px-3 bg-secondary/70 border border-border flex items-center gap-2.5 text-foreground"
                                    >
                                        <span className="text-primary text-xs" aria-hidden="true">✦</span>
                                        <span className="capitalize">{item.replace(/_/g, ' ')}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/70 flex justify-end">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.14em] text-muted-foreground hover:text-destructive font-bold py-1 px-2 transition-colors"
                            onClick={() => {
                                if (confirm('¿Reiniciar lectura? Perderás los objetos recolectados en tu bolsa de viaje.')) {
                                    resetGame()
                                    window.location.href = '/'
                                }
                            }}
                        >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Reiniciar lectura
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="paper-choice-btn px-4 py-3 flex items-center gap-2.5 text-xs font-sans font-bold uppercase tracking-[0.15em] text-foreground"
                    aria-label={`Abrir bolsa de viaje, ${state.inventory.length} objetos recolectados`}
                >
                    <Briefcase className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span>Bolsa ({state.inventory.length})</span>
                </button>
            )}
        </div>
    )
}
