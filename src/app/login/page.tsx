'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

import { requestMagicLink } from './actions'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error('Por favor ingresa un correo electrónico')
            return
        }

        setIsLoading(true)
        try {
            const res = await requestMagicLink(email, window.location.origin)

            if (res.error) {
                toast.error('Error', {
                    description: res.error
                })
            } else {
                setIsSent(true)
                toast.success('Enlace enviado correctamente')
            }
        } catch (error) {
            toast.error('Ocurrió un error inesperado')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-serif font-bold text-[#2c2c2c]">Árbol de Historias</h1>
                    <p className="text-muted-foreground italic">Panel de administración</p>
                </div>

                <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-serif">
                            {isSent ? '¡Enlace enviado!' : 'Iniciar Sesión'}
                        </CardTitle>
                        <CardDescription>
                            {isSent
                                ? `Hemos enviado un enlace de acceso a ${email}. Revisa tu bandeja de entrada.`
                                : 'Ingresa tu correo para recibir un enlace de acceso mágico.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {isSent ? (
                            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                                <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsSent(false)}
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Intentar con otro correo
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="tu@correo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-11"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#2c2c2c] hover:bg-[#444] text-white transition-all font-medium"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar enlace de acceso'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <footer className="text-center text-sm text-muted-foreground">
                    <p>&copy; 2026 Árbol de Historias. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    )
}
