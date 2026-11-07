'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Loader2, CheckCircle2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/theme-toggle'

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
                toast.error('Error de autenticación', {
                    description: res.error
                })
            } else {
                setIsSent(true)
                toast.success('Enlace mágico enviado correctamente')
            }
        } catch (error) {
            toast.error('Ocurrió un error inesperado')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8 relative selection:bg-primary/20">
            <div className="absolute right-6 top-8 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> CMS Literario
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">Árbol de Historias</h1>
                    <p className="text-muted-foreground text-sm font-medium">Panel exclusivo de administración y edición</p>
                </div>

                <Card className="border shadow-xl rounded-2xl bg-card">
                    <CardHeader className="space-y-2 text-center pb-6">
                        <CardTitle className="text-2xl font-serif">
                            {isSent ? '¡Enlace enviado!' : 'Iniciar Sesión'}
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {isSent
                                ? `Hemos enviado un enlace de acceso a ${email}. Revisa tu bandeja de entrada.`
                                : 'Ingresa tu correo autorizado para recibir un enlace de acceso seguro.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isSent ? (
                            <div className="flex flex-col items-center justify-center py-6 space-y-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSent(false)}
                                    className="text-xs font-semibold shadow-xs"
                                >
                                    Intentar con otro correo
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground">Correo Electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="autor@arboldehistorias.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-11 text-base sm:text-sm bg-background"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-11 font-semibold shadow-sm transition-all text-sm"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                            Enviando enlace...
                                        </>
                                    ) : (
                                        'Enviar enlace de acceso mágico'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <footer className="text-center text-xs font-medium text-muted-foreground tracking-wider uppercase">
                    <p>&copy; 2026 Árbol de Historias &bull; CMS Seguro</p>
                </footer>
            </div>
        </main>
    )
}