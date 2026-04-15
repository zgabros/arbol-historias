# Arbol de Historias - Configuración y Reglas para IA (Agent/AI Instructions)

Este archivo define las convenciones de código, arquitectura y contexto de negocio para el proyecto "Arbol de Historias". Las IAs deben seguir estas directrices al generar código, sugerir cambios o refactorizar.

## 1. Stack Tecnológico Principal
- **Framework:** Next.js (versión 16+ / React 19) usando App Router (`/src/app`).
- **Base de Datos y Autenticación:** Supabase (cliente nativo y SSR).
- **Estilos:** TailwindCSS y Vanilla CSS para diseños premium/customizados. 
- **Componentes UI:** Shadcn UI (basado en Radix UI) y Lucide React para iconos.
- **Hosting:** Vercel (Edge Network y Serverless Functions).

## 2. Decisiones de Arquitectura
- **Backend & Frontend Unificado (BFF):** Mantener "Web" y "API" en el mismo repositorio usando Server Actions y el App Router de Next.js. Evitar separar en repositorios/APIs externos a menos que sea estrictamente necesario para aplicaciones móviles nativas o procesos muy pesados.
- **Server Actions:** Toda la lógica de interacción mutante con la BD (crear, editar, eliminar) debe residir en archivos dedicados de Server Actions (ej. `src/app/actions-*.ts` o `/src/actions`) indicando `'use server'`. 
- **Reutilización de Código:** Extraer cálculos complejos y transformaciones de datos a funciones de utilidad en `/src/lib`.
- **Renderizado:** Preferir Server Components (por defecto) para obtención de datos SEO/rapidez, y aislar estados o interactividad del cliente (ej. eventos onclick, hooks useEffect) en archivos marcados con `'use client'` lo más a nivel de hoja (leaf level) posible.

## 3. Base de Datos (Supabase)
- **Delegación de Backend:** Aprovechar Supabase Auth y las políticas de Row Level Security (RLS) para proteger los datos antes de que lleguen a Next.js.
- **Roles y Permisos:** Existen roles de sistema (ej. "admin"). Respetar y potenciar la lógica que aísla visualmente a editores vs super-admin (o historias por autor). Al crear interacciones, siempre pensar en el contexto de seguridad y el rol del usuario conectado.
- **Edge Functions / Migrations:** (Si aplica) Toda alteración profunda en esquemas se hará respetando las migraciones SQL formales de Supabase.

## 4. Estilo y Estética UI (Aesthetics)
- **Calidad de Diseño (Premium):** Los diseños no deben lucir genéricos ("estilo Bootstrap o material crudo"). Aplicar efectos dinámicos como hover sutiles, bordes pulidos, tipografías modernas (Google Fonts), y paletas coherentes (Dark mode first, si aplica).
- **Consistencia Visual:** Usar las clases semánticas de las herramientas instaladas como `tailwind-merge` y `clsx` (utilidades típicas de Shadcn) para combinar clases CSS conflictivas de manera segura.

## 5. Prevención de Errores Comunes
- No usar funciones deprecadas de Node (como `url.parse`), utilizar el estándar web (URL API).
- Importar datos de manera segura y manejar adecuadamente el estado de carga (`loading.tsx`, `Suspense`, componentes skeleton) y estados de error (`error.tsx`).
- Variables de entorno: Nunca filtrar o enviar una key marcada exclusiva de servidor hacia el frontend. Las keys públicas irán precedidas de `NEXT_PUBLIC_`.

*Nota Ocasional:* Antes de implementar una vista compleja o modelo grande, generar un plan (implementation_plan.md) para revisión técnica con el desarrollador humano.
