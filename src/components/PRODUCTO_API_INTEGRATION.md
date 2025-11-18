# 🛍️ DOCUMENTACIÓN: Integración de API en Componente Producto

## 📋 Información General

**Componente**: `Producto.jsx`  
**Ubicación**: `src/components/Producto.jsx`  
**Propósito**: Catálogo de productos con integración completa a la API REST  
**Última actualización**: Noviembre 2025

---

## 🎯 Funcionalidades Integradas

### ✅ Implementado

1. **Carga de productos desde API**
   - Endpoint: `GET /api/v1/productos`
   - Servicio: `productosService.getAll()`
   - Carga automática al montar el componente

2. **Carga de categorías desde API**
   - Endpoint: `GET /api/v1/categorias`
   - Servicio: `categoriasService.getAll()`
   - Carga en paralelo con productos

3. **Filtrado por categoría (API)**
   - Endpoint: `GET /api/v1/productos/categoria/{id}`
   - Servicio: `productosService.searchByCategory(categoriaId)`
   - Actualización inmediata al seleccionar categoría

4. **Búsqueda por rango de precio (API)**
   - Endpoint: `GET /api/v1/productos/precio?min={min}&max={max}`
   - Servicio: `productosService.searchByPriceRange(min, max)`
   - Activado con botón "Buscar por Precio"

5. **Estados de carga y error**
   - Spinner de carga durante peticiones
   - Mensajes de error con opción de reintentar
   - Feedback visual al usuario

6. **Ordenamiento local**
   - Por precio (ascendente/descendente)
   - Por nombre (A-Z / Z-A)
   - Aplicado después de filtros de API

7. **Gestión de carrito**
   - Agregar productos con cantidad personalizada
   - Persistencia en localStorage
   - Eventos personalizados para sincronización

---

## 🏗️ Arquitectura del Componente

### Estados del Componente

```javascript
// Datos desde la API
const [productos, setProductos] = useState([]);        // Array de productos
const [categorias, setCategorias] = useState([]);      // Array de categorías

// Estados de UI
const [loading, setLoading] = useState(true);          // Control de carga
const [error, setError] = useState(null);              // Mensajes de error

// Control de usuario
const [quantities, setQuantities] = useState({});      // Cantidades por producto
const [showFiltros, setShowFiltros] = useState(false); // Toggle filtros móvil

// Filtros
const [filtros, setFiltros] = useState({
  categoriaId: null,          // ID de categoría (API)
  categoriaNombre: 'todas',   // Nombre para UI
  precioMin: 0,              // Precio mínimo
  precioMax: 50000,          // Precio máximo
  ordenar: 'ninguno',        // Tipo de ordenamiento
  usarAPI: false             // Flag para filtros API vs local
});
```

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│                    COMPONENTE PRODUCTO                   │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  1. useEffect() - Al montar componente         │    │
│  │     │                                           │    │
│  │     └─> fetchProductosYCategorias()            │    │
│  │            │                                     │    │
│  │            ├─> productosService.getAll()  ────> API  │
│  │            └─> categoriasService.getAll() ────> API  │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  2. Filtros (activados por usuario)            │    │
│  │                                                  │    │
│  │  handleCategoriaChange(id)                      │    │
│  │     └─> filtrarPorCategoriaAPI(id) ──────────> API  │
│  │                                                  │    │
│  │  aplicarFiltroPrecio()                          │    │
│  │     └─> filtrarPorPrecioAPI(min, max) ───────> API  │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  3. Procesamiento local                         │    │
│  │                                                  │    │
│  │  productosFiltrados (computed)                  │    │
│  │     ├─> Filtrado local adicional                │    │
│  │     └─> Ordenamiento (precio/nombre)            │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  4. Renderizado                                 │    │
│  │                                                  │    │
│  │  ├─ Loading state                               │    │
│  │  ├─ Error state                                 │    │
│  │  └─ Productos grid                              │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 📡 Integración con Servicios

### Importaciones

```javascript
import { productosService, categoriasService } from '../services';
```

### Funciones Principales

#### 1. Carga Inicial

```javascript
/**
 * Carga productos y categorías desde la API
 * Se ejecuta al montar el componente
 */
const fetchProductosYCategorias = async () => {
  setLoading(true);
  setError(null);
  
  try {
    // Peticiones en paralelo (optimización)
    const [productosData, categoriasData] = await Promise.all([
      productosService.getAll(),
      categoriasService.getAll()
    ]);
    
    setProductos(productosData);
    setCategorias(categoriasData);
    
    // Ajustar rango de precios automáticamente
    const maxPrecio = Math.max(...productosData.map(p => p.precio));
    setFiltros(prev => ({
      ...prev,
      precioMax: Math.ceil(maxPrecio / 1000) * 1000
    }));
    
  } catch (error) {
    console.error('Error cargando datos:', error);
    setError('Error al cargar productos');
  } finally {
    setLoading(false);
  }
};

// Ejecutar al montar
useEffect(() => {
  fetchProductosYCategorias();
}, []);
```

#### 2. Filtrado por Categoría

```javascript
/**
 * Filtra productos usando la API de búsqueda por categoría
 * @param {number|null} categoriaId - ID de categoría o null para todas
 */
const filtrarPorCategoriaAPI = async (categoriaId) => {
  if (!categoriaId) {
    await fetchProductosYCategorias(); // Recargar todos
    return;
  }

  setLoading(true);
  try {
    const productosData = await productosService.searchByCategory(categoriaId);
    setProductos(productosData);
  } catch (error) {
    setError('Error al filtrar productos');
  } finally {
    setLoading(false);
  }
};

// Handler del evento de categoría
const handleCategoriaChange = (categoriaId, categoriaNombre) => {
  setFiltros(prev => ({
    ...prev,
    categoriaId,
    categoriaNombre,
    usarAPI: !!categoriaId
  }));
  
  // Llamar a la API
  if (categoriaId) {
    filtrarPorCategoriaAPI(categoriaId);
  } else {
    fetchProductosYCategorias();
  }
};
```

#### 3. Filtrado por Precio

```javascript
/**
 * Busca productos en un rango de precio usando la API
 * @param {number} min - Precio mínimo
 * @param {number} max - Precio máximo
 */
const filtrarPorPrecioAPI = async (min, max) => {
  setLoading(true);
  try {
    const productosData = await productosService.searchByPriceRange(min, max);
    setProductos(productosData);
  } catch (error) {
    setError('Error al filtrar productos');
  } finally {
    setLoading(false);
  }
};

// Handler del botón "Buscar por Precio"
const aplicarFiltroPrecio = () => {
  filtrarPorPrecioAPI(filtros.precioMin, filtros.precioMax);
};
```

#### 4. Agregar al Carrito

```javascript
/**
 * Agrega producto al carrito (localStorage)
 * Dispara evento 'cartUpdated' para sincronización global
 */
const addToCart = (producto) => {
  const quantity = quantities[producto.id] || 1;
  const currentCart = JSON.parse(localStorage.getItem('cartHuerto') || '[]');
  
  const existingIndex = currentCart.findIndex(item => item.id === producto.id);
  
  if (existingIndex >= 0) {
    currentCart[existingIndex].quantity += quantity;
  } else {
    currentCart.push({ ...producto, quantity });
  }
  
  localStorage.setItem('cartHuerto', JSON.stringify(currentCart));
  window.dispatchEvent(new Event('cartUpdated')); // Evento global
  
  alert(`✅ ${quantity} unidad(es) agregadas al carrito`);
  setQuantities(prev => ({ ...prev, [producto.id]: 1 }));
};
```

---

## 🎨 Estructura Visual

### Estados de UI

#### Loading State

```jsx
{loading && (
  <div style={{ textAlign: 'center', padding: '60px' }}>
    <div className="spinner"></div>
    <h3>Cargando productos...</h3>
    <p>Obteniendo datos desde el servidor</p>
  </div>
)}
```

#### Error State

```jsx
{error && !loading && (
  <div style={{ background: '#fee', padding: '40px' }}>
    <i className="material-icons">error_outline</i>
    <h3>{error}</h3>
    <button onClick={fetchProductosYCategorias}>
      Reintentar
    </button>
  </div>
)}
```

#### Empty State

```jsx
{productosFiltrados.length === 0 && (
  <div style={{ textAlign: 'center' }}>
    <i className="material-icons">search_off</i>
    <h3>No se encontraron productos</h3>
    <button onClick={resetFiltros}>Limpiar Filtros</button>
  </div>
)}
```

---

## 🔧 Mapeo de Campos API → UI

### Producto

| Campo API | Campo UI | Descripción | Fallback |
|-----------|----------|-------------|----------|
| `id` | `id` | Identificador único | - |
| `nombre` | `nombre` | Nombre del producto | - |
| `descripcion` | `descripcion` | Descripción detallada | Vacío |
| `precio` | `precio` | Precio en CLP | 0 |
| `stock` | `stock` | Unidades disponibles | 0 |
| `imagenUrl` | `imagen` | URL de la imagen | `/placeholder.jpg` |
| `categoria.id` | `categoriaId` | ID de categoría | null |
| `categoria.nombre` | `categoria` | Nombre de categoría | 'Sin categoría' |
| `paisOrigen.id` | `paisOrigenId` | ID del país | null |
| `paisOrigen.nombre` | `origen` | Nombre del país | Vacío |

### Categoría

| Campo API | Campo UI | Descripción |
|-----------|----------|-------------|
| `id` | `id` | Identificador único |
| `nombre` | `nombre` | Nombre de la categoría |
| `descripcion` | `descripcion` | Descripción |

---

## 📊 Logs y Debugging

### Console Logs Implementados

```javascript
// Carga inicial
console.log('🔄 Cargando productos y categorías desde la API...');
console.log('✅ Productos cargados:', productosData.length);
console.log('✅ Categorías cargadas:', categoriasData.length);

// Filtros
console.log('📂 Cambio de categoría:', categoriaNombre, categoriaId);
console.log('💰 Aplicando filtro de precio: $', min, '-', max);
console.log('🔄 Reseteando filtros...');

// Carrito
console.log('🛒 Agregado al carrito:', producto.nombre);
console.log('📦 Actualizado producto en carrito:', cantidad);

// Estado actual
console.log('📊 Estado actual:', {
  totalProductos,
  productosFiltrados,
  filtrosActivos,
  loading,
  error
});
```

### Emojis de Estado

- 🔄 Cargando
- ✅ Éxito
- ❌ Error
- 📂 Categoría
- 💰 Precio
- 🛒 Carrito
- 📊 Estado

---

## ⚠️ Manejo de Errores

### Estrategias Implementadas

1. **Try-Catch en todas las llamadas API**
   ```javascript
   try {
     const data = await productosService.getAll();
   } catch (error) {
     console.error('❌ Error:', error);
     setError('Mensaje amigable');
   } finally {
     setLoading(false);
   }
   ```

2. **Fallbacks para imágenes**
   ```javascript
   <img 
     src={producto.imagenUrl || '/placeholder.jpg'}
     onError={(e) => e.target.src = '/placeholder.jpg'}
   />
   ```

3. **Valores por defecto**
   ```javascript
   categoria?.nombre || 'Sin categoría'
   paisOrigen?.nombre || ''
   ```

4. **Botón de reintentar**
   ```jsx
   <button onClick={fetchProductosYCategorias}>
     Reintentar
   </button>
   ```

---

## 🎓 Cómo Usar Este Componente

### 1. Asegúrate de tener los servicios configurados

```javascript
// Verifica que exista: src/services/productosService.js
// Verifica que exista: src/services/categoriasService.js
// Verifica que exista: src/config/api.js
```

### 2. Importa el componente

```javascript
import { Producto } from './components/Producto';
```

### 3. Úsalo en tu ruta

```javascript
<Route path="/productos" element={<Producto />} />
```

### 4. El componente se encarga de todo

- ✅ Cargar datos automáticamente
- ✅ Mostrar estados de carga
- ✅ Manejar errores
- ✅ Filtrar productos
- ✅ Gestionar carrito

---

## 🚀 Optimizaciones Implementadas

1. **Peticiones en paralelo**
   ```javascript
   const [productos, categorias] = await Promise.all([
     productosService.getAll(),
     categoriasService.getAll()
   ]);
   ```

2. **Ajuste dinámico de rangos de precio**
   ```javascript
   const maxPrecio = Math.max(...productos.map(p => p.precio));
   setFiltros({ ...filtros, precioMax: maxPrecio });
   ```

3. **Filtrado híbrido (API + Local)**
   - API: Categoría y precio (reduce datos transferidos)
   - Local: Ordenamiento (respuesta instantánea)

4. **Eventos personalizados para carrito**
   ```javascript
   window.dispatchEvent(new Event('cartUpdated'));
   ```

---

## 📝 Próximas Mejoras Sugeridas

- [ ] Paginación de productos
- [ ] Búsqueda por texto
- [ ] Caché de productos visitados
- [ ] Lazy loading de imágenes
- [ ] Filtros combinados (categoría + precio)
- [ ] Vista de lista vs grid
- [ ] Productos favoritos
- [ ] Comparador de productos

---

## 🐛 Troubleshooting

### Problema: "No se cargan los productos"
**Solución**: Verificar que la API esté activa y accesible
```bash
curl https://hh-productos-backend-xcijd.ondigitalocean.app/api/v1/productos
```

### Problema: "Error de CORS"
**Solución**: Las APIs deben tener CORS habilitado para el dominio del frontend

### Problema: "Las imágenes no cargan"
**Solución**: Verificar URLs de `imagenUrl` en la API o usar fallback

### Problema: "Los filtros no funcionan"
**Solución**: Revisar console.log para ver errores de red

---

## ✅ Checklist de Integración

- [x] Importar servicios de API
- [x] Crear estados para productos y categorías
- [x] Implementar useEffect para carga inicial
- [x] Crear funciones de filtrado con API
- [x] Agregar estados de loading y error
- [x] Actualizar UI para mostrar campos de API
- [x] Implementar fallbacks para datos faltantes
- [x] Agregar logs de debugging
- [x] Documentar el código
- [x] Probar todos los flujos

---

**¡Integración completada exitosamente!** 🎉

Este componente está completamente integrado con la API REST de productos y listo para producción.
