import { Footer } from './Footer'
import { Header } from './Header'
import './Producto.css'
import { productos } from '../data/productos.jsx'
import { Link } from 'react-router-dom'

export function Producto() {
  return (
    <>
      <Header />
      <main className="container">
        <h1 className="section-title center" style={{ margin: "30px 0" }}>Nuestra Tienda</h1>

        <div className="row" id="product-list" style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center" }}>
          {productos.map(producto => (
            <div
              className="product-card"
              key={producto.id}
              style={{
                
                
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                padding: "20px",
                width: "220px",
                minHeight: "260px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "center"
              }}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginBottom: "12px",
                  borderRadius: "8px"
                }}
              />
              <h3 style={{ marginBottom: 8 }}>{producto.nombre}</h3>
              <p style={{ margin: 0 }}><strong>Categoría:</strong> {producto.categoria}</p>
              <p style={{ margin: 0 }}><strong>Nombre:</strong> {producto.nombre}</p>
              <p style={{ margin: 0 }}><strong>Precio:</strong> ${producto.precio}</p>
              <p style={{ margin: 0 }}><strong>Stock:</strong> {producto.stock}</p>
              {producto.origen && <p style={{ margin: 0 }}><strong>Origen:</strong> {producto.origen}</p>}
              <Link to={`/producto/${producto.id}`}>
                <button
                  style={{
                    marginTop: 16,
                    padding: "8px 18px",
                    borderRadius: "5px",
                    border: "none",
                    background: "#4caf50",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  Ver Detalle
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}