'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getStories() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function createStory(formData: { title: string; slug: string; synopsis: string; author_name?: string; cover_url?: string }) {
    const supabase = await createClient()
    const { error } = await supabase.from('stories').insert([formData])

    if (error) throw error
    revalidatePath('/admin')
}

export async function deleteStory(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('stories').delete().eq('id', id)

    if (error) throw error
    revalidatePath('/admin')
    redirect('/admin')
}

export async function updateStory(id: string, updates: { title?: string; synopsis?: string; author_name?: string; cover_url?: string; is_published?: boolean }) {
    const supabase = await createClient()
    const { error } = await supabase.from('stories').update(updates).eq('id', id)

    if (error) throw error
    revalidatePath('/admin')
    revalidatePath(`/admin/stories/${id}`)
}
