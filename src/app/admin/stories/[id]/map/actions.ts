'use server'

import { createClient, getSessionUser } from '@/lib/supabase/server'

export async function getStoryGraphData(storyId: string) {
    const user = await getSessionUser()
    if (!user) throw new Error('No autorizado')

    const supabase = await createClient()

    // Verify ownership
    if (user.role !== 'admin') {
        const { data: storyOwner } = await supabase.from('stories').select('id').eq('id', storyId).eq('user_id', user.id).single()
        if (!storyOwner) throw new Error('No autorizado o historia no encontrada')
    }

    // 1. Fetch chapters (nodes)
    const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('id, title, status, is_starting_chapter')
        .eq('story_id', storyId)
    
    if (chaptersError) throw chaptersError

    // 2. Fetch options (edges)
    const chapterIds = chapters.map(c => c.id)
    
    let options: any[] = []
    if (chapterIds.length > 0) {
        const { data: optionsData, error: optionsError } = await supabase
            .from('options')
            .select('id, current_chapter_id, target_chapter_id, label')
            .in('current_chapter_id', chapterIds)
            
        if (optionsError) throw optionsError
        options = optionsData || []
    }

    return { chapters, options }
}
