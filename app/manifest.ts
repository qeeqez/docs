import type {MetadataRoute} from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "Rixl Docs",
    name: "Rixl Media Engine | Documentation",
    description: 'Rixl Media Engine | Documentation Website',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        "src": "./icon.png",
        "type": "image/png",
        "sizes": "512x512",
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}