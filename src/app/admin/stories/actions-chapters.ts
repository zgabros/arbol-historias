'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getChapters(storyId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}

export async function getChapter(chapterId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('chapters')
        .select('*, options!current_chapter_id(*)')
        .eq('id', chapterId)
        .single()

    if (error) throw error
    return data
}

export async function createChapter(storyId: string, title: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('chapters')
        .insert([{ story_id: storyId, title, content: '', status: 'draft' }])
        .select()
        .single()

    if (error) throw error
    revalidatePath(`/admin/stories/${storyId}`)
    return data
}

export async function updateChapter(chapterId: string, updates: { title?: string; content?: string; status?: 'draft' | 'published'; is_starting_chapter?: boolean }) {
    const supabase = await createClient()

    try {
        // If setting as starting chapter, unset others for this story
        if (updates.is_starting_chapter) {
            const chapter = await getChapter(chapterId);
            await supabase.from('chapters')
                .update({ is_starting_chapter: false })
                .eq('story_id', chapter.story_id);
        }

        const { error } = await supabase.from('chapters').update(updates).eq('id', chapterId)
        if (error) throw error

        const chapter = await getChapter(chapterId);
        revalidatePath(`/admin/stories/${chapter.story_id}`)
        revalidatePath(`/admin/stories/${chapter.story_id}/chapters/${chapterId}`)
    } catch (error) {
        console.error('Error in updateChapter:', error)
        throw error
    }
}

export async function addOption(chapterId: string, label: string, targetChapterId?: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('options').insert([{ current_chapter_id: chapterId, label, target_chapter_id: targetChapterId }])

    if (error) throw error

    const chapter = await getChapter(chapterId)
    revalidatePath(`/admin/stories/${chapter.story_id}/chapters/${chapterId}`)
}

export async function deleteOption(optionId: string, chapterId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('options').delete().eq('id', optionId)

    if (error) throw error

    const chapter = await getChapter(chapterId)
    revalidatePath(`/admin/stories/${chapter.story_id}/chapters/${chapterId}`)
}

export async function updateOption(optionId: string, updates: {
    label?: string;
    target_chapter_id?: string;
    required_flags?: any;
    set_flags?: any;
}, chapterId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('options').update(updates).eq('id', optionId)

    if (error) throw error

    const chapter = await getChapter(chapterId)
    revalidatePath(`/admin/stories/${chapter.story_id}/chapters/${chapterId}`)
}

export async function deleteChapter(chapterId: string, storyId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('chapters').delete().eq('id', chapterId)

    if (error) throw error
    revalidatePath(`/admin/stories/${storyId}`)
}

export async function createChapterAndLink(storyId: string, currentChapterId: string, title: string) {
    const supabase = await createClient()

    // 1. Create the new chapter
    const { data: newChapter, error: chapterError } = await supabase
        .from('chapters')
        .insert([{ story_id: storyId, title, content: '', status: 'draft' }])
        .select()
        .single()

    if (chapterError) throw chapterError

    // 2. Create the option in the current chapter pointing to the new one
    const { error: optionError } = await supabase
        .from('options')
        .insert([{
            current_chapter_id: currentChapterId,
            label: `Ir a ${title}`,
            target_chapter_id: newChapter.id
        }])

    if (optionError) throw optionError

    revalidatePath(`/admin/stories/${storyId}`)
    revalidatePath(`/admin/stories/${storyId}/chapters/${currentChapterId}`)
    revalidatePath(`/admin/stories/${storyId}/chapters/${newChapter.id}`)

    return newChapter
}
