'use server'

import { createClient, getSessionUser } from '@/lib/supabase/server'

export async function getStoryGraphData(storyId: string) {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()

    const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('id, title, status, is_starting_chapter, created_at')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true })

    if (chaptersError) throw chaptersError

    const chapterIds = (chapters || []).map(c => c.id)

    let options: any[] = []
    if (chapterIds.length > 0) {
        const { data: optionsData, error: optionsError } = await supabase
            .from('options')
            .select('id, current_chapter_id, target_chapter_id, label, required_flags, set_flags')
            .in('current_chapter_id', chapterIds)

        if (optionsError) throw optionsError
        options = optionsData || []
    }

    return { chapters: chapters || [], options }
}
