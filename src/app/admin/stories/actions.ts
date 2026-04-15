'use server'

import { createClient, getSessionUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getStories() {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()
    
    let query = supabase.from('stories').select('*').order('created_at', { ascending: false })
    
    // Si es editor, solo puede ver sus historias
    if (user.role === 'editor') {
        query = query.eq('user_id', user.id)
    }

    const { data, error } = await query

    if (error) throw error
    return data
}

export async function createStory(formData: { title: string; slug: string; synopsis: string; author_name?: string; cover_url?: string }) {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()
    const { error } = await supabase.from('stories').insert([{ ...formData, user_id: user.id }])

    if (error) throw error
    revalidatePath('/admin')
}

export async function deleteStory(id: string) {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()
    
    let query = supabase.from('stories').delete().eq('id', id)
    if (user.role === 'editor') {
        query = query.eq('user_id', user.id)
    }
    
    const { error } = await query

    if (error) throw error
    revalidatePath('/admin')
    redirect('/admin')
}

export async function updateStory(id: string, updates: { title?: string; synopsis?: string; author_name?: string; cover_url?: string; is_published?: boolean }) {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()
    
    let query = supabase.from('stories').update(updates).eq('id', id)
    if (user.role === 'editor') {
        query = query.eq('user_id', user.id)
    }
    
    const { error } = await query

    if (error) throw error
    revalidatePath('/admin')
    revalidatePath(`/admin/stories/${id}`)
}
