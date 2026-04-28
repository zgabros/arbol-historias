# Árbol de Historias

Árbol de Historias es una aplicación web creada con Next.js que permite a los jugadores crear y experimentar historias de "Elige tu propia aventura" (Choose Your Own Adventure) de manera interactiva y visual.

**Link de la App:** [arbolhistorias.vercel.app](https://arbolhistorias.vercel.app/)

## 🚀 Características Principales

- **Interfaz de Árbol:** Visualiza el flujo de la historia como un árbol, facilitando la comprensión de las ramificaciones y decisiones.
- **Editor de Historias:** Herramienta intuitiva para crear nuevas historias y editar existentes.
- **Modo Lectura Interactivo:** Navega por la historia haciendo clic en las decisiones, con un "contador de muertes" que rastrea los finales alternativos.
- **Persistencia de Datos:** Las historias se guardan en `localStorage`, permitiendo guardar el progreso y los borradores.
- **Manejo de Errores:** Validación robusta de historias (al menos una acción por nodo) y manejo de errores en tiempo real.

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (React Framework)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Testing:** [Vitest](https://vitest.dev/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
