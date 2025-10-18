import React from 'react';
import { useParams } from 'react-router-dom';
import { productos } from '../data/productos.jsx';
import { Header } from './Header';
import { Footer } from './Footer';

export function DetalleProducto() {
  const { id } = useParams();
  const producto = productos.find(p => p.id === Number(id));

  if (!producto) {
    return (
      <>
        <Header />
        <main className="container">
          <h2>Producto no encontrado</h2>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
        <main className="container section">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', maxWidth: 500, margin: '0 auto' }}>
            <div className="card-image" style={{ marginBottom:100 }}>
            <img src={producto.imagen} alt={producto.nombre} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: 8 }} />
            </div>
            <div className="card-content">
            <span className="card-title">{producto.nombre}</span>
            <p><strong>Categoría:</strong> {producto.categoria}</p>
            <p><strong>Descripción:</strong> {producto.descripcion}</p>
            <p><strong>Precio:</strong> ${producto.precio}</p>
            <p><strong>Stock:</strong> {producto.stock}</p>
            {producto.origen && <p><strong>Origen:</strong> {producto.origen}</p>}
            </div>
            <div className="card-action" style={{ marginTop: 20 }}>
            <button className="btn green">Añadir al carrito</button>
            </div>
        </div>
        </main>
      <Footer />
    </>
  );
}
