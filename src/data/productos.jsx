

import manzanas2 from '../assets/images/manzanas2.jpg';
import lechuga from '../assets/images/lechuga_organica.png'
import vegetales from '../assets/images/vegetales.jpg';
import leche from '../assets/images/leche.jpg';
import zanahorias from '../assets/images/zanahorias.jpg';
import miel from '../assets/images/miel.jpg';
import espinacas from '../assets/images/espinacas_producto.png';
import platano from '../assets/images/platano.jpg';
import quinoa from '../assets/images/quinoa.jpg';

export const productos = [
  {
    id: 1,
    nombre: "Manzana Roja",
    categoria: "Frutas",
    descripcion: "Manzanas frescas y jugosas, ideales para snacks.",
    precio: 1200,
    stock: 50,
    origen: "Chile",
    imagen: manzanas2,
    comentarios: [
      {
        id: 1,
        usuario: "María López",
        comentario: "Excelentes manzanas, muy frescas y dulces. Las recomiendo totalmente.",
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
  },
  {
    id: 2,
    nombre: "Lechuga Orgánica",
    categoria: "Verduras",
    descripcion: "Lechuga cultivada sin pesticidas.",
    precio: 900,
    stock: 30,
    origen: "Chile",
    imagen: lechuga,
    comentarios: []
  },
  {
    id: 3,
    nombre: "Yogur Natural",
    categoria: "Lacteos",
    descripcion: "Yogur artesanal sin azúcar añadido.",
    precio: 1500,
    stock: 20,
    origen: "Chile",
    imagen: leche,
    comentarios: []
  },
  {
    id: 4,
    nombre: "Zanahoria Orgánica",
    categoria: "Verduras",
    descripcion: "Zanahorias dulces y crocantes.",
    precio: 800,
    stock: 40,
    origen: "Chile",
    imagen: zanahorias,
    comentarios: []
  },
  {
    id: 5,
    nombre: "Palta Hass",
    categoria: "Frutas",
    descripcion: "Paltas cremosas de la mejor calidad.",
    precio: 2500,
    stock: 25,
    origen: "Chile",
    imagen: vegetales,
    comentarios: []
  },
  {
    id: 6,
    nombre: "Queso Fresco",
    categoria: "Lacteos",
    descripcion: "Queso fresco artesanal.",
    precio: 3200,
    stock: 15,
    origen: "Chile",
    imagen: leche,
    comentarios: []
  },
  {
    id: 7,
    nombre: "Miel Orgánica",
    categoria: "Organicos",
    descripcion: "Miel pura de abejas, sin aditivos.",
    precio: 4000,
    stock: 10,
    origen: "Chile",
    imagen: miel,
    comentarios: []
  },
  {
    id: 8,
    nombre: "Espinaca Orgánica",
    categoria: "Verduras",
    descripcion: "Espinaca fresca y lista para ensaladas.",
    precio: 1000,
    stock: 35,
    origen: "Chile",
    imagen: espinacas,
    comentarios: []
  },
  {
    id: 9,
    nombre: "Plátano",
    categoria: "Frutas",
    descripcion: "Plátanos dulces y energéticos.",
    precio: 1100,
    stock: 45,
    origen: "Ecuador",
    imagen: platano,
    comentarios: []
  },
  {
    id: 10,
    nombre: "Aceite de Oliva Orgánico",
    categoria: "Organicos",
    descripcion: "Aceite de oliva extra virgen.",
    precio: 5500,
    stock: 12,
    origen: "Chile",
    imagen: quinoa,
    comentarios: []
  }
];