'use client'

import { useGame } from '@/context/GameContext'
import { Briefcase, X, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

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
                    aria-label="Bolsa de Viaje e Inventario"
                    className="bg-card border-2 border-border shadow-2xl rounded-lg p-4 w-64 animate-in slide-in-from-right-4 duration-300 text-card-foreground"
                >
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" aria-hidden="true" /> Bolsa de Viaje
                        </h2>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="text-muted-foreground hover:text-foreground p-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-label="Cerrar bolsa de viaje"
                        >
                            <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="space-y-2 min-h-[100px]">
                        {state.inventory.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic text-center py-8">Tu bolsa está vacía...</p>
                        ) : (
                            <ul className="space-y-1">
                                {state.inventory.map((item, i) => (
                                    <li key={i} className="text-sm py-1.5 px-2 bg-muted/50 rounded border border-border flex items-center gap-2 font-medium">
                                        <span className="w-2 h-2 bg-primary rounded-full" aria-hidden="true"></span>
                                        {item.replace(/_/g, ' ')}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground hover:text-red-600 font-semibold h-7 px-2"
                            onClick={() => {
                                if (confirm('¿Reiniciar partida? Perderás todo tu progreso e inventario.')) {
                                    resetGame()
                                    window.location.href = '/'
                                }
                            }}
                        >
                            <RotateCcw className="w-3.5 h-3.5 mr-1" aria-hidden="true" /> Reiniciar Partida
                        </Button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center relative focus:outline-none focus:ring-4 focus:ring-ring"
                    aria-label={`Abrir bolsa de viaje, ${state.inventory.length} objetos recolectados`}
                >
                    <Briefcase className="w-6 h-6" aria-hidden="true" />
                    {state.inventory.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-background font-bold">
                            {state.inventory.length}
                        </span>
                    )}
                </button>
            )}
        </div>
    )
}