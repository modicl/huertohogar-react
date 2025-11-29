# Pruebas Unitarias - Resumen de Implementación

## Fecha: 29 de Noviembre de 2025

### Descripción General
Se implementaron pruebas unitarias siguiendo la estructura **AAA (Arrange-Act-Assert)** para:
1. API de usuarios (endpoints de autenticación y CRUD)
2. Componente AdminLogin (mensaje de logueo exitoso y flujos de autenticación)

---

## 1. Pruebas de API (src/config/api.test.js)

### Total de Pruebas: 22 ✅

#### Autenticación (POST /authenticate) - 5 pruebas
- ✅ Autenticación exitosa de usuario ADMIN
- ✅ Autenticación exitosa de usuario USER
- ✅ Rechazo de credenciales incorrectas (401)
- ✅ Rechazo de acceso no autorizado (403)
- ✅ Manejo de errores de conexión

#### Obtener Usuarios (GET /usuarios) - 3 pruebas
- ✅ Obtención exitosa de lista de usuarios
- ✅ Rechazo de petición sin token (401)
- ✅ Retorno de array vacío cuando no hay usuarios

#### Crear Usuario (POST /usuarios) - 3 pruebas
- ✅ Creación exitosa de nuevo usuario
- ✅ Rechazo de email duplicado (400)
- ✅ Rechazo de datos incompletos (400)

#### Actualizar Usuario (PATCH /usuarios/:id) - 4 pruebas
- ✅ Actualización exitosa de usuario existente
- ✅ Actualización opcional de contraseña
- ✅ Rechazo sin autenticación (401)
- ✅ Rechazo de usuario inexistente (404)

#### Eliminar Usuario (DELETE /usuarios/:id) - 4 pruebas
- ✅ Eliminación exitosa de usuario
- ✅ Rechazo sin autenticación (401)
- ✅ Rechazo de usuario inexistente (404)
- ✅ Manejo de errores del servidor (500)

#### Validación de URLs - 3 pruebas
- ✅ URLs de usuarios configuradas
- ✅ Formato correcto para endpoint authenticate
- ✅ Todas las URLs de API configuradas

---

## 2. Pruebas de AdminLogin (src/admin/pages/AdminLogin.test.jsx)

### Total de Pruebas: 22 ✅

#### Renderizado Inicial - 8 pruebas
- ✅ Renderizado correcto del componente
- ✅ Muestra el logo de HuertoHogar
- ✅ Campos de email y password presentes
- ✅ Botón de iniciar sesión presente
- ✅ Enlace para volver al sitio
- ✅ Campos vacíos inicialmente
- ✅ Campos requeridos configurados
- ✅ Sin errores iniciales

#### Login Exitoso - Usuario ADMIN - 4 pruebas
- ✅ **Inicio de sesión exitoso y navegación al panel** (mensaje de logueo exitoso)
- ✅ Almacenamiento correcto en localStorage
- ✅ Estado de carga durante el login
- ✅ Deshabilitación del botón durante el proceso

#### Validación de Rol ADMIN - 2 pruebas
- ✅ **Rechazo de usuario con rol USER y mensaje de error**
- ✅ Permiso solo a usuarios con rol ADMIN

#### Mensajes de Error (Estructura AAA) - 4 pruebas
- ✅ Mensaje de error para credenciales incorrectas (401)
- ✅ Mensaje de error para acceso denegado (403)
- ✅ Mensaje de error de conexión
- ✅ Limpieza de mensaje de error al reintentar

#### Interacción del Formulario - 3 pruebas
- ✅ Escritura en campo de email
- ✅ Escritura en campo de password
- ✅ Envío de formulario con Enter

#### Integración con AuthContext - 1 prueba
- ✅ Campos de compatibilidad (pnombre, apaterno)

---

## Estructura AAA Implementada

Todas las pruebas siguen el patrón AAA:

```javascript
it('descripción del test', async () => {
  // Arrange - Preparar
  const mockData = { ... };
  const user = userEvent.setup();

  // Act - Actuar
  await user.type(input, 'valor');
  await user.click(button);

  // Assert - Afirmar
  expect(result).toBe(expected);
});
```

---

## Tecnologías y Herramientas Utilizadas

- **Vitest**: Framework de testing
- **@testing-library/react**: Testing de componentes React
- **@testing-library/user-event**: Simulación de interacciones de usuario
- **axios** (mocked): Cliente HTTP para API
- **vi.mock()**: Sistema de mocks de Vitest

---

## Resultados de Ejecución

```bash
npm test -- src/config/api.test.js src/admin/pages/AdminLogin.test.jsx --run

✓ src/config/api.test.js (22 tests) 13ms
✓ src/admin/pages/AdminLogin.test.jsx (22 tests) 8095ms

Test Files  2 passed (2)
Tests  44 passed (44)
```

---

## Aspectos Destacados

### 1. Mensaje de Logueo Exitoso
- Prueba específica para verificar que un usuario ADMIN puede iniciar sesión exitosamente
- Valida la navegación automática al panel de administración
- Verifica el almacenamiento correcto del token y datos de usuario

### 2. Validación de Roles
- Prueba que solo usuarios con rol 'ADMIN' pueden acceder
- Usuarios con rol 'USER' reciben mensaje de error apropiado
- No se permite la navegación ni almacenamiento de credenciales incorrectas

### 3. Cobertura de Errores
- Estados HTTP: 200, 201, 400, 401, 403, 404, 500
- Errores de red (Network Error)
- Mensajes de error personalizados según el código de respuesta

### 4. Mocks Apropiados
- localStorage mockeado para pruebas aisladas
- axios mockeado para simular respuestas de API
- navigate mockeado para verificar navegación

---

## Archivos Creados

1. `src/config/api.test.js` - Pruebas de API de usuarios
2. `src/admin/pages/AdminLogin.test.jsx` - Pruebas de componente AdminLogin (actualizado)

---

## Comandos para Ejecutar las Pruebas

```bash
# Ejecutar solo las pruebas nuevas
npm test -- src/config/api.test.js src/admin/pages/AdminLogin.test.jsx --run

# Ejecutar todas las pruebas del proyecto
npm test -- --run

# Ejecutar con cobertura
npm run coverage
```

---

## Notas Adicionales

- Todas las pruebas siguen las convenciones del proyecto existente
- Se reutiliza la estructura AAA vista en archivos como `Producto.test.jsx`
- Los mocks incluyen casos de éxito y error para pruebas completas
- Se valida tanto el comportamiento del frontend como la integración con la API

---

**Estado Final**: ✅ 44/44 pruebas pasando correctamente
