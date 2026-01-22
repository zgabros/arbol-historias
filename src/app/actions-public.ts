'use server'

// Actually we need to use the server client to be safe and efficient with Next.js 15
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function getPublicStories() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getPublicStoryBySlug(slug: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('stories')
        .select('*, chapters(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    if (error) throw error
    return data
}

export async function getPublicChapter(chapterId: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('chapters')
        .select('*, options!current_chapter_id(*)')
        .eq('id', chapterId)
        .eq('status', 'published')
        .single()

    if (error) throw error
    return data
}
