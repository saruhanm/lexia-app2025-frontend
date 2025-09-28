import process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-26',
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://cachallenge-backend.onrender.com',
    },
  },
  // GitHub Pages configuration
  ssr: false, // Disable server-side rendering for static generation
  app: {
    baseURL: '/girls-frontend/',
    buildAssetsDir: '/_nuxt/',
  },
  nitro: {
    prerender: {
      routes: ['/'], // Pre-render your routes
    },
  },

  extends: [
    /**
     * This extends the base Tairo layer.
     *
     * Alternatively you can use the following:
     * ["gh:cssninjaStudio/tairo/layers/tairo#v1.4.0", {
     *    install: true,
     *    auth: import.meta.env.GITHUB_TOKEN,
     * }]
     *
     * @see https://github.com/unjs/c12#extending-config-layer-from-remote-sources
     *
     * This would allows you to create an empty git repository
     * with only your source code and no demo.
     */

    '../layers/tairo',
  ],

  css: [
    /**
     * Load Tailwind CSS
     */
    './assets/main.css',
  ],
})
