'use server'

import { createClient, getSessionUser, SOLE_EDITOR_EMAIL } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const LEGACY_DEMO_STORY_ID = '9833bfe1-1339-4bda-a03e-fe4b8758913a'

export async function getStories() {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()

    // Purga automática de la historia demo previa para iniciar de cero
    await supabase.from('stories').delete().eq('id', LEGACY_DEMO_STORY_ID)
    await supabase.from('admin_users').delete().neq('email', SOLE_EDITOR_EMAIL)

    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

export async function getPrimaryStory() {
    const stories = await getStories()
    return stories[0] || null
}

export async function createStory(formData: {
    title: string
    slug: string
    synopsis: string
    author_name?: string
    cover_url?: string
}) {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()

    // Asegurar que solo exista una historia activa (limpiar anteriores si hubiera)
    const { data: existing } = await supabase.from('stories').select('id')
    if (existing && existing.length > 0) {
        for (const item of existing) {
            await supabase.from('stories').delete().eq('id', item.id)
        }
    }

    const { data: story, error } = await supabase
        .from('stories')
        .insert([{ ...formData, user_id: user.id, is_published: false }])
        .select()
        .single()

    if (error) throw error

    // Crear automáticamente el primer capítulo inicial para ahorrar pasos
    await supabase.from('chapters').insert([
        {
            story_id: story.id,
            title: 'Capítulo I — El Comienzo',
            content: '',
            status: 'draft',
            is_starting_chapter: true,
        },
    ])

    revalidatePath('/')
    revalidatePath('/admin')
    return story
}

export async function deleteStory(id: string) {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()
    const { error } = await supabase.from('stories').delete().eq('id', id)

    if (error) throw error
    revalidatePath('/')
    revalidatePath('/admin')
    redirect('/admin')
}

export async function updateStory(
    id: string,
    updates: {
        title?: string
        slug?: string
        synopsis?: string
        author_name?: string
        cover_url?: string
        is_published?: boolean
    }
) {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()
    const { error } = await supabase.from('stories').update(updates).eq('id', id)

    if (error) throw error
    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath(`/admin/stories/${id}`)
}
