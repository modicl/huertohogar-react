# 🧪 Tests Unitarios - HomePage Component

## ✅ Tests Implementados

Se han creado **4 tests unitarios** para el componente `HomePage`, enfocados en verificar la funcionalidad principal y la estructura de la página de inicio.

### Test 1: Renderizado del Componente
**Descripción:** Verifica que el componente HomePage se renderiza correctamente sin errores.

**Qué verifica:**
- ✅ El componente Header está presente
- ✅ El componente Carousel está presente
- ✅ El componente Footer está presente

**Por qué es importante:** Asegura que la estructura básica del componente funciona y todos los subcomponentes se cargan correctamente.

### Test 2: Sección Tienda Online
**Descripción:** Verifica que la sección principal de "Tienda Online" muestra el contenido correcto.

**Qué verifica:**
- ✅ El título "TIENDA ONLINE" está visible
- ✅ La descripción del catálogo está presente
- ✅ El botón "Ir a la tienda" existe y tiene el href correcto

**Por qué es importante:** Esta es la sección principal de la página que guía al usuario hacia el catálogo de productos.

### Test 3: Catálogo de Productos
**Descripción:** Verifica que la sección "Nuestros productos" muestra los 6 productos destacados.

**Qué verifica:**
- ✅ El título "Nuestros productos" está visible
- ✅ Los 6 productos están presentes: Quinoa, Leche, Manzana, Naranja, Zanahorias, Pimientos
- ✅ Hay 6 botones de "Comprar"
- ✅ Los precios están correctos

**Por qué es importante:** Los productos destacados son el elemento central de la página de inicio que atrae a los usuarios.

### Test 4: Testimonios (BONUS)
**Descripción:** Verifica que la sección de testimonios muestra las 3 opiniones de clientes.

**Qué verifica:**
- ✅ El título "Testimonios" está visible
- ✅ Los 3 testimonios están presentes
- ✅ Los autores están correctos (María G., Darío Q., Carla M.)

**Por qué es importante:** Los testimonios generan confianza en nuevos usuarios.

---

## 🚀 Cómo Ejecutar los Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests con interfaz visual
```bash
npm run test:ui
```

### Ejecutar tests con cobertura de código
```bash
npm run test:coverage
```

### Ejecutar tests en modo watch (se re-ejecutan al guardar cambios)
Los tests ya corren en modo watch por defecto con `npm test`

---

## 📁 Estructura de Archivos de Testing

```
huertohogar-react/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx              # Componente a testear
│   │   └── HomePage.test.jsx         # Tests unitarios ✨
│   └── test/
│       └── setup.js                  # Configuración global de tests
├── vitest.config.js                  # Configuración de Vitest
└── package.json                      # Scripts de testing
```

---

## 🛠️ Tecnologías de Testing Utilizadas

### Vitest
- **¿Qué es?** Un framework de testing ultra-rápido compatible con Vite.
- **Por qué lo usamos:** Es nativo de Vite, rápido y tiene una API compatible con Jest.

### React Testing Library
- **¿Qué es?** Una librería para testear componentes de React.
- **Por qué lo usamos:** Se enfoca en testear el comportamiento del usuario, no la implementación interna.

### @testing-library/jest-dom
- **¿Qué es?** Matchers adicionales para mejorar la legibilidad de los tests.
- **Ejemplos:** `toBeInTheDocument()`, `toHaveTextContent()`, `toHaveAttribute()`

### JSDOM
- **¿Qué es?** Una implementación del DOM para Node.js.
- **Por qué lo usamos:** Permite simular un navegador en el entorno de testing.

---

## 📊 Resultados de los Tests

```
✓ src/components/HomePage.test.jsx (4 tests) 335ms
  ✓ HomePage Component (4 tests)
    ✓ debe renderizar el componente HomePage sin errores
    ✓ debe mostrar el título "TIENDA ONLINE" y su descripción
    ✓ debe mostrar 6 productos en la sección "Nuestros productos"
    ✓ debe mostrar la sección de testimonios con 3 testimonios

Tests  4 passed (4)
```

---

## 🎯 Buenas Prácticas Implementadas

### 1. Tests Aislados
Se usan **mocks** de los componentes hijos (Header, Footer, Carousel) para que el test se enfoque solo en HomePage.

```javascript
vi.mock('./Carousel', () => ({
  Carousel: () => <div data-testid="carousel">Carousel Mock</div>
}));
```

### 2. Wrapper con Router
Se envuelve el componente en `BrowserRouter` porque HomePage usa `react-router-dom`.

```javascript
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};
```

### 3. Tests desde la Perspectiva del Usuario
Se usan queries como `getByText` y `getByRole` que buscan elementos como lo haría un usuario.

```javascript
const botonTienda = screen.getByRole('link', { name: /Ir a la tienda/i });
```

### 4. Descripciones Claras
Cada test tiene un nombre descriptivo que explica qué verifica.

```javascript
it('debe mostrar el título "TIENDA ONLINE" y su descripción', () => {
  // ...
});
```

---

## 🔍 Cobertura de Código

Para ver la cobertura de código ejecuta:

```bash
npm run test:coverage
```

Esto generará un reporte mostrando qué porcentaje del código está cubierto por tests.

---

## 📝 Próximos Tests a Implementar

Sugerencias para expandir la suite de tests:

1. **Test de Interacción:** Verificar que al hacer clic en un producto, se navega a la página correcta.
2. **Test de Responsividad:** Verificar que ciertas secciones se ocultan en móvil (`hide-on-small-only`).
3. **Test de Imágenes:** Verificar que todas las imágenes tienen el atributo `alt` correcto.
4. **Test de Integración:** Verificar la interacción entre HomePage y el Header (ej: carrito).

---

## 🎉 Resumen

✅ **4 tests unitarios** creados y funcionando
✅ **100% de éxito** en todos los tests
✅ **Configuración completa** de Vitest y React Testing Library
✅ **Scripts npm** listos para usar
✅ **Buenas prácticas** de testing implementadas

¡El componente HomePage está ahora testeado y listo para producción! 🚀
