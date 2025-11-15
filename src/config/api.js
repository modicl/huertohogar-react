// Configuración de URLs de API según el entorno
export const API_URLS = {
  usuarios: {
    base: import.meta.env.VITE_API_USUARIOS_URL,
    authenticate: `${import.meta.env.VITE_API_USUARIOS_URL}/authenticate`
  },
  productos: import.meta.env.VITE_API_PRODUCTOS_URL,
  categorias: import.meta.env.VITE_API_CATEGORIAS_URL,
  paises: import.meta.env.VITE_API_PAISES_URL
};
