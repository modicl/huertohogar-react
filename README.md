# 🌱 HuertoHogar - E-commerce de Productos Orgánicos

HuertoHogar es una plataforma de comercio electrónico especializada en la venta de productos agrícolas orgánicos, frutas y verduras frescas. El proyecto proporciona una experiencia de compra completa con un sistema de gestión administrativa integrado.

## 📋 Descripción

Aplicación web moderna que conecta a productores locales de alimentos orgánicos con consumidores conscientes de la calidad y el origen de sus alimentos. Incluye funcionalidades de catálogo de productos, carrito de compras, gestión de pedidos y un panel administrativo completo.

## 🚀 Tecnologías y Frameworks

### Frontend
- **React 19.x** - Biblioteca principal para la construcción de la interfaz de usuario
- **Vite 7.1.7** - Herramienta de build y servidor de desarrollo de alto rendimiento
- **React Router 7.9.3** - Navegación y enrutamiento en la aplicación
- **Materialize CSS** - Framework CSS para diseño responsive y componentes UI
- **Bootstrap** - Componentes y utilidades CSS adicionales

### Testing
- **Vitest 3.2.4** - Framework de testing unitario y de integración
- **React Testing Library 16.3.0** - Utilidades para testing de componentes React
- **@vitest/coverage-v8** - Generación de reportes de cobertura de código

### Validación y Formularios
- **Parsley.js** - Validación de formularios del lado del cliente
- **jQuery** - Soporte para bibliotecas legacy y manipulación del DOM

### Backend (En Desarrollo)
- **Java Spring Boot** - Framework backend para API REST y lógica de negocio
- Integración con base de datos relacional
- Sistema de autenticación y autorización
- Gestión de pedidos y transacciones

## ✨ Características Principales

### Para Clientes
- Catálogo de productos orgánicos con imágenes y descripciones
- Sistema de carrito de compras con persistencia
- Proceso de checkout con validación de datos
- Generación de boletas
- Sistema de comentarios y valoraciones

### Panel Administrativo
- Dashboard con métricas y estadísticas
- Gestión completa de productos (CRUD)
- Administración de pedidos y estados
- Gestión de comentarios de clientes
- Sistema de autenticación para administradores

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/modicl/huertohogar-react.git

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Generar reporte de cobertura
npm run coverage
```

## 🧪 Testing

El proyecto cuenta con una cobertura de código del **~99%**, incluyendo:
- 230+ tests unitarios y de integración
- Tests para todos los componentes principales
- Tests del panel administrativo completo
- Reportes de cobertura visual en HTML

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con reporte de cobertura
npm run coverage

# Ver reporte de cobertura en navegador
# Abrir: coverage/index.html
```

## 📁 Estructura del Proyecto

```
src/
├── components/         # Componentes principales (públicos)
├── admin/             # Módulo administrativo
│   ├── components/    # Componentes del admin
│   └── pages/         # Páginas del admin
├── assets/            # Imágenes y recursos estáticos
├── data/              # Datos mock y configuraciones
└── test/              # Configuración de tests
```

## 🔜 Roadmap

- [ ] Integración con backend Spring Boot
- [ ] Sistema de autenticación JWT
- [ ] Pasarela de pagos
- [ ] Sistema de notificaciones
- [ ] Panel de reportes y analytics
- [ ] Aplicación móvil (futuro)

## 👥 Contribución

Este proyecto es parte de un trabajo académico. Las contribuciones son bienvenidas siguiendo las mejores prácticas de desarrollo.

