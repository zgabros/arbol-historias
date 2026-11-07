import { getPublicStories } from './actions-public'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'
import { BookOpen, Sparkles, Compass } from 'lucide-react'

export default async function HomePage() {
  const stories = await getPublicStories()

  return (
    <main className="min-h-screen pb-32 selection:bg-primary/20 bg-background text-foreground">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative animate-in fade-in duration-1000">
        <div className="absolute right-6 top-8 md:right-12 z-50">
          <ThemeToggle />
        </div>
        
        <header className="pt-36 sm:pt-48 mb-32 sm:mb-48 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-8 text-xs font-bold tracking-[0.2em] uppercase border border-primary/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Biblioteca Interactiva
          </div>
          <h1 className="font-serif text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] tracking-tight mb-8 text-foreground">
            Árbol de<br />
            Historias
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground font-sans max-w-2xl px-4 font-normal leading-relaxed">
            Literatura interactiva donde cada decisión moldea tu propio destino y desentraña nuevos mundos.
          </p>
        </header>

        {stories.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed rounded-2xl bg-card shadow-xs">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" aria-hidden="true" />
            <p className="text-2xl font-serif italic text-muted-foreground mb-2">La biblioteca guarda silencio.</p>
            <p className="text-sm text-muted-foreground/80 font-sans">Vuelve más tarde para descubrir nuevas aventuras.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-32 md:gap-48">
            {stories.map((story, index) => (
              <article 
                key={story.id} 
                className={`group flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center bg-card p-6 sm:p-10 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-500`}
              >
                {story.cover_url ? (
                  <div className="w-full md:w-5/12 aspect-[4/3] sm:aspect-[16/10] relative overflow-hidden bg-muted rounded-xl border shadow-inner">
                    <Image
                      src={story.cover_url}
                      alt={`Portada del libro ${story.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-5/12 aspect-[4/3] sm:aspect-[16/10] relative overflow-hidden bg-muted rounded-xl border flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                    <BookOpen className="w-12 h-12 mb-3 opacity-40" aria-hidden="true" />
                    <span className="font-serif text-sm italic">Sin ilustración de portada</span>
                  </div>
                )}
                
                <div className="w-full md:w-7/12 flex flex-col justify-center">
                  <div className="mb-4 flex items-center gap-3 text-xs font-sans font-bold tracking-[0.2em] text-primary uppercase">
                    <Compass className="w-4 h-4" aria-hidden="true" />
                    <span>Libro {index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                  </div>
                  
                  <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-tight mb-4 text-foreground">
                    <Link href={`/story/${story.slug}`} className="focus:outline-none focus-visible:ring-4 ring-ring rounded-lg transition-colors hover:text-primary">
                      {story.title}
                    </Link>
                  </h2>
                  
                  {story.author_name && (
                    <p className="text-lg text-muted-foreground italic mb-6 font-medium">Por {story.author_name}</p>
                  )}
                  
                  <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-[65ch] mb-8 font-light">
                    {story.synopsis}
                  </p>
                  
                  <div>
                    <Link 
                      href={`/story/${story.slug}`}
                      className="inline-flex items-center gap-3 font-sans font-semibold text-foreground text-sm uppercase tracking-[0.15em] py-2 px-4 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span>Adentrarse en la historia</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-48 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-sans text-muted-foreground font-semibold tracking-[0.15em] uppercase">
          <p>&copy; 2026 Árbol de Historias. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Accesibilidad WCAG AA</span>
            <span>&bull;</span>
            <span>CMS Interactivo</span>
          </div>
        </footer>
      </div>
    </main>
  )
}