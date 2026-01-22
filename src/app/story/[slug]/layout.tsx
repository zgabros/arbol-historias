'use client'

import { GameProvider } from '@/context/GameContext'
import * as React from 'react'

export default function StoryLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}) {
    const { slug } = React.use(params)

    return (
        <GameProvider storySlug={slug}>
            {children}
        </GameProvider>
    )
}
