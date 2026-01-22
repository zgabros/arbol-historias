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
                <div className="bg-white border-2 border-[#2c2c2c] shadow-2xl rounded-lg p-4 w-64 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-bold text-sm uppercase tracking-tighter flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Bolsa de Viaje
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-black">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2 min-h-[100px]">
                        {state.inventory.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic text-center py-8">Tu bolsa está vacía...</p>
                        ) : (
                            <ul className="space-y-1">
                                {state.inventory.map((item, i) => (
                                    <li key={i} className="text-sm py-1 px-2 bg-slate-50 rounded border border-slate-100 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
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
                            className="text-[10px] text-muted-foreground hover:text-red-600 h-6 px-2"
                            onClick={() => {
                                if (confirm('¿Reiniciar partida? Perderás todo tu progreso e inventario.')) {
                                    resetGame()
                                    window.location.href = '/'
                                }
                            }}
                        >
                            <RotateCcw className="w-3 h-3 mr-1" /> Reiniciar Partida
                        </Button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#2c2c2c] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center relative"
                >
                    <Briefcase className="w-6 h-6" />
                    {state.inventory.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold">
                            {state.inventory.length}
                        </span>
                    )}
                </button>
            )}
        </div>
    )
}
