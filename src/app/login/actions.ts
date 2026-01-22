'use server'

import { createClient } from '@/lib/supabase/server'

export async function requestMagicLink(email: string, origin: string) {
    const supabase = await createClient()

    // Check if email is in the admin_users whitelist table
    const { data: adminUser } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .single()

    if (!adminUser) {
        return { error: 'Este correo no está autorizado para acceder al panel.' }
    }
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
