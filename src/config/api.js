// Configuración de URLs de API según el entorno
export const API_URLS = {
  usuarios: {
    base: import.meta.env.VITE_API_USUARIOS_URL,
    authenticate: `${import.meta.env.VITE_API_USUARIOS_URL}/authenticate`
  },
  ordenes: import.meta.env.VITE_API_ORDENES_URL,
  productos: import.meta.env.VITE_API_PRODUCTOS_URL,
  categorias: import.meta.env.VITE_API_CATEGORIAS_URL,
  paises: import.meta.env.VITE_API_PAISES_URL,
  comentarios: 'https://hh-productos-backend-xcijd.ondigitalocean.app/api/v1/comentarios'
};
