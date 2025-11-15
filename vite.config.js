import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api/v1/usuarios': {
        target: 'https://hh-usuario-backend-efp2p.ondigitalocean.app',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/productos': {
        target: 'https://hh-productos-backend-xcijd.ondigitalocean.app',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/categorias': {
        target: 'https://hh-productos-backend-xcijd.ondigitalocean.app',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/paises': {
        target: 'https://hh-productos-backend-xcijd.ondigitalocean.app',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html'],
      include: ['src/components/**/*.jsx'],
    }
  }
})
