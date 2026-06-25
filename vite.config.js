import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.BASE_URL ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['art/icon-192.png', 'art/icon-512.png', 'art/icon-maskable.png', 'art/mascot.png'],
      manifest: {
        name: 'Foto Macera — Fotoğraf Oyunu',
        short_name: 'Foto Macera',
        description: "Çocuklar ve yeni başlayanlar için bölümlü SLR fotoğraf makinesi simülatörü. Diyafram, perde hızı ve ISO'yu oynayarak öğren, yıldız kazan!",
        lang: 'tr',
        theme_color: '#1b2a4a',
        background_color: '#142038',
        display: 'standalone',
        orientation: 'portrait',
        start_url: `${base}?utm_source=pwa`,
        scope: base,
        categories: ['games', 'education'],
        prefer_related_applications: false,
        icons: [
          { src: 'art/icon-192.png',      sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'art/icon-512.png',      sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'art/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
          { src: 'art/feature-graphic.jpg', sizes: '1024x500', type: 'image/jpeg', form_factor: 'wide', label: 'Foto Macera ana ekranı' },
        ],
      },
    }),
  ],
})
