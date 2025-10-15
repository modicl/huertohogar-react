# 📁 Estructura del Panel de Administración

## 🗂️ Estructura de Carpetas

```
src/admin/
├── components/              # Componentes reutilizables de admin
│   ├── AdminLayout.jsx      # Layout principal con sidebar (NUEVO)
│   ├── AdminLayout.css      # Estilos del layout (NUEVO)
│   ├── ProtectedRoute.jsx   # Protección de rutas (NUEVO)
│   ├── AdminDashboard.jsx   # Componente del dashboard
│   ├── AdminDashboard.css   # Estilos del dashboard
│   ├── AdminSidebar.jsx     # (Deprecado - ahora en AdminLayout)
│   ├── Productos.jsx        # Gestión de productos
│   ├── Pedidos.jsx          # Gestión de pedidos
│   ├── Usuarios.jsx         # Gestión de usuarios
│   ├── Configuracion.jsx    # Configuración del sistema
│   ├── CreadorBlog.jsx      # Editor de blog
│   ├── Paginas.jsx          # Gestión de páginas
│   └── Comentarios.jsx      # Gestión de comentarios
│
└── pages/                   # Páginas completas (NUEVO)
    ├── AdminLogin.jsx       # Página de login
    ├── AdminLogin.css       # Estilos del login
    ├── Dashboard.jsx        # Página del dashboard
    ├── ProductosPage.jsx    # Página de productos
    ├── PedidosPage.jsx      # Página de pedidos
    ├── UsuariosPage.jsx     # Página de usuarios
    ├── ConfiguracionPage.jsx # Página de configuración
    ├── BlogPage.jsx         # Página de blog
    ├── PaginasPage.jsx      # Página de páginas
    └── ComentariosPage.jsx  # Página de comentarios
```

## 🛣️ Rutas Configuradas

### Ruta Pública
- `/admin/login` - Página de login (sin protección)

### Rutas Protegidas (requieren autenticación)
- `/admin` - Dashboard principal
- `/admin/productos` - Gestión de productos
- `/admin/pedidos` - Gestión de pedidos
- `/admin/usuarios` - Gestión de usuarios
- `/admin/configuracion` - Configuración
- `/admin/blog` - Editor de blog
- `/admin/paginas` - Gestión de páginas
- `/admin/comentarios` - Gestión de comentarios

## 🔐 Autenticación

### Credenciales de Prueba
- **Email:** admin@huertohogar.com
- **Password:** admin123

### Funcionamiento
1. El usuario ingresa credenciales en `/admin/login`
2. Si son correctas, se guarda un token en `localStorage`
3. El componente `ProtectedRoute` verifica el token
4. Si no hay token, redirige a `/admin/login`
5. Si hay token, permite acceso a las rutas de admin

### Cerrar Sesión
El botón "Cerrar Sesión" en el sidebar:
1. Elimina el token de `localStorage`
2. Redirige a `/admin/login`

## 🎨 Componentes Principales

### AdminLayout
- **Ubicación:** `src/admin/components/AdminLayout.jsx`
- **Función:** Layout compartido para todas las páginas de admin
- **Características:**
  - Sidebar fijo con navegación
  - Usuario actual en el header
  - Links con indicador de página activa
  - Responsive (hamburger menu en móvil)
  - Botón de logout
  - Área de contenido dinámico (`<Outlet />`)

### ProtectedRoute
- **Ubicación:** `src/admin/components/ProtectedRoute.jsx`
- **Función:** Proteger rutas de admin
- **Lógica:** 
  - Verifica `localStorage.getItem('adminToken')`
  - Si no existe → redirige a `/admin/login`
  - Si existe → muestra el componente

### Páginas Wrapper
- **Ubicación:** `src/admin/pages/*.jsx`
- **Función:** Envolver componentes existentes
- **Características:**
  - Cambia el título del documento
  - Agrega container de Materialize
  - Importa el componente correspondiente

## 🖼️ Recursos Necesarios

### Imágenes
Copia la siguiente imagen al folder `public/images/`:
- `anonymous-user.webp` (avatar del admin)

**Ubicación actual:** `importar/admin/images/anonymous-user.webp`
**Destino:** `public/images/anonymous-user.webp`

### Logos
El logo del navbar debe estar en:
- `public/images/logo_navbar.png`

## 🎯 Cómo Usar

### 1. Acceder al Panel
```
http://localhost:5173/admin/login
```

### 2. Iniciar Sesión
- Email: admin@huertohogar.com
- Password: admin123

### 3. Navegar
Usa el sidebar para navegar entre secciones

### 4. Cerrar Sesión
Click en "Cerrar Sesión" en el sidebar

## 🔄 Flujo de Navegación

```
Usuario → /admin/login → Ingresa credenciales
                ↓
          Token guardado en localStorage
                ↓
          Redirige a /admin (Dashboard)
                ↓
    Usuario navega por el sidebar
                ↓
    Todas las páginas comparten el AdminLayout
                ↓
          Click en "Cerrar Sesión"
                ↓
        Token eliminado → /admin/login
```

## 🚀 Próximos Pasos

1. ✅ Copiar `anonymous-user.webp` a `public/images/`
2. ✅ Verificar que `logo_navbar.png` esté en `public/images/`
3. ⏳ Implementar funcionalidad real en cada componente
4. ⏳ Conectar con backend/API
5. ⏳ Agregar validaciones de formularios
6. ⏳ Implementar manejo de estados global (Context API o Redux)

## 📝 Notas

- El sidebar se inicializa con Materialize CSS
- Los links activos se marcan automáticamente
- El layout es responsive (mobile-first)
- Todos los estilos usan los colores del proyecto (#2E8B57, #8B4513)
- Las páginas wrapper permiten reutilizar componentes existentes
