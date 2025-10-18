// Datos iniciales de órdenes/pedidos
export const ordenes = [
  {
    id: 1,
    id_usuario: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    fecha: '2025-10-15T10:30:00',
    estado: 'Pendiente',
    productos: [
      {
        id: 1,
        nombre: "Manzana Roja",
        precio: 1200,
        quantity: 3,
        imagen: "../assets/images/manzanas2.jpg"
      },
      {
        id: 4,
        nombre: "Zanahoria Orgánica",
        precio: 800,
        quantity: 2,
        imagen: "../assets/images/zanahorias.jpg"
      }
    ],
    shippingInfo: {
      fullName: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: '+56912345678',
      address: 'Av. Principal 123',
      city: 'Santiago',
      region: 'Metropolitana',
      zipCode: '8320000'
    },
    subtotal: 5200,
    envio: 3000,
    total: 8200,
    notas: ''
  },
  {
    id: 2,
    id_usuario: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    fecha: '2025-10-16T14:20:00',
    estado: 'En Proceso',
    productos: [
      {
        id: 7,
        nombre: "Miel Orgánica",
        precio: 4000,
        quantity: 1,
        imagen: "../assets/images/miel.jpg"
      }
    ],
    shippingInfo: {
      fullName: 'María González',
      email: 'maria.gonzalez@example.com',
      phone: '+56987654321',
      address: 'Calle Los Alerces 456',
      city: 'Valparaíso',
      region: 'Valparaíso',
      zipCode: '2340000'
    },
    subtotal: 4000,
    envio: 3000,
    total: 7000,
    notas: 'Entregar en horario de tarde'
  },
  {
    id: 3,
    id_usuario: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    fecha: '2025-10-17T09:15:00',
    estado: 'Completado',
    productos: [
      {
        id: 2,
        nombre: "Lechuga Orgánica",
        precio: 900,
        quantity: 5,
        imagen: "../assets/images/vegetales.jpg"
      },
      {
        id: 8,
        nombre: "Espinaca Orgánica",
        precio: 1000,
        quantity: 3,
        imagen: "../assets/images/espinacas_producto.png"
      }
    ],
    shippingInfo: {
      fullName: 'Carlos Ramírez',
      email: 'carlos.ramirez@example.com',
      phone: '+56965432109',
      address: 'Pasaje Las Flores 789',
      city: 'Concepción',
      region: 'Biobío',
      zipCode: '4030000'
    },
    subtotal: 7500,
    envio: 3000,
    total: 10500,
    notas: ''
  }
];
