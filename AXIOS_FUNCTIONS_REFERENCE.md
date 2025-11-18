# 📚 RECUENTO COMPLETO DE FUNCIONES AXIOS - API de Productos

## 📋 Índice de Contenidos

1. [Configuración Base de Axios](#configuración-base-de-axios)
2. [API de Productos](#api-de-productos)
3. [Tabla Resumen](#tabla-resumen)
4. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🔧 Configuración Base de Axios

### Instancia de Axios para Productos

Antes de crear las funciones, necesitas crear la instancia configurada de axios:

```javascript
import axios from 'axios';

// Instancia para API de Productos
export const apiProductos = axios.create({
  baseURL: 'https://hh-productos-backend-xcijd.ondigitalocean.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token JWT automáticamente (para endpoints ADMIN)
const authInterceptor = (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

apiProductos.interceptors.request.use(authInterceptor);
```

---

## 🛍️ API DE PRODUCTOS

**Base URL**: `https://hh-productos-backend-xcijd.ondigitalocean.app`

### 1️⃣ PRODUCTOS (7 funciones)

#### 1.1 Listar todos los productos
```javascript
/**
 * Obtiene la lista completa de productos
 * Endpoint: GET /api/v1/productos
 * Acceso: Público (sin autenticación)
 */
const getAllProductos = async () => {
  try {
    const response = await apiProductos.get('/api/v1/productos');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

// USO:
const productos = await getAllProductos();
// Retorna: Array de objetos producto
// [{ id, nombre, descripcion, precio, stock, categoria, paisOrigen, imagenUrl }]
```

#### 1.2 Obtener producto por ID
```javascript
/**
 * Obtiene un producto específico por su ID
 * Endpoint: GET /api/v1/productos/{id}
 * Acceso: Público
 */
const getProductoById = async (id) => {
  try {
    const response = await apiProductos.get(`/api/v1/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo producto ${id}:`, error);
    throw error;
  }
};

// USO:
const producto = await getProductoById(10);
// Retorna: { id: 10, nombre: "...", precio: 2500, ... }
```

#### 1.3 Buscar productos por rango de precio
```javascript
/**
 * Busca productos dentro de un rango de precio
 * Endpoint: GET /api/v1/productos/precio?min={min}&max={max}
 * Acceso: Público
 */
const searchProductosByPrecio = async (min, max) => {
  try {
    const response = await apiProductos.get('/api/v1/productos/precio', {
      params: { min, max }
    });
    return response.data;
  } catch (error) {
    console.error('Error buscando por precio:', error);
    throw error;
  }
};

// USO:
const productos = await searchProductosByPrecio(1000, 5000);
// Retorna: Array de productos entre $1000 y $5000
```

#### 1.4 Buscar productos por categoría
```javascript
/**
 * Busca productos de una categoría específica
 * Endpoint: GET /api/v1/productos/categoria/{id}
 * Acceso: Público
 */
const searchProductosByCategoria = async (categoriaId) => {
  try {
    const response = await apiProductos.get(`/api/v1/productos/categoria/${categoriaId}`);
    return response.data;
  } catch (error) {
    console.error('Error buscando por categoría:', error);
    throw error;
  }
};

// USO:
const productos = await searchProductosByCategoria(3);
// Retorna: Array de productos de la categoría 3
```

#### 1.5 Crear producto (ADMIN)
```javascript
/**
 * Crea un nuevo producto
 * Endpoint: POST /api/v1/productos
 * Acceso: ADMIN (requiere token JWT)
 */
const createProducto = async (productData) => {
  try {
    const response = await apiProductos.post('/api/v1/productos', productData);
    return response.data;
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
};

// USO:
const nuevoProducto = await createProducto({
  nombre: 'Tomate Orgánico',
  descripcion: 'Tomates frescos de huerto',
  precio: 2500,
  stock: 100,
  categoriaId: 1,
  paisOrigenId: 2,
  imagenUrl: 'https://example.com/tomate.jpg'
});
// Retorna: Objeto del producto creado con su ID
```

#### 1.6 Actualizar producto (ADMIN)
```javascript
/**
 * Actualiza un producto parcialmente
 * Endpoint: PATCH /api/v1/productos/{id}
 * Acceso: ADMIN
 */
const updateProducto = async (id, partialData) => {
  try {
    const response = await apiProductos.patch(`/api/v1/productos/${id}`, partialData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
};

// USO:
const actualizado = await updateProducto(10, {
  precio: 3000,
  stock: 150
});
// Retorna: Producto actualizado
```

#### 1.7 Eliminar producto (ADMIN)
```javascript
/**
 * Elimina un producto
 * Endpoint: DELETE /api/v1/productos/{id}
 * Acceso: ADMIN
 */
const deleteProducto = async (id) => {
  try {
    const response = await apiProductos.delete(`/api/v1/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando producto:', error);
    throw error;
  }
};

// USO:
await deleteProducto(10);
// Retorna: Confirmación de eliminación
```

---

### 2️⃣ CATEGORÍAS (6 funciones)

#### 2.1 Listar todas las categorías
```javascript
/**
 * Obtiene todas las categorías de productos
 * Endpoint: GET /api/v1/categorias
 * Acceso: Público
 */
const getAllCategorias = async () => {
  try {
    const response = await apiProductos.get('/api/v1/categorias');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    throw error;
  }
};

// USO:
const categorias = await getAllCategorias();
// Retorna: [{ id: 1, nombre: "Verduras", descripcion: "..." }]
```

#### 2.2 Obtener categoría por ID
```javascript
/**
 * Obtiene una categoría específica
 * Endpoint: GET /api/v1/categorias/{id}
 * Acceso: Público
 */
const getCategoriaById = async (id) => {
  try {
    const response = await apiProductos.get(`/api/v1/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    throw error;
  }
};

// USO:
const categoria = await getCategoriaById(2);
```

#### 2.3 Crear categoría (ADMIN)
```javascript
/**
 * Crea una nueva categoría
 * Endpoint: POST /api/v1/categorias
 * Acceso: ADMIN
 */
const createCategoria = async (categoriaData) => {
  try {
    const response = await apiProductos.post('/api/v1/categorias', categoriaData);
    return response.data;
  } catch (error) {
    console.error('Error creando categoría:', error);
    throw error;
  }
};

// USO:
const nuevaCategoria = await createCategoria({
  nombre: 'Frutas',
  descripcion: 'Frutas frescas de temporada'
});
```

#### 2.4 Actualizar categoría completa (ADMIN)
```javascript
/**
 * Actualiza una categoría completamente
 * Endpoint: PUT /api/v1/categorias/{id}
 * Acceso: ADMIN
 */
const updateCategoriaFull = async (id, categoriaData) => {
  try {
    const response = await apiProductos.put(`/api/v1/categorias/${id}`, categoriaData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    throw error;
  }
};

// USO:
const actualizada = await updateCategoriaFull(2, {
  nombre: 'Verduras Orgánicas',
  descripcion: 'Vegetales certificados orgánicos'
});
```

#### 2.5 Actualizar categoría parcial (ADMIN)
```javascript
/**
 * Actualiza una categoría parcialmente
 * Endpoint: PATCH /api/v1/categorias/{id}
 * Acceso: ADMIN
 */
const updateCategoriaParcial = async (id, partialData) => {
  try {
    const response = await apiProductos.patch(`/api/v1/categorias/${id}`, partialData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    throw error;
  }
};

// USO:
const actualizada = await updateCategoriaParcial(2, {
  descripcion: 'Nueva descripción'
});
```

#### 2.6 Eliminar categoría (ADMIN)
```javascript
/**
 * Elimina una categoría
 * Endpoint: DELETE /api/v1/categorias/{id}
 * Acceso: ADMIN
 */
const deleteCategoria = async (id) => {
  try {
    const response = await apiProductos.delete(`/api/v1/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    throw error;
  }
};

// USO:
await deleteCategoria(2);
```

---

### 3️⃣ PAÍSES DE ORIGEN (6 funciones)

#### 3.1 Listar todos los países
```javascript
/**
 * Obtiene todos los países de origen
 * Endpoint: GET /api/v1/paises
 * Acceso: Público
 */
const getAllPaises = async () => {
  try {
    const response = await apiProductos.get('/api/v1/paises');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo países:', error);
    throw error;
  }
};

// USO:
const paises = await getAllPaises();
// Retorna: [{ id: 1, nombre: "Chile", codigo: "CL" }]
```

#### 3.2 Obtener país por ID
```javascript
/**
 * Obtiene un país específico
 * Endpoint: GET /api/v1/paises/{id}
 * Acceso: Público
 */
const getPaisById = async (id) => {
  try {
    const response = await apiProductos.get(`/api/v1/paises/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo país:', error);
    throw error;
  }
};

// USO:
const pais = await getPaisById(1);
```

#### 3.3 Crear país (ADMIN)
```javascript
/**
 * Crea un nuevo país
 * Endpoint: POST /api/v1/paises
 * Acceso: ADMIN
 */
const createPais = async (paisData) => {
  try {
    const response = await apiProductos.post('/api/v1/paises', paisData);
    return response.data;
  } catch (error) {
    console.error('Error creando país:', error);
    throw error;
  }
};

// USO:
const nuevoPais = await createPais({
  nombre: 'Argentina',
  codigo: 'AR'
});
```

#### 3.4 Actualizar país completo (ADMIN)
```javascript
/**
 * Actualiza un país completamente
 * Endpoint: PUT /api/v1/paises/{id}
 * Acceso: ADMIN
 */
const updatePaisFull = async (id, paisData) => {
  try {
    const response = await apiProductos.put(`/api/v1/paises/${id}`, paisData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando país:', error);
    throw error;
  }
};

// USO:
const actualizado = await updatePaisFull(1, {
  nombre: 'República de Chile',
  codigo: 'CL'
});
```

#### 3.5 Actualizar país parcial (ADMIN)
```javascript
/**
 * Actualiza un país parcialmente
 * Endpoint: PATCH /api/v1/paises/{id}
 * Acceso: ADMIN
 */
const updatePaisParcial = async (id, partialData) => {
  try {
    const response = await apiProductos.patch(`/api/v1/paises/${id}`, partialData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando país:', error);
    throw error;
  }
};

// USO:
const actualizado = await updatePaisParcial(1, {
  nombre: 'Chile'
});
```

#### 3.6 Eliminar país (ADMIN)
```javascript
/**
 * Elimina un país
 * Endpoint: DELETE /api/v1/paises/{id}
 * Acceso: ADMIN
 */
const deletePais = async (id) => {
  try {
    const response = await apiProductos.delete(`/api/v1/paises/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando país:', error);
    throw error;
  }
};

// USO:
await deletePais(1);
```

---

## � TABLA RESUMEN DE FUNCIONES

#### 4.1 Login - Autenticar usuario
```javascript
/**
 * Autentica un usuario y obtiene token JWT
 * Endpoint: POST /api/v1/usuarios/authenticate
 * Acceso: Público
 */
const login = async (credentials) => {
  try {
    const response = await apiUsuarios.post('/api/v1/usuarios/authenticate', credentials);
    
    // Guardar token automáticamente
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// USO:
const resultado = await login({
  email: 'usuario@example.com',
  password: 'MiPassword123'
});
// Retorna: { token: "jwt...", user: { id, email, nombre, rol } }
```

#### 4.2 Registrar nuevo usuario
```javascript
/**
 * Registra un nuevo usuario en el sistema
 * Endpoint: POST /api/v1/usuarios
 * Acceso: Público
 */
const register = async (userData) => {
  try {
    const response = await apiUsuarios.post('/api/v1/usuarios', userData);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// USO:
const nuevoUsuario = await register({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  password: 'Password123',
  telefono: '+56912345678',
  direccion: 'Calle Principal 123',
  ciudadId: 1
});
// Retorna: Usuario creado
```

#### 4.3 Validar formato de contraseña
```javascript
/**
 * Valida si una contraseña cumple con los requisitos
 * Endpoint: POST /api/v1/usuarios/validar-contrasena
 * Acceso: Público
 */
const validatePassword = async (password) => {
  try {
    const response = await apiUsuarios.post('/api/v1/usuarios/validar-contrasena', {
      password
    });
    return response.data;
  } catch (error) {
    console.error('Error validando contraseña:', error);
    throw error;
  }
};

// USO:
const resultado = await validatePassword('MiPassword123');
// Retorna: { isValid: true, message: "Contraseña válida" }
```

---

### 5️⃣ GESTIÓN DE USUARIOS (11 funciones)

#### 5.1 Listar todos los usuarios (ADMIN)
```javascript
/**
 * Obtiene lista de todos los usuarios
 * Endpoint: GET /api/v1/usuarios
 * Acceso: ADMIN
 */
const getAllUsuarios = async () => {
  try {
    const response = await apiUsuarios.get('/api/v1/usuarios');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

// USO:
const usuarios = await getAllUsuarios();
// Retorna: Array de usuarios
```

#### 5.2 Obtener usuario por ID (ADMIN)
```javascript
/**
 * Obtiene un usuario específico
 * Endpoint: GET /api/v1/usuarios/{id}
 * Acceso: ADMIN
 */
const getUsuarioById = async (id) => {
  try {
    const response = await apiUsuarios.get(`/api/v1/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw error;
  }
};

// USO:
const usuario = await getUsuarioById(5);
```

#### 5.3 Buscar usuarios por apellido (ADMIN)
```javascript
/**
 * Busca usuarios por apellidos paternos
 * Endpoint: GET /api/v1/usuarios/categoria/{id}
 * Acceso: ADMIN
 * Nota: El endpoint usa "categoria" pero busca por apellidos
 */
const searchUsuariosByApellido = async (apellido) => {
  try {
    const response = await apiUsuarios.get(`/api/v1/usuarios/categoria/${apellido}`);
    return response.data;
  } catch (error) {
    console.error('Error buscando usuarios:', error);
    throw error;
  }
};

// USO:
const usuarios = await searchUsuariosByApellido('González');
```

#### 5.4 Actualizar usuario completo (ADMIN)
```javascript
/**
 * Actualiza completamente un usuario
 * Endpoint: PUT /api/v1/usuarios/{id}
 * Acceso: ADMIN
 */
const updateUsuarioFull = async (id, userData) => {
  try {
    const response = await apiUsuarios.put(`/api/v1/usuarios/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw error;
  }
};

// USO:
const actualizado = await updateUsuarioFull(5, {
  nombre: 'Juan Pérez Updated',
  email: 'juan.new@example.com',
  telefono: '+56987654321',
  direccion: 'Nueva dirección',
  ciudadId: 2
});
```

#### 5.5 Actualizar usuario parcial (ADMIN)
```javascript
/**
 * Actualiza parcialmente un usuario
 * Endpoint: PATCH /api/v1/usuarios/{id}
 * Acceso: ADMIN
 */
const updateUsuarioParcial = async (id, partialData) => {
  try {
    const response = await apiUsuarios.patch(`/api/v1/usuarios/${id}`, partialData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw error;
  }
};

// USO:
const actualizado = await updateUsuarioParcial(5, {
  telefono: '+56999999999'
});
```

#### 5.6 Eliminar usuario (ADMIN)
```javascript
/**
 * Elimina un usuario
 * Endpoint: DELETE /api/v1/usuarios/{id}
 * Acceso: ADMIN
 */
const deleteUsuario = async (id) => {
  try {
    const response = await apiUsuarios.delete(`/api/v1/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw error;
  }
};

// USO:
await deleteUsuario(5);
```

#### 5.7 Cambiar contraseña (ADMIN)
```javascript
/**
 * Cambia la contraseña de un usuario
 * Endpoint: PUT /api/v1/usuarios/{id}/cambiar-contrasena
 * Acceso: ADMIN
 */
const changePassword = async (id, passwords) => {
  try {
    const response = await apiUsuarios.put(
      `/api/v1/usuarios/${id}/cambiar-contrasena`, 
      passwords
    );
    return response.data;
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    throw error;
  }
};

// USO:
await changePassword(5, {
  currentPassword: 'PasswordActual123',
  newPassword: 'NuevoPassword123'
});
```

#### 5.8 Resetear contraseña (ADMIN)
```javascript
/**
 * Resetea la contraseña de un usuario (sin requerir la actual)
 * Endpoint: PATCH /api/v1/usuarios/{id}/resetear-contrasena
 * Acceso: ADMIN
 */
const resetPassword = async (id, newPassword) => {
  try {
    const response = await apiUsuarios.patch(
      `/api/v1/usuarios/${id}/resetear-contrasena`,
      { newPassword }
    );
    return response.data;
  } catch (error) {
    console.error('Error reseteando contraseña:', error);
    throw error;
  }
};

// USO:
await resetPassword(5, { newPassword: 'NuevaPassword123' });
```

#### 5.9 Promover usuario a ADMIN
```javascript
/**
 * Promueve un usuario normal a rol ADMIN
 * Endpoint: PATCH /api/v1/usuarios/{id}/promover-admin
 * Acceso: ADMIN
 */
const promoteToAdmin = async (id) => {
  try {
    const response = await apiUsuarios.patch(`/api/v1/usuarios/${id}/promover-admin`);
    return response.data;
  } catch (error) {
    console.error('Error promoviendo usuario:', error);
    throw error;
  }
};

// USO:
const admin = await promoteToAdmin(5);
// Retorna: Usuario con rol actualizado a ADMIN
```

#### 5.10 Degradar ADMIN a usuario normal
```javascript
/**
 * Degrada un ADMIN a usuario normal (USER)
 * Endpoint: PATCH /api/v1/usuarios/{id}/degradar-user
 * Acceso: ADMIN
 */
const degradeToUser = async (id) => {
  try {
    const response = await apiUsuarios.patch(`/api/v1/usuarios/${id}/degradar-user`);
    return response.data;
  } catch (error) {
    console.error('Error degradando usuario:', error);
    throw error;
  }
};

// USO:
const user = await degradeToUser(5);
// Retorna: Usuario con rol actualizado a USER
```

---

### 6️⃣ REGIONES (8 funciones)

#### 6.1 Listar todas las regiones (ADMIN)
```javascript
/**
 * Obtiene todas las regiones
 * Endpoint: GET /api/v1/regiones
 * Acceso: ADMIN
 */
const getAllRegiones = async () => {
  try {
    const response = await apiUsuarios.get('/api/v1/regiones');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo regiones:', error);
    throw error;
  }
};

// USO:
const regiones = await getAllRegiones();
```

#### 6.2 Obtener región por ID (ADMIN)
```javascript
/**
 * Obtiene una región específica
 * Endpoint: GET /api/v1/regiones/{id}
 * Acceso: ADMIN
 */
const getRegionById = async (id) => {
  try {
    const response = await apiUsuarios.get(`/api/v1/regiones/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo región:', error);
    throw error;
  }
};

// USO:
const region = await getRegionById(5);
```

#### 6.3 Buscar región por nombre (ADMIN)
```javascript
/**
 * Busca una región por su nombre
 * Endpoint: GET /api/v1/regiones/nombreRegion?nombre={nombre}
 * Acceso: ADMIN
 */
const searchRegionByNombre = async (nombre) => {
  try {
    const response = await apiUsuarios.get('/api/v1/regiones/nombreRegion', {
      params: { nombre }
    });
    return response.data;
  } catch (error) {
    console.error('Error buscando región:', error);
    throw error;
  }
};

// USO:
const region = await searchRegionByNombre('Metropolitana');
```

#### 6.4 Verificar si existe región (ADMIN)
```javascript
/**
 * Verifica si existe una región con ese nombre
 * Endpoint: GET /api/v1/regiones/regionExistente?nombre={nombre}
 * Acceso: ADMIN
 */
const regionExists = async (nombre) => {
  try {
    const response = await apiUsuarios.get('/api/v1/regiones/regionExistente', {
      params: { nombre }
    });
    return response.data;
  } catch (error) {
    console.error('Error verificando región:', error);
    throw error;
  }
};

// USO:
const existe = await regionExists('Valparaíso');
// Retorna: true o false
```

#### 6.5 Crear región (ADMIN)
```javascript
/**
 * Crea una nueva región
 * Endpoint: POST /api/v1/regiones
 * Acceso: ADMIN
 */
const createRegion = async (regionData) => {
  try {
    const response = await apiUsuarios.post('/api/v1/regiones', regionData);
    return response.data;
  } catch (error) {
    console.error('Error creando región:', error);
    throw error;
  }
};

// USO:
const nuevaRegion = await createRegion({
  nombre: 'Región de Valparaíso',
  codigo: 'V'
});
```

#### 6.6 Actualizar región completa (ADMIN)
```javascript
/**
 * Actualiza completamente una región
 * Endpoint: PUT /api/v1/regiones/{id}
 * Acceso: ADMIN
 */
const updateRegionFull = async (id, regionData) => {
  try {
    const response = await apiUsuarios.put(`/api/v1/regiones/${id}`, regionData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando región:', error);
    throw error;
  }
};

// USO:
const actualizada = await updateRegionFull(5, {
  nombre: 'Región Metropolitana',
  codigo: 'RM'
});
```

#### 6.7 Actualizar región parcial (ADMIN)
```javascript
/**
 * Actualiza parcialmente una región
 * Endpoint: PATCH /api/v1/regiones/{id}
 * Acceso: ADMIN
 */
const updateRegionParcial = async (id, partialData) => {
  try {
    const response = await apiUsuarios.patch(`/api/v1/regiones/${id}`, partialData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando región:', error);
    throw error;
  }
};

// USO:
const actualizada = await updateRegionParcial(5, {
  codigo: 'XIII'
});
```

#### 6.8 Eliminar región (ADMIN)
```javascript
/**
 * Elimina una región
 * Endpoint: DELETE /api/v1/regiones/{id}
 * Acceso: ADMIN
 */
const deleteRegion = async (id) => {
  try {
    const response = await apiUsuarios.delete(`/api/v1/regiones/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando región:', error);
    throw error;
  }
};

// USO:
await deleteRegion(5);
```

---

### 7️⃣ CIUDADES (7 funciones)

#### 7.1 Listar todas las ciudades (ADMIN)
```javascript
/**
 * Obtiene todas las ciudades
 * Endpoint: GET /api/v1/ciudades
 * Acceso: ADMIN
 */
const getAllCiudades = async () => {
  try {
    const response = await apiUsuarios.get('/api/v1/ciudades');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo ciudades:', error);
    throw error;
  }
};

// USO:
const ciudades = await getAllCiudades();
```

#### 7.2 Obtener ciudad por ID (ADMIN)
```javascript
/**
 * Obtiene una ciudad específica
 * Endpoint: GET /api/v1/ciudades/{id}
 * Acceso: ADMIN
 */
const getCiudadById = async (id) => {
  try {
    const response = await apiUsuarios.get(`/api/v1/ciudades/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo ciudad:', error);
    throw error;
  }
};

// USO:
const ciudad = await getCiudadById(10);
```

#### 7.3 Buscar ciudades por región (ADMIN)
```javascript
/**
 * Busca ciudades de una región específica
 * Endpoint: GET /api/v1/ciudades/region/{idRegion}
 * Acceso: ADMIN
 */
const searchCiudadesByRegion = async (regionId) => {
  try {
    const response = await apiUsuarios.get(`/api/v1/ciudades/region/${regionId}`);
    return response.data;
  } catch (error) {
    console.error('Error buscando ciudades:', error);
    throw error;
  }
};

// USO:
const ciudades = await searchCiudadesByRegion(5);
// Retorna: Array de ciudades de la región 5
```

#### 7.4 Crear ciudad (ADMIN)
```javascript
/**
 * Crea una nueva ciudad
 * Endpoint: POST /api/v1/ciudades
 * Acceso: ADMIN
 */
const createCiudad = async (ciudadData) => {
  try {
    const response = await apiUsuarios.post('/api/v1/ciudades', ciudadData);
    return response.data;
  } catch (error) {
    console.error('Error creando ciudad:', error);
    throw error;
  }
};

// USO:
const nuevaCiudad = await createCiudad({
  nombre: 'Santiago',
  regionId: 5
});
```

#### 7.5 Actualizar ciudad completa (ADMIN)
```javascript
/**
 * Actualiza completamente una ciudad
 * Endpoint: PUT /api/v1/ciudades/{id}
 * Acceso: ADMIN
 */
const updateCiudadFull = async (id, ciudadData) => {
  try {
    const response = await apiUsuarios.put(`/api/v1/ciudades/${id}`, ciudadData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando ciudad:', error);
    throw error;
  }
};

// USO:
const actualizada = await updateCiudadFull(10, {
  nombre: 'Gran Santiago',
  regionId: 5
});
```

#### 7.6 Actualizar ciudad parcial (ADMIN)
```javascript
/**
 * Actualiza parcialmente una ciudad
 * Endpoint: PATCH /api/v1/ciudades/{id}
 * Acceso: ADMIN
 */
const updateCiudadParcial = async (id, partialData) => {
  try {
    const response = await apiUsuarios.patch(`/api/v1/ciudades/${id}`, partialData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando ciudad:', error);
    throw error;
  }
};

// USO:
const actualizada = await updateCiudadParcial(10, {
  nombre: 'Santiago Centro'
});
```

#### 7.7 Eliminar ciudad (ADMIN)
```javascript
/**
 * Elimina una ciudad
 * Endpoint: DELETE /api/v1/ciudades/{id}
 * Acceso: ADMIN
 */
const deleteCiudad = async (id) => {
  try {
    const response = await apiUsuarios.delete(`/api/v1/ciudades/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando ciudad:', error);
    throw error;
  }
};

// USO:
await deleteCiudad(10);
```

---

## 📊 TABLA RESUMEN DE FUNCIONES

### API de Productos (19 funciones)

| # | Categoría | Función | Método | Endpoint | Acceso |
|---|-----------|---------|--------|----------|--------|
| 1 | Productos | `getAllProductos` | GET | `/api/v1/productos` | Público |
| 2 | Productos | `getProductoById` | GET | `/api/v1/productos/{id}` | Público |
| 3 | Productos | `searchProductosByPrecio` | GET | `/api/v1/productos/precio` | Público |
| 4 | Productos | `searchProductosByCategoria` | GET | `/api/v1/productos/categoria/{id}` | Público |
| 5 | Productos | `createProducto` | POST | `/api/v1/productos` | ADMIN |
| 6 | Productos | `updateProducto` | PATCH | `/api/v1/productos/{id}` | ADMIN |
| 7 | Productos | `deleteProducto` | DELETE | `/api/v1/productos/{id}` | ADMIN |
| 8 | Categorías | `getAllCategorias` | GET | `/api/v1/categorias` | Público |
| 9 | Categorías | `getCategoriaById` | GET | `/api/v1/categorias/{id}` | Público |
| 10 | Categorías | `createCategoria` | POST | `/api/v1/categorias` | ADMIN |
| 11 | Categorías | `updateCategoriaFull` | PUT | `/api/v1/categorias/{id}` | ADMIN |
| 12 | Categorías | `updateCategoriaParcial` | PATCH | `/api/v1/categorias/{id}` | ADMIN |
| 13 | Categorías | `deleteCategoria` | DELETE | `/api/v1/categorias/{id}` | ADMIN |
| 14 | Países | `getAllPaises` | GET | `/api/v1/paises` | Público |
| 15 | Países | `getPaisById` | GET | `/api/v1/paises/{id}` | Público |
| 16 | Países | `createPais` | POST | `/api/v1/paises` | ADMIN |
| 17 | Países | `updatePaisFull` | PUT | `/api/v1/paises/{id}` | ADMIN |
| 18 | Países | `updatePaisParcial` | PATCH | `/api/v1/paises/{id}` | ADMIN |
| 19 | Países | `deletePais` | DELETE | `/api/v1/paises/{id}` | ADMIN |

---

## 📈 RESUMEN TOTAL

### Por Categoría
- **Productos**: 7 funciones
- **Categorías**: 6 funciones
- **Países**: 6 funciones
- **TOTAL**: **19 funciones**

### Por Tipo de Acceso
- **Público**: 8 funciones
- **ADMIN**: 11 funciones

### Por Método HTTP
- **GET**: 8 funciones
- **POST**: 4 funciones
- **PUT**: 2 funciones
- **PATCH**: 3 funciones
- **DELETE**: 2 funciones

---

## 💡 EJEMPLOS DE USO PRÁCTICOS
- **PUT**: 7 funciones
- **PATCH**: 9 funciones
- **DELETE**: 7 funciones

---

## 💡 EJEMPLOS DE USO PRÁCTICOS

### Ejemplo 1: Cargar productos con categorías y países
```javascript
// Cargar todos los datos en paralelo
const [productos, categorias, paises] = await Promise.all([
  getAllProductos(),
  getAllCategorias(),
  getAllPaises()
]);

console.log('Productos:', productos.length);
console.log('Categorías:', categorias.length);
console.log('Países:', paises.length);
```

### Ejemplo 2: Filtrar productos por precio y categoría
```javascript
// 1. Filtrar por precio
const productosEnRango = await searchProductosByPrecio(1000, 5000);

// 2. Filtrar por categoría
const productosVerduras = await searchProductosByCategoria(1);

console.log('Productos entre $1000-$5000:', productosEnRango.length);
console.log('Productos de Verduras:', productosVerduras.length);
```

### Ejemplo 3: CRUD completo de productos (ADMIN)
```javascript
// 1. Crear producto
const producto = await createProducto({
  nombre: 'Lechuga Orgánica',
  descripcion: 'Lechuga fresca',
  precio: 1500,
  stock: 50,
  categoriaId: 1,
  paisOrigenId: 2
});

// 2. Leer/Obtener
const productoLeido = await getProductoById(producto.id);

// 3. Actualizar
const actualizado = await updateProducto(producto.id, {
  precio: 1800,
  stock: 75
});

// 4. Eliminar
await deleteProducto(producto.id);
```

### Ejemplo 4: Componente React con productos
```javascript
import { useState, useEffect } from 'react';

function ProductosComponent() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productosData, categoriasData] = await Promise.all([
          getAllProductos(),
          getAllCategorias()
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Productos</h1>
      {productos.map(producto => (
        <div key={producto.id}>{producto.nombre}</div>
      ))}
    </div>
  );
}
```

---

## 🎯 BUENAS PRÁCTICAS

### 1. Manejo de Errores
```javascript
try {
  const productos = await getAllProductos();
  // Hacer algo con productos
} catch (error) {
  if (error.response?.status === 404) {
    console.log('No se encontraron productos');
  } else if (error.response?.status === 401) {
    console.log('No autorizado - redirigir a login');
  } else {
    console.error('Error:', error);
  }
}
```

### 2. Peticiones en Paralelo
```javascript
// ✅ BUENO - Peticiones en paralelo
const [productos, categorias, paises] = await Promise.all([
  getAllProductos(),
  getAllCategorias(),
  getAllPaises()
]);

// ❌ MALO - Peticiones secuenciales
const productos = await getAllProductos();
const categorias = await getAllCategorias();
const paises = await getAllPaises();
```

### 3. Estados de Carga
```javascript
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);

const loadData = async () => {
  setLoading(true);
  try {
    const result = await getAllProductos();
    setData(result);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false); // Siempre ejecuta
  }
};
```

---

## ✅ CONCLUSIÓN

Este documento enumera **19 funciones axios** completas para la API de Productos de HuertoHogar:

- ✅ Cada función tiene su código completo
- ✅ Cada función tiene ejemplo de uso
- ✅ Todas incluyen manejo de errores
- ✅ Organizadas por categoría (Productos, Categorías, Países)
- ✅ Tabla resumen para referencia rápida
- ✅ Ejemplos de flujos completos con React

**API Base**: `https://hh-productos-backend-xcijd.ondigitalocean.app`

**¡Listo para implementar!** 🚀

