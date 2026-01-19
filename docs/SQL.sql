-- Habilitar extensión para UUIDs
create extension if not exists "uuid-ossp";

-- 1. Tabla de Historias
create table stories (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text unique not null,
  synopsis text,
  cover_url text,
  is_published boolean default false
);

-- 2. Tabla de Capítulos
create table chapters (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  story_id uuid references stories(id) on delete cascade not null,
  title text not null, -- Título interno para el escritor
  content text, -- Contenido en HTML o Markdown
  is_starting_chapter boolean default false,
  status text check (status in ('draft', 'published')) default 'draft'
);

-- 3. Tabla de Decisiones (Opciones)
create table options (
  id uuid default uuid_generate_v4() primary key,
  current_chapter_id uuid references chapters(id) on delete cascade not null,
  target_chapter_id uuid references chapters(id) on delete set null, -- Puede ser null si aún no creamos el destino
  label text not null -- Lo que dice el botón
);

-- Índices simples para mejorar rendimiento
create index idx_chapters_story on chapters(story_id);
create index idx_options_current on options(current_chapter_id);