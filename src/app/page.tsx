import { getPublicStories } from './actions-public'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const stories = await getPublicStories()

  return (
    <main className="min-h-screen bg-[#f8f5f2] text-[#2c2c2c] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Árbol de Historias</h1>
          <p className="text-xl text-muted-foreground italic">Historias interactivas donde tú eliges el camino.</p>
        </header>

        {stories.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-muted-foreground italic">No hay historias publicadas todavía. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <Link key={story.id} href={`/story/${story.slug}`}>
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 bg-white border-none shadow-sm overflow-hidden group">
                  {story.cover_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={story.cover_url}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl mb-1">{story.title}</CardTitle>
                    {story.author_name && (
                      <p className="text-xs text-muted-foreground italic mb-2">Escrito por {story.author_name}</p>
                    )}
                    <CardDescription className="line-clamp-3 text-base leading-relaxed">
                      {story.synopsis}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-[#2c2c2c] hover:bg-[#444] text-white flex gap-2">
                      <BookOpen className="w-4 h-4" /> Comenzar a leer
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Árbol de Historias. Todos los derechos reservados.</p>
        </footer>
      </div>
    </main>
  )
}
