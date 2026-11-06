import { getPublicStories } from './actions-public'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function HomePage() {
  const stories = await getPublicStories()

  return (
    <main className="min-h-screen pb-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative animate-in fade-in duration-1000">
        <div className="absolute right-6 top-8 md:right-12 z-50">
          <ThemeToggle />
        </div>
        
        <header className="pt-48 mb-48 flex flex-col items-center text-center">
          <span className="font-sans text-sm font-bold tracking-[0.2em] text-primary uppercase mb-8">Elige tu camino</span>
          <h1 className="font-serif text-[clamp(4rem,10vw,8rem)] leading-[0.85] tracking-tight mb-12 text-foreground">
            Árbol de<br />
            Historias
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl px-4 font-medium">
            Literatura interactiva con múltiples destinos.
          </p>
        </header>

        {stories.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-2xl font-serif italic text-muted-foreground">La biblioteca guarda silencio. Vuelve más tarde.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-48 md:gap-64">
            {stories.map((story, index) => (
              <article key={story.id} className={`group flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-32 items-center`}>
                {story.cover_url && (
                  <div className="w-full md:w-5/12 aspect-[3/4] relative overflow-hidden bg-muted border rounded-md">
                    <Image
                      src={story.cover_url}
                      alt={`Portada del libro ${story.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                
                <div className="w-full md:w-7/12 flex flex-col justify-center">
                  <div className="mb-6 flex items-center gap-4 text-sm font-sans font-bold tracking-widest text-primary uppercase">
                    <span>Libro {index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                    <span className="h-[1px] w-8 bg-primary/40" aria-hidden="true"></span>
                  </div>
                  
                  <h2 className="font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] tracking-tight mb-8">
                    <Link href={`/story/${story.slug}`} className="focus:outline-none focus-visible:ring-4 ring-ring rounded relative hover:text-primary transition-colors duration-500">
                      {story.title}
                    </Link>
                  </h2>
                  
                  {story.author_name && (
                    <p className="text-xl text-muted-foreground italic mb-12 font-medium">Por {story.author_name}</p>
                  )}
                  
                  <p className="text-lg md:text-xl leading-relaxed text-foreground/90 max-w-[60ch] mb-16 font-light">
                    {story.synopsis}
                  </p>
                  
                  <div>
                    <span className="inline-flex flex-row items-center font-sans font-bold text-foreground text-sm uppercase tracking-[0.15em] gap-4 transition-all duration-500 ease-out group-hover:text-primary">
                      Adentrarse
                      <span className="h-[1px] w-16 bg-foreground group-hover:bg-primary group-hover:w-32 transition-all duration-700 ease-out" aria-hidden="true"></span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-48 pt-16 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-muted-foreground font-semibold tracking-[0.15em] uppercase">
          <p>&copy; 2026 Árbol de Historias</p>
          <p>Accesibilidad &bull; CMS</p>
        </footer>
      </div>
    </main>
  )
}