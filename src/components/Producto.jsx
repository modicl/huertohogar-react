import { Footer } from './Footer'
import { Header } from './Header'
import './Producto.css'
import { productos } from '../data/productos.jsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export function Producto() {
  // Estado para manejar las cantidades de cada producto
  const [quantities, setQuantities] = useState({});
  
  // Estados para los filtros
  const [filtros, setFiltros] = useState({
    categoria: 'todas',
    precioMin: 0,
    precioMax: 10000,
    ordenar: 'ninguno'
  });

  // Estado para mostrar/ocultar filtros en móvil
  const [showFiltros, setShowFiltros] = useState(false);

  // Obtener categorías únicas
  const categorias = ['todas', ...new Set(productos.map(p => p.categoria))];

  // Función para actualizar cantidad de un producto
  const handleQuantityChange = (productId, value) => {
    const newValue = parseInt(value) || 1;
    setQuantities(prev => ({
      ...prev,
      [productId]: newValue
    }));
  };

  // Función para agregar producto al carrito
  const addToCart = (producto) => {
    const quantity = quantities[producto.id] || 1;
    
    // Obtener carrito actual de localStorage
    const currentCart = JSON.parse(localStorage.getItem('cartHuerto') || '[]');
    
    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = currentCart.findIndex(item => item.id === producto.id);
    
    if (existingProductIndex >= 0) {
      // Si existe, actualizar cantidad
      currentCart[existingProductIndex].quantity += quantity;
    } else {
      // Si no existe, agregar nuevo producto
      currentCart.push({
        ...producto,
        quantity: quantity
      });
    }
    
    // Guardar en localStorage
    localStorage.setItem('cartHuerto', JSON.stringify(currentCart));
    
    // Mostrar confirmación
    alert(`Se agregaron ${quantity} unidad(es) de ${producto.nombre} al carrito`);
    
    // Resetear cantidad a 1
    setQuantities(prev => ({
      ...prev,
      [producto.id]: 1
    }));
  };

  // Función para filtrar y ordenar productos
  const productosFiltrados = productos
    .filter(producto => {
      // Filtrar por categoría
      if (filtros.categoria !== 'todas' && producto.categoria !== filtros.categoria) {
        return false;
      }
      
      // Filtrar por precio
      if (producto.precio < filtros.precioMin || producto.precio > filtros.precioMax) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenar según selección
      switch (filtros.ordenar) {
        case 'precio-asc':
          return a.precio - b.precio;
        case 'precio-desc':
          return b.precio - a.precio;
        case 'nombre-asc':
          return a.nombre.localeCompare(b.nombre);
        case 'nombre-desc':
          return b.nombre.localeCompare(a.nombre);
        default:
          return 0;
      }
    });

  // Log para debug
  console.log('Filtros actuales:', filtros);
  console.log('Productos filtrados:', productosFiltrados.length);

  // Función para resetear filtros
  const resetFiltros = () => {
    setFiltros({
      categoria: 'todas',
      precioMin: 0,
      precioMax: 10000,
      ordenar: 'ninguno'
    });
  };

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
        <h1 className="section-title center" style={{ margin: "0 0 30px 0", color: '#2E8B57' }}>
          Nuestra Tienda
        </h1>

        {/* Botón para mostrar filtros en móvil */}
        <div 
          className="filtros-mobile-button"
          style={{
            display: 'none',
            marginBottom: '20px'
          }}
        >
          <button
            onClick={() => setShowFiltros(!showFiltros)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: '#2E8B57',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.05em',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 2px 8px rgba(46, 139, 87, 0.3)',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#246844'}
            onMouseOut={(e) => e.target.style.background = '#2E8B57'}
          >
            <i className="material-icons">
              {showFiltros ? 'expand_less' : 'tune'}
            </i>
            {showFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            <span style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.9em'
            }}>
              {productosFiltrados.length} productos
            </span>
          </button>
        </div>

        <div className="productos-layout">
          {/* Sidebar de Filtros */}
          <div 
            className={`filtros-sidebar ${showFiltros ? 'show-mobile' : 'hide-mobile'}`}
            style={{
              width: '280px',
              flexShrink: 0,
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              padding: '25px',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '2px solid #2E8B57'
            }}>
              <h3 style={{ 
                margin: 0,
                fontSize: '1.4em',
                color: '#2E8B57',
                fontWeight: '700'
              }}>
                <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '28px' }}>
                  filter_list
                </i>
                Filtros
              </h3>
            </div>

            {/* Filtro por Categoría */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '1em',
                fontWeight: '600',
                color: '#333',
                marginBottom: '10px'
              }}>
                <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '5px', fontSize: '18px', color: '#2E8B57' }}>
                  category
                </i>
                Categoría
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categorias.map(cat => (
                  <label
                    key={cat}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: filtros.categoria === cat ? '#e8f5e9' : '#fff',
                      border: `2px solid ${filtros.categoria === cat ? '#2E8B57' : '#e0e0e0'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '0.95em',
                      fontWeight: filtros.categoria === cat ? '600' : '400',
                      color: filtros.categoria === cat ? '#2E8B57' : '#333'
                    }}
                    onMouseEnter={(e) => {
                      if (filtros.categoria !== cat) {
                        e.currentTarget.style.background = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filtros.categoria !== cat) {
                        e.currentTarget.style.background = '#fff';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="categoria"
                      value={cat}
                      checked={filtros.categoria === cat}
                      onChange={(e) => {
                        console.log('Categoría seleccionada:', e.target.value);
                        setFiltros({ ...filtros, categoria: e.target.value });
                      }}
                      style={{ marginRight: '10px', cursor: 'pointer' }}
                    />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Rango de Precio */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '1em',
                fontWeight: '600',
                color: '#333',
                marginBottom: '10px'
              }}>
                <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '5px', fontSize: '18px', color: '#2E8B57' }}>
                  attach_money
                </i>
                Rango de Precio
              </label>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.85em', color: '#666', display: 'block', marginBottom: '5px' }}>
                  Precio Mínimo: ${filtros.precioMin.toLocaleString('es-CL')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={filtros.precioMin}
                  onChange={(e) => setFiltros({ ...filtros, precioMin: parseInt(e.target.value) })}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85em', color: '#666', display: 'block', marginBottom: '5px' }}>
                  Precio Máximo: ${filtros.precioMax.toLocaleString('es-CL')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={filtros.precioMax}
                  onChange={(e) => setFiltros({ ...filtros, precioMax: parseInt(e.target.value) })}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Ordenar por */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '1em',
                fontWeight: '600',
                color: '#333',
                marginBottom: '10px'
              }}>
                <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '5px', fontSize: '18px', color: '#2E8B57' }}>
                  sort
                </i>
                Ordenar por
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { value: 'ninguno', label: 'Sin ordenar' },
                  { value: 'precio-asc', label: 'Precio: Menor a Mayor' },
                  { value: 'precio-desc', label: 'Precio: Mayor a Menor' },
                  { value: 'nombre-asc', label: 'Nombre: A-Z' },
                  { value: 'nombre-desc', label: 'Nombre: Z-A' }
                ].map(opcion => (
                  <label
                    key={opcion.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: filtros.ordenar === opcion.value ? '#e8f5e9' : '#fff',
                      border: `2px solid ${filtros.ordenar === opcion.value ? '#2E8B57' : '#e0e0e0'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '0.9em',
                      fontWeight: filtros.ordenar === opcion.value ? '600' : '400',
                      color: filtros.ordenar === opcion.value ? '#2E8B57' : '#333'
                    }}
                    onMouseEnter={(e) => {
                      if (filtros.ordenar !== opcion.value) {
                        e.currentTarget.style.background = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filtros.ordenar !== opcion.value) {
                        e.currentTarget.style.background = '#fff';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="ordenar"
                      value={opcion.value}
                      checked={filtros.ordenar === opcion.value}
                      onChange={(e) => {
                        console.log('Orden seleccionado:', e.target.value);
                        setFiltros({ ...filtros, ordenar: e.target.value });
                      }}
                      style={{ marginRight: '10px', cursor: 'pointer' }}
                    />
                    {opcion.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Botón para resetear filtros */}
            <button
              onClick={resetFiltros}
              style={{
                width: '100%',
                padding: '12px',
                background: '#8B4513',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.95em',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = '#6d3610'}
              onMouseOut={(e) => e.target.style.background = '#8B4513'}
            >
              <i className="material-icons" style={{ fontSize: '18px' }}>refresh</i>
              Limpiar Filtros
            </button>

            {/* Contador de resultados */}
            <div style={{
              marginTop: '20px',
              padding: '12px',
              background: '#f8f8f8',
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '0.9em',
              color: '#666'
            }}>
              <strong style={{ color: '#2E8B57', fontSize: '1.2em' }}>
                {productosFiltrados.length}
              </strong>
              {' '}producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Grid de Productos */}
          <div style={{ flex: 1 }}>
            {productosFiltrados.length > 0 ? (
              <div 
                className="productos-grid"
                style={{ 
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "24px"
                }}
              >
                {productosFiltrados.map(producto => (
                  <div
                    className="product-card"
                    key={producto.id}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "10px",
                      padding: "20px",
                      minHeight: "380px",
                      background: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "center",
                      transition: "transform 0.3s, box-shadow 0.3s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                    }}
                  >
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        marginBottom: "16px",
                        borderRadius: "8px"
                      }}
                    />
                    
                    {/* Nombre del producto - Destacado */}
                    <h3 style={{ 
                      marginBottom: "12px", 
                      fontSize: "1.4em",
                      color: "#2E8B57",
                      fontWeight: "600",
                      fontFamily: "'Montserrat', sans-serif"
                    }}>
                      {producto.nombre}
                    </h3>
                    
                    <p style={{ margin: "4px 0", fontSize: "0.9em", color: "#666" }}>
                      <strong>Categoría:</strong> {producto.categoria}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "1.1em", color: "#8B4513", fontWeight: "bold" }}>
                      ${producto.precio.toLocaleString('es-CL')}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "0.85em", color: "#666" }}>
                      Stock: {producto.stock} unidades
                    </p>
                    {producto.origen && (
                      <p style={{ margin: "4px 0", fontSize: "0.85em", color: "#666" }}>
                        <strong>Origen:</strong> {producto.origen}
                      </p>
                    )}
                    
                    {/* Selector de cantidad - Más compacto */}
                    <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                      <label htmlFor={`quantity-${producto.id}`} style={{ fontSize: "0.85em", fontWeight: "500", color: "#555" }}>
                        Cantidad:
                      </label>
                      <input
                        id={`quantity-${producto.id}`}
                        type="number"
                        min="1"
                        max={producto.stock}
                        value={quantities[producto.id] || 1}
                        onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                        style={{
                          width: "50px",
                          padding: "4px 6px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          textAlign: "center",
                          fontSize: "0.9em"
                        }}
                      />
                    </div>

                    {/* Botones de acción */}
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                      <button
                        onClick={() => addToCart(producto)}
                        style={{
                          padding: "8px 18px",
                          borderRadius: "5px",
                          border: "none",
                          background: "#2E8B57",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: "500",
                          transition: "background 0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#246844"}
                        onMouseOut={(e) => e.target.style.background = "#2E8B57"}
                      >
                        🛒 Agregar al Carrito
                      </button>
                      <Link to={`/producto/${producto.id}`}>
                        <button
                          style={{
                            padding: "8px 18px",
                            borderRadius: "5px",
                            border: "1px solid #2E8B57",
                            background: "#fff",
                            color: "#2E8B57",
                            cursor: "pointer",
                            fontWeight: "500",
                            transition: "all 0.3s"
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = "#2E8B57";
                            e.target.style.color = "#fff";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = "#fff";
                            e.target.style.color = "#2E8B57";
                          }}
                        >
                          Ver Detalle
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#f8f8f8',
                borderRadius: '12px'
              }}>
                <i className="material-icons" style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }}>
                  search_off
                </i>
                <h3 style={{ color: '#666', marginBottom: '10px' }}>
                  No se encontraron productos
                </h3>
                <p style={{ color: '#999', marginBottom: '20px' }}>
                  Intenta ajustar los filtros para ver más resultados
                </p>
                <button
                  onClick={resetFiltros}
                  style={{
                    padding: '10px 24px',
                    background: '#2E8B57',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}