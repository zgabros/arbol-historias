'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'

const LEGACY_DEMO_STORY_ID = '9833bfe1-1339-4bda-a03e-fe4b8758913a'

export async function getActivePublicStory() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('stories')
        .select('*, chapters(*)')
        .eq('is_published', true)
        .neq('id', LEGACY_DEMO_STORY_ID)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) throw error
    return data
}

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
