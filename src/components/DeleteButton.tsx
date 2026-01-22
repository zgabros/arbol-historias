'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface DeleteButtonProps {
    onDelete: () => Promise<void>
    title: string
    description: string
    label?: string
    iconOnly?: boolean
    className?: string
}

export default function DeleteButton({ onDelete, title, description, label = "Eliminar", iconOnly = false, className }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    async function handleDelete() {
        setLoading(true)
        try {
            await onDelete()
            toast.success('Eliminado con éxito')
            setIsOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('Error al intentar eliminar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size={iconOnly ? "icon" : "default"} className={`text-red-500 hover:text-red-600 hover:bg-red-50 ${className}`}>
                    <Trash2 className="w-4 h-4" />
                    {!iconOnly && <span className="ml-2">{label}</span>}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description} Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar eliminación
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
