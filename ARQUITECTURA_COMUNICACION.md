# Arquitectura y Comunicación Frontend-Backend

## Descripción General del Sistema

HuertoHogar es una aplicación web fullstack para la gestión de productos orgánicos con panel de administración. El sistema está distribuido en múltiples servicios cloud para optimizar rendimiento, escalabilidad y costos.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAPA DE CLIENTE                             │
│                    (Navegadores Web)                                │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND - React + Vite                          │
│                    Desplegado en AWS EC2                            │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  • React 19.1.1                                          │      │
│  │  • React Router 7.9.3                                    │      │
│  │  • Axios (Cliente HTTP)                                  │      │
│  │  • Vitest (Testing)                                      │      │
│  │  • Context API (State Management)                        │      │
│  └──────────────────────────────────────────────────────────┘      │
└────────────────────────────┬────────────────────────────────────────┘
                             │ Axios HTTP Requests
                             │ (REST API Calls)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│              BACKEND APIs - Microservicios                          │
│              Desplegados en Digital Ocean                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  API Usuarios   │  │  API Productos  │  │  API Órdenes    │    │
│  │  /authenticate  │  │  /productos     │  │  /ordenes       │    │
│  │  /usuarios      │  │  /categorias    │  │                 │    │
│  │                 │  │  /paises        │  │                 │    │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘    │
│           │                    │                     │             │
│           └────────────────────┼─────────────────────┘             │
│                                ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │         API Comentarios                                  │     │
│  │  /api/v1/comentarios                                     │     │
│  └────────────────────────┬─────────────────────────────────┘     │
└───────────────────────────┼───────────────────────────────────────┘
                            │ Database Queries
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│              BASE DE DATOS - Digital Ocean                          │
│              PostgreSQL Serverless                                  │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Tablas:                                                 │      │
│  │  • usuarios                                              │      │
│  │  • productos                                             │      │
│  │  • categorias                                            │      │
│  │  • paises                                                │      │
│  │  • ordenes                                               │      │
│  │  • comentarios                                           │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

## Infraestructura

### Frontend - AWS EC2
- **Plataforma**: Amazon Web Services (AWS)
- **Servicio**: EC2 (Elastic Compute Cloud)
- **Framework**: React 19.1.1 con Vite 6.0.11
- **Servidor Web**: Configurado para servir aplicación SPA
- **Puerto**: 80/443 (HTTP/HTTPS)

**Ventajas de EC2 para Frontend**:
- Control total sobre el entorno de ejecución
- Escalabilidad mediante Auto Scaling Groups
- Integración con servicios AWS (CloudFront, Route 53)
- Bajo costo para aplicaciones pequeñas/medianas

### Backend APIs - Digital Ocean
- **Plataforma**: Digital Ocean App Platform
- **Arquitectura**: Microservicios RESTful
- **Base URL**: `https://hh-productos-backend-xcijd.ondigitalocean.app`
- **Endpoints**:
  - Usuarios: Variable de entorno `VITE_API_USUARIOS_URL`
  - Productos: Variable de entorno `VITE_API_PRODUCTOS_URL`
  - Categorías: Variable de entorno `VITE_API_CATEGORIAS_URL`
  - Países: Variable de entorno `VITE_API_PAISES_URL`
  - Órdenes: Variable de entorno `VITE_API_ORDENES_URL`
  - Comentarios: `https://hh-productos-backend-xcijd.ondigitalocean.app/api/v1/comentarios`

**Ventajas de Digital Ocean**:
- Deploy automático desde repositorio Git
- Escalado horizontal automático
- SSL/TLS certificados automáticos
- Monitoreo y logs integrados

### Base de Datos - Digital Ocean Serverless
- **Tipo**: PostgreSQL Serverless
- **Plataforma**: Digital Ocean Managed Databases
- **Características**:
  - Auto-scaling según demanda
  - Backups automáticos diarios
  - Alta disponibilidad
  - Pago por uso (serverless)

## Comunicación Frontend-Backend

### Cliente HTTP: Axios

El proyecto utiliza **Axios** como cliente HTTP para todas las comunicaciones con las APIs backend.

**Ubicación**: `src/config/api.js`

```javascript
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
```

### Variables de Entorno

Las URLs de las APIs se configuran mediante variables de entorno en el archivo `.env`:

```env
VITE_API_USUARIOS_URL=https://api.huertohogar.com/usuarios
VITE_API_PRODUCTOS_URL=https://api.huertohogar.com/productos
VITE_API_CATEGORIAS_URL=https://api.huertohogar.com/categorias
VITE_API_PAISES_URL=https://api.huertohogar.com/paises
VITE_API_ORDENES_URL=https://api.huertohogar.com/ordenes
```

**Ventajas**:
- Separación de configuración por entorno (dev, staging, prod)
- Seguridad: URLs sensibles no en el código
- Flexibilidad para cambiar endpoints sin modificar código

## Patrones de Comunicación

### 1. Autenticación

**Método**: Bearer Token (JWT)

```javascript
// Login
const response = await axios.post(
  `${API_URLS.usuarios.authenticate}`,
  { email, password }
);

// Almacenar token
localStorage.setItem('token', response.data.token);
localStorage.setItem('rol', response.data.rol);

// Incluir token en peticiones
const token = localStorage.getItem('token');
const config = {
  headers: { Authorization: token }
};

await axios.get(API_URLS.productos, config);
```

**Flujo de Autenticación**:
1. Usuario ingresa credenciales
2. Frontend envía POST a `/authenticate`
3. Backend valida credenciales contra BD
4. Backend genera JWT y retorna con rol de usuario
5. Frontend almacena token en localStorage
6. Todas las peticiones subsecuentes incluyen token en header `Authorization`

### 2. Operaciones CRUD - Productos

#### GET - Listar Productos
```javascript
const token = localStorage.getItem('token');
const response = await axios.get(API_URLS.productos, {
  headers: { Authorization: token }
});
// response.data contiene array de productos
```

#### POST - Crear Producto
```javascript
const token = localStorage.getItem('token');
const nuevoProducto = {
  nombreProducto: "Tomate Orgánico",
  categoria: { idCategoria: 1 },
  descripcionProducto: "Tomates frescos",
  precioProducto: 1500,
  stockProducto: 100,
  paisOrigen: { idPais: 1 },
  imagenUrl: "https://..."
};

const response = await axios.post(
  API_URLS.productos,
  nuevoProducto,
  { headers: { Authorization: token } }
);
```

#### PATCH - Actualizar Producto
```javascript
const token = localStorage.getItem('token');
const datosActualizados = {
  precioProducto: 1800,
  stockProducto: 80
};

const response = await axios.patch(
  `${API_URLS.productos}/${idProducto}`,
  datosActualizados,
  { headers: { Authorization: token } }
);
```

#### DELETE - Eliminar Producto
```javascript
const token = localStorage.getItem('token');
const response = await axios.delete(
  `${API_URLS.productos}/${idProducto}`,
  { headers: { Authorization: token } }
);
```

### 3. Manejo de Errores

```javascript
try {
  const response = await axios.get(API_URLS.productos, config);
  setProductos(response.data);
} catch (error) {
  if (error.response) {
    // Error del servidor (4xx, 5xx)
    switch (error.response.status) {
      case 401:
        console.error('No autorizado - token inválido');
        // Redirigir a login
        break;
      case 404:
        console.error('Recurso no encontrado');
        break;
      case 500:
        console.error('Error interno del servidor');
        break;
      default:
        console.error('Error:', error.response.data.message);
    }
  } else if (error.request) {
    // No hay respuesta del servidor
    console.error('Sin respuesta del servidor');
  } else {
    // Error en configuración de la petición
    console.error('Error:', error.message);
  }
}
```

### 4. Gestión de Estado

El proyecto utiliza **React Context API** para gestión global de autenticación:

**Ubicación**: `src/context/AuthContext.jsx`

```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    const response = await axios.post(
      API_URLS.usuarios.authenticate,
      { email, password }
    );
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('rol', response.data.rol);
    
    setUser(response.data.usuario);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Estructura de Datos

### Producto
```javascript
{
  idProducto: 1,
  nombreProducto: "Tomate Orgánico",
  categoria: {
    idCategoria: 1,
    nombreCategoria: "Verduras"
  },
  descripcionProducto: "Tomates frescos cultivados orgánicamente",
  precioProducto: 1500,
  stockProducto: 100,
  paisOrigen: {
    idPais: 1,
    nombrePais: "Chile"
  },
  imagenUrl: "https://example.com/tomate.jpg"
}
```

### Usuario
```javascript
{
  idUsuario: 1,
  nombre: "Juan Pérez",
  email: "juan@example.com",
  rol: "ADMIN" | "CLIENTE",
  telefono: "+56912345678",
  direccion: "Av. Principal 123"
}
```

### Orden
```javascript
{
  idOrden: 1,
  usuario: { idUsuario: 1 },
  productos: [
    {
      producto: { idProducto: 1 },
      cantidad: 3,
      precioUnitario: 1500
    }
  ],
  total: 4500,
  estado: "PENDIENTE" | "CONFIRMADA" | "ENVIADA" | "ENTREGADA",
  fechaCreacion: "2025-11-29T12:00:00Z"
}
```

## Seguridad

### 1. Autenticación y Autorización
- **JWT (JSON Web Tokens)** para autenticación stateless
- Token almacenado en `localStorage` del navegador
- Token incluido en header `Authorization` de cada petición
- Backend valida token y rol antes de procesar peticiones

### 2. HTTPS/TLS
- Todas las comunicaciones encriptadas mediante HTTPS
- Certificados SSL/TLS gestionados automáticamente por Digital Ocean
- AWS EC2 configurado con certificado SSL

### 3. CORS (Cross-Origin Resource Sharing)
- Backend configurado para aceptar peticiones solo desde dominio del frontend
- Headers CORS apropiados en respuestas del servidor

### 4. Validación de Datos
- **Frontend**: Validación de formularios antes de envío
- **Backend**: Validación de datos recibidos
- **Base de Datos**: Constraints y validaciones a nivel de BD

## Testing

### Pruebas de Integración API

**Framework**: Vitest 3.2.4

**Ubicación de Tests**:
- `src/config/api.test.js` - Tests de API de Usuarios (22 tests)
- `src/config/productos.api.test.js` - Tests de API de Productos (27 tests)
- `src/admin/pages/AdminLogin.test.jsx` - Tests de Login (22 tests)

**Patrón AAA (Arrange-Act-Assert)**:
```javascript
it('debe obtener lista de productos exitosamente', async () => {
  // Arrange
  const mockToken = 'Bearer token123';
  const mockProductos = [
    { idProducto: 1, nombreProducto: 'Tomate' }
  ];
  localStorage.getItem.mockReturnValue(mockToken);
  axios.get.mockResolvedValue({ data: mockProductos });

  // Act
  const response = await axios.get(API_URLS.productos, {
    headers: { Authorization: mockToken }
  });

  // Assert
  expect(axios.get).toHaveBeenCalledWith(
    API_URLS.productos,
    { headers: { Authorization: mockToken } }
  );
  expect(response.data).toEqual(mockProductos);
  expect(response.data).toHaveLength(1);
});
```

**Cobertura Total**: 71 tests unitarios de integración

## Optimizaciones de Rendimiento

### 1. Frontend
- **Code Splitting**: Lazy loading de componentes con React.lazy()
- **Caching**: Respuestas de API cacheadas en estado local
- **Imágenes**: Optimización y lazy loading de imágenes
- **Bundle Size**: Vite realiza tree-shaking automático

### 2. Backend
- **Índices de BD**: Índices en columnas frecuentemente consultadas
- **Paginación**: Endpoints retornan datos paginados
- **Compresión**: Respuestas comprimidas con gzip
- **Caché**: Redis para cachear queries frecuentes (opcional)

### 3. Base de Datos
- **Connection Pooling**: Pool de conexiones para reducir overhead
- **Query Optimization**: Queries optimizadas con EXPLAIN
- **Serverless Scaling**: Auto-scaling según carga

## Monitoreo y Logs

### Frontend (AWS EC2)
- **CloudWatch**: Logs de aplicación y métricas de servidor
- **CloudWatch Alarms**: Alertas por alto uso de CPU/memoria
- **Access Logs**: Registro de todas las peticiones HTTP

### Backend (Digital Ocean)
- **App Platform Logs**: Logs de aplicación en tiempo real
- **Metrics Dashboard**: CPU, memoria, latencia de requests
- **Alerts**: Notificaciones por email/Slack ante errores

### Base de Datos
- **Query Analytics**: Análisis de queries lentas
- **Performance Metrics**: Conexiones, throughput, latencia
- **Backup Monitoring**: Verificación de backups automáticos

## Flujo Completo de una Petición

```
1. Usuario interactúa con UI (React)
   ↓
2. Componente llama función con Axios
   ↓
3. Axios prepara petición HTTP
   - URL desde API_URLS (variables de entorno)
   - Token desde localStorage
   - Headers: Authorization, Content-Type
   ↓
4. Petición viaja por Internet (HTTPS)
   AWS EC2 → Digital Ocean App Platform
   ↓
5. Backend recibe petición
   - Valida token JWT
   - Verifica permisos (rol)
   ↓
6. Backend consulta Base de Datos
   Digital Ocean PostgreSQL Serverless
   ↓
7. BD retorna datos al Backend
   ↓
8. Backend procesa y formatea respuesta
   - JSON con código de estado HTTP
   ↓
9. Respuesta viaja de vuelta (HTTPS)
   Digital Ocean → AWS EC2
   ↓
10. Frontend recibe respuesta
    - Axios parsea JSON automáticamente
    ↓
11. Componente actualiza estado
    - React re-renderiza UI
    ↓
12. Usuario ve resultado en pantalla
```

## Escalabilidad

### Estrategias Implementadas

1. **Frontend**: 
   - EC2 Auto Scaling Group
   - Application Load Balancer
   - CloudFront CDN para assets estáticos

2. **Backend**:
   - Arquitectura de microservicios
   - Auto-scaling horizontal en Digital Ocean
   - Stateless design (JWT tokens)

3. **Base de Datos**:
   - PostgreSQL Serverless (auto-scaling)
   - Read replicas para lectura intensiva
   - Sharding por dominio si es necesario

## Costos Estimados

### AWS EC2 (Frontend)
- Instancia t2.micro/t3.micro: ~$10-15/mes
- Transferencia de datos: ~$5-10/mes
- **Total Frontend**: ~$15-25/mes

### Digital Ocean (Backend + BD)
- App Platform: ~$12-25/mes (según tráfico)
- PostgreSQL Serverless: ~$15-30/mes (según uso)
- **Total Backend**: ~$27-55/mes

**Costo Total Mensual**: ~$42-80/mes

## Mejoras Futuras

1. **Implementar Redis** para caché de queries frecuentes
2. **WebSockets** para actualizaciones en tiempo real (stock, órdenes)
3. **CDN** (CloudFront) para imágenes de productos
4. **GraphQL** como alternativa a REST para queries complejas
5. **Service Workers** para funcionalidad offline
6. **Rate Limiting** para prevenir abuso de APIs
7. **Monitoreo APM** (New Relic, Datadog) para performance profiling
8. **CI/CD Pipeline** completo con GitHub Actions

## Referencias

- **Axios Documentation**: https://axios-http.com/
- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/
- **AWS EC2**: https://aws.amazon.com/ec2/
- **Digital Ocean App Platform**: https://www.digitalocean.com/products/app-platform
- **Digital Ocean Databases**: https://www.digitalocean.com/products/managed-databases

---

**Documento creado**: 29 de Noviembre, 2025  
**Versión**: 1.0  
**Proyecto**: HuertoHogar React Frontend
