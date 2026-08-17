import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// --site and --base are overridden by the deploy workflow (configure-pages),
// so the site works both at the project-page subpath and on snacksluckan.se.
export default defineConfig({
  site: 'https://snacksluckan.se',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
