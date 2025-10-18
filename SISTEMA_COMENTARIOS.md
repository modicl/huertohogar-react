# Sistema de Comentarios y Valoraciones - HuertoHogar

## 📋 Descripción General

Sistema completo de comentarios y valoraciones implementado en HuertoHogar que permite a los usuarios dejar opiniones sobre los productos y a los administradores moderar estos comentarios.

## ✨ Características Principales

### Para Usuarios (Frontend)
- ⭐ Calificación con sistema de 1 a 5 estrellas
- 💬 Comentarios de hasta 100 caracteres
- 👤 Campo de nombre de usuario (sin necesidad de autenticación)
- 📊 Visualización de promedio de calificaciones
- 📝 Contador de caracteres en tiempo real
- 📅 Fecha automática de publicación
- 🎨 Diseño responsive y profesional

### Para Administradores (Panel Admin)
- 📊 Dashboard con estadísticas:
  - Total de comentarios
  - Promedio de estrellas
  - Comentarios con 5 estrellas
  - Comentarios de la última semana
- 🔍 Filtrado por producto
- ✏️ Edición de comentarios (texto y estrellas)
- 🗑️ Eliminación de comentarios
- 📋 Vista tabular de todos los comentarios
- 🎨 Diseño unificado con el resto del panel admin

## 🗂️ Estructura de Datos

### Formato de Comentario
```javascript
{
  id: Number,              // Timestamp único
  usuario: String,         // Nombre del usuario
  comentario: String,      // Texto del comentario (máx. 100 caracteres)
  estrellas: Number,       // Calificación de 1 a 5
  fecha: String            // ISO timestamp
}
```

### Ubicación en productos.jsx
```javascript
{
  id: 1,
  nombre: "Producto",
  // ... otros campos
  comentarios: [
    {
      id: 1234567890,
      usuario: "María López",
      comentario: "Excelente producto, muy fresco y de calidad",
      estrellas: 5,
      fecha: "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

#

#### Visualización de Comentarios
```jsx
// Muestra lista de comentarios existentes
- Usuario
- Fecha formateada (DD de mes de YYYY)
- Estrellas visuales (★★★★★)
- Texto del comentario
```

#### Formulario de Nuevo Comentario
```jsx
// Campos del formulario
- Nombre: input text (requerido)
- Calificación: selector de estrellas interactivo (1-5)
- Comentario: textarea con límite de 100 caracteres
- Botón "Enviar opinión"
```

#### Validaciones
- Campo nombre no vacío
- Comentario no vacío
- Máximo 100 caracteres
- Estrellas entre 1 y 5
- Feedback visual con contador de caracteres

### En Panel Admin (`/admin/comentarios`)

#### Dashboard de Estadísticas
```javascript
// Métricas calculadas automáticamente
- Total de comentarios (todos los productos)
- Promedio de estrellas (decimal con 1 decimal)
- Cantidad de comentarios con 5 estrellas
- Comentarios de los últimos 7 días
```

#### Gestión de Comentarios
```jsx
// Acciones disponibles
1. Ver todos los comentarios en tabla
2. Filtrar por producto específico
3. Editar comentario (texto y estrellas)
4. Eliminar comentario (con confirmación)
```

#### Modal de Edición
- Usuario (no editable, solo visualización)
- Producto (no editable, solo visualización)
- Estrellas (editable, selector interactivo)
- Comentario (editable, textarea con límite 100)
- Contador de caracteres
- Botones: Cancelar / Guardar Cambios

## 💾 Persistencia de Datos

### LocalStorage Keys
- `productos`: Array completo de productos con comentarios

### Flujo de Sincronización

#### Usuario envía comentario:
1. Validación de campos
2. Creación de objeto comentario con ID único (Date.now())
3. Lectura de productos desde localStorage
4. Actualización del array de comentarios del producto
5. Guardado en localStorage
6. Actualización del estado local
7. Confirmación al usuario

#### Admin edita/elimina comentario:
1. Confirmación de acción (para eliminar)
2. Lectura de productos desde localStorage
3. Modificación del comentario específico
4. Guardado en localStorage
5. Recarga de comentarios
6. Feedback al administrador

## 🎨 Diseño y Estilos

### Componente de Producto (DetalleProducto)
- **Colores principales:**
  - Verde HuertoHogar: `#2E8B57`
  - Marrón: `#8B4513`
  - Dorado (estrellas): `#FFB900`
  - Grises: `#333`, `#666`, `#999`

- **Layout:**
  - Sección de comentarios en tarjeta blanca separada
  - Formulario con fondo gris claro `#f8f8f8`
  - Estrellas interactivas con hover
  - Responsive para móviles

### Panel Admin (Comentarios)
- **Tema unificado con `AdminDashboard.css`:**
  - dashboard-wrapper (max-width: 1400px)
  - stat-card con variantes: blue, purple, green, orange
  - admin-card para contenedor principal
  - admin-table para tabla de datos
  - badge-status para estados

- **Iconos Material:**
  - comment, star, grade, schedule
  - edit, delete

## 🔧 Funciones Clave

### `handleSubmitComentario(e)`
**Propósito:** Enviar nuevo comentario desde producto
**Validaciones:**
- Campos no vacíos
- Máximo 100 caracteres
**Proceso:**
1. Prevenir default del formulario
2. Validar campos
3. Crear objeto comentario con timestamp
4. Actualizar localStorage
5. Actualizar estado
6. Resetear formulario
7. Mostrar confirmación

### `handleEliminar(comentarioId, productoId)`
**Propósito:** Eliminar comentario desde admin
**Proceso:**
1. Solicitar confirmación
2. Filtrar comentario del producto
3. Actualizar localStorage
4. Recargar lista
5. Mostrar confirmación

### `handleGuardarEdicion()`
**Propósito:** Guardar cambios en comentario editado
**Validaciones:**
- Comentario no vacío
- Máximo 100 caracteres
**Proceso:**
1. Validar campos
2. Encontrar producto y comentario
3. Actualizar datos
4. Guardar en localStorage
5. Cerrar modal
6. Recargar lista
7. Mostrar confirmación

### `renderStars(rating, interactive, onClick)`
**Propósito:** Renderizar estrellas (★) con dos modos
**Parámetros:**
- `rating`: Número de estrellas (1-5)
- `interactive`: Boolean - si es clickeable
- `onClick`: Función callback al clickear

**Comportamiento:**
- Modo lectura: Muestra estrellas pequeñas (16px)
- Modo interactivo: Estrellas grandes (24-28px), clickeables
- Color dorado (#FFB900) para llenas, gris (#ddd) para vacías

## 📊 Datos de Ejemplo

### Producto ID 1 (Manzana Roja Orgánica)
```javascript
comentarios: [
  {
    id: 1,
    usuario: "María López",
    comentario: "Excelentes manzanas, muy frescas y dulces. Totalmente recomendadas para toda la familia.",
    estrellas: 5,
    fecha: "2025-10-15T10:30:00"
  },
  {
    id: 2,
    usuario: "Carlos R.",
    comentario: "Buena calidad, aunque esperaba que fueran un poco más grandes.",
    estrellas: 4,
    fecha: "2025-10-16T14:20:00"
  }
]
```

### Resto de Productos (ID 2-10)
```javascript
comentarios: []
```

## 🧪 Pruebas Sugeridas

### Como Usuario:
1. ✅ Navegar a un producto (ej: `/productos/1`)
2. ✅ Ver comentarios existentes
3. ✅ Enviar nuevo comentario con 5 estrellas
4. ✅ Verificar que aparece en la lista
5. ✅ Probar límite de 100 caracteres
6. ✅ Recargar página y verificar persistencia

### Como Administrador:
1. ✅ Acceder a `/admin/comentarios`
2. ✅ Verificar estadísticas correctas
3. ✅ Filtrar por producto específico
4. ✅ Editar un comentario (cambiar texto y estrellas)
5. ✅ Eliminar un comentario
6. ✅ Verificar cambios en página de producto



## 📝 Notas Técnicas

### Compatibilidad
- ✅ React 19.1.1
- ✅ Materialize CSS 1.0.0
- ✅ Material Icons
- ✅ LocalStorage API
- ✅ ES6+ JavaScript

### Rendimiento
- Los comentarios se cargan desde localStorage (rápido)
- No hay llamadas a API externas
- Renderizado eficiente con React hooks
- Estado local actualizado instantáneamente

### Seguridad
⚠️ **IMPORTANTE para producción:**
- Actualmente no hay autenticación de usuarios
- Los comentarios pueden ser editados por cualquier admin
- No hay sanitización de HTML (usar librerías como DOMPurify)
- Considerar rate limiting para prevenir spam
- Validar datos en backend antes de guardar

### Accesibilidad
- ✅ Etiquetas semánticas
- ✅ Labels asociados a inputs
- ✅ Feedback visual claro
- ⚠️ Mejorar: ARIA labels para estrellas
- ⚠️ Mejorar: Navegación por teclado en selector de estrellas

---

**Sistema de Comentarios HuertoHogar v1.0**  
Desarrollado con ❤️ para mejorar la experiencia de compra
