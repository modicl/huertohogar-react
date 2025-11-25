import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Header } from './Header';
import { Footer } from './Footer';
import { API_URLS } from '../config/api';
import { useAuth } from '../context/AuthContext';

export function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Estados para comentarios
  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState({
    comentario: '',
    estrellas: 5
  });

  // Cargar producto desde la API
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URLS.productos}/${id}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        const data = await response.json();
        setProducto(data);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar el producto:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    }
  }, [id]);

  // Cargar comentarios del producto desde la API
  useEffect(() => {
    const fetchComentarios = async () => {
      if (!id) return;
      
      try {
        setLoadingComentarios(true);
        const response = await axios.get(`${API_URLS.comentarios}/${id}`);
        
        // Normalizar datos de la API y ordenar por fecha descendente
        const comentariosNormalizados = response.data
          .map(c => ({
            id: c.idComentario,
            usuario: c.usuario?.nombre || 'Usuario',
            comentario: c.comentario,
            estrellas: c.calificacion,
            fecha: c.fecha
          }))
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        setComentarios(comentariosNormalizados);
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
        // Si no hay comentarios o hay error, dejar array vacío
        setComentarios([]);
      } finally {
        setLoadingComentarios(false);
      }
    };

    fetchComentarios();
  }, [id]);  // Función para manejar envío de comentario
  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    
    // Verificar que el usuario esté autenticado
    if (!user || !token) {
      alert('Debes iniciar sesión para dejar un comentario');
      navigate('/login');
      return;
    }
    
    // Validaciones
    if (!nuevoComentario.comentario.trim()) {
      alert('Por favor escribe un comentario');
      return;
    }

    if (nuevoComentario.comentario.length > 100) {
      alert('El comentario no puede superar los 100 caracteres');
      return;
    }

    try {
      // Crear el body para el POST
      const body = {
        idProducto: parseInt(id),
        usuarioId: user.idUsuario,
        comentario: nuevoComentario.comentario.trim(),
        calificacion: nuevoComentario.estrellas,
        fecha: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
      };

      // Enviar comentario a la API
      await axios.post(API_URLS.comentarios, body, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Recargar comentarios ordenados por fecha descendente
      const response = await axios.get(`${API_URLS.comentarios}/${id}`);
      const comentariosNormalizados = response.data
        .map(c => ({
          id: c.idComentario,
          usuario: c.usuario?.nombre || 'Usuario',
          comentario: c.comentario,
          estrellas: c.calificacion,
          fecha: c.fecha
        }))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setComentarios(comentariosNormalizados);
      
      // Resetear formulario
      setNuevoComentario({
        comentario: '',
        estrellas: 5
      });
      
      // Mostrar confirmación
      alert('¡Gracias por tu opinión! Tu comentario ha sido publicado.');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      alert('Hubo un error al publicar tu comentario. Por favor intenta nuevamente.');
    }
  };

  // Función para renderizar estrellas
  const renderStars = (rating, interactive = false, onClick = null) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className="material-icons"
            onClick={() => interactive && onClick && onClick(star)}
            style={{
              color: star <= rating ? '#FFB900' : '#ddd',
              fontSize: interactive ? '28px' : '18px',
              cursor: interactive ? 'pointer' : 'default',
              transition: 'color 0.2s'
            }}
          >
            {star <= rating ? 'star' : 'star_border'}
          </i>
        ))}
      </div>
    );
  };

  // Calcular promedio de estrellas
  const promedioEstrellas = comentarios.length > 0
    ? (comentarios.reduce((sum, c) => sum + c.estrellas, 0) / comentarios.length).toFixed(1)
    : 0;


  // Función para actualizar cantidad
  const handleQuantityChange = (value) => {
    const newValue = parseInt(value) || 1;
    if (newValue >= 1 && newValue <= (producto?.stockProducto || 1)) {
      setQuantity(newValue);
    }
  };

  // Función para incrementar/decrementar
  const incrementQuantity = () => {
    if (quantity < (producto?.stockProducto || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Función para agregar al carrito
  const addToCart = () => {
    if (!producto) return;

    const currentCart = JSON.parse(localStorage.getItem('cartHuerto') || '[]');
    const existingProductIndex = currentCart.findIndex(item => {
      const itemId = item.idProducto || item.id;
      return itemId === producto.idProducto;
    });
    
    if (existingProductIndex >= 0) {
      currentCart[existingProductIndex].quantity += quantity;
    } else {
      currentCart.push({
        idProducto: producto.idProducto,
        nombreProducto: producto.nombreProducto,
        precioProducto: producto.precioProducto,
        imagenUrl: producto.imagenUrl,
        categoria: producto.categoria,
        stockProducto: producto.stockProducto,
        paisOrigen: producto.paisOrigen,
        descripcionProducto: producto.descripcionProducto,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cartHuerto', JSON.stringify(currentCart));
    alert(`Se agregaron ${quantity} unidad(es) de ${producto.nombreProducto} al carrito`);
    setQuantity(1);
  };

  // Función para comprar ahora (ir directo al checkout)
  const buyNow = () => {
    addToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#8B4513', marginBottom: '20px' }}>Cargando producto...</h2>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !producto) {
    return (
      <>
        <Header />
        <main className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#8B4513', marginBottom: '20px' }}>Producto no encontrado</h2>
            <Link to="/productos" className="btn" style={{ background: '#2E8B57' }}>
              Volver a la tienda
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container section" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '30px' }}>
          <Link to="/" style={{ color: '#2E8B57', textDecoration: 'none' }}>Inicio</Link>
          <span style={{ margin: '0 8px', color: '#999' }}>/</span>
          <Link to="/productos" style={{ color: '#2E8B57', textDecoration: 'none' }}>Productos</Link>
          <span style={{ margin: '0 8px', color: '#999' }}>/</span>
          <span style={{ color: '#666' }}>{producto.nombreProducto}</span>
        </div>

        {/* Contenedor principal del producto */}
        <div className="row" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {/* Columna izquierda - Imagen */}
          <div className="col s12 m6" style={{ padding: '40px' }}>
            <div style={{ 
              background: '#f8f8f8', 
              borderRadius: '12px', 
              padding: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}>
              <img 
                src={producto.imagenUrl} 
                alt={producto.nombreProducto} 
                style={{ 
                  width: '100%', 
                  maxWidth: '350px',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }} 
              />
            </div>
          </div>

          {/* Columna derecha - Información */}
          <div className="col s12 m6" style={{ padding: '40px' }}>
            {/* Categoría */}
            <div style={{ 
              display: 'inline-block',
              background: '#e8f5e9',
              color: '#2E8B57',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85em',
              fontWeight: '600',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {producto.categoria?.nombreCategoria}
            </div>

            {/* Nombre del producto */}
            <h1 style={{ 
              fontSize: '2.2em', 
              color: '#2E8B57', 
              marginBottom: '16px',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: '700',
              lineHeight: '1.2'
            }}>
              {producto.nombreProducto}
            </h1>

            {/* Precio */}
            <div style={{ 
              fontSize: '2em', 
              color: '#8B4513', 
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              ${producto.precioProducto?.toLocaleString('es-CL')}
            </div>

            {/* Descripción */}
            <p style={{ 
              fontSize: '1.05em', 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '24px',
              paddingBottom: '24px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              {producto.descripcionProducto}
            </p>

            {/* Información adicional */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <i className="material-icons" style={{ color: '#2E8B57', marginRight: '10px' }}>inventory_2</i>
                <span style={{ color: '#666', fontSize: '1em' }}>
                  <strong>Stock disponible:</strong> {producto.stockProducto} unidades
                </span>
              </div>
              {producto.paisOrigen?.nombre && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <i className="material-icons" style={{ color: '#2E8B57', marginRight: '10px' }}>place</i>
                  <span style={{ color: '#666', fontSize: '1em' }}>
                    <strong>Origen:</strong> {producto.paisOrigen.nombre}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="material-icons" style={{ color: '#2E8B57', marginRight: '10px' }}>local_shipping</i>
                <span style={{ color: '#666', fontSize: '1em' }}>
                  Envío a todo Chile
                </span>
              </div>
            </div>

            {/* Selector de cantidad */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '1em',
                fontWeight: '600',
                color: '#333',
                marginBottom: '12px'
              }}>
                Cantidad:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={decrementQuantity}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid #2E8B57',
                    background: '#fff',
                    color: '#2E8B57',
                    borderRadius: '6px',
                    fontSize: '1.5em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#2E8B57';
                    e.target.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#2E8B57';
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={producto.stockProducto}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  style={{
                    width: '80px',
                    height: '40px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '1.1em',
                    fontWeight: '600'
                  }}
                />
                <button
                  onClick={incrementQuantity}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid #2E8B57',
                    background: '#fff',
                    color: '#2E8B57',
                    borderRadius: '6px',
                    fontSize: '1.5em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#2E8B57';
                    e.target.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#2E8B57';
                  }}
                >
                  +
                </button>
                <span style={{ marginLeft: '10px', color: '#999', fontSize: '0.9em' }}>
                  (Máx: {producto.stockProducto})
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={addToCart}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '14px 28px',
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
                  gap: '8px',
                  transition: 'background 0.3s',
                  boxShadow: '0 2px 8px rgba(46, 139, 87, 0.3)'
                }}
                onMouseOver={(e) => e.target.style.background = '#246844'}
                onMouseOut={(e) => e.target.style.background = '#2E8B57'}
              >
                <i className="material-icons">shopping_cart</i>
                Agregar al Carrito
              </button>
              <button
                onClick={buyNow}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '14px 28px',
                  background: '#8B4513',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.05em',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.3s',
                  boxShadow: '0 2px 8px rgba(139, 69, 19, 0.3)'
                }}
                onMouseOver={(e) => e.target.style.background = '#6d3610'}
                onMouseOut={(e) => e.target.style.background = '#8B4513'}
              >
                <i className="material-icons">flash_on</i>
                Comprar Ahora
              </button>
            </div>
            {/* Información de garantía/confianza */}
            <div style={{ 
              background: '#f8f8f8', 
              padding: '16px', 
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <i className="material-icons" style={{ color: '#2E8B57', fontSize: '20px' }}>verified</i>
                <span style={{ fontSize: '0.9em', color: '#666' }}>Productos 100% frescos y orgánicos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="material-icons" style={{ color: '#2E8B57', fontSize: '20px' }}>lock</i>
                <span style={{ fontSize: '0.9em', color: '#666' }}>Compra segura garantizada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Comentarios y Valoraciones */}
        <div className="row" style={{ marginTop: '50px' }}>
          <div className="col s12">
            <div style={{ 
              background: '#fff', 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
              padding: '40px' 
            }}>
              
              {/* Encabezado de comentarios */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: '1.8em', 
                    color: '#2E8B57', 
                    marginBottom: '8px',
                    fontWeight: '700'
                  }}>
                    Opiniones de clientes
                  </h2>
                  {comentarios.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {renderStars(Math.round(promedioEstrellas))}
                      <span style={{ fontSize: '1.2em', fontWeight: '600', color: '#333' }}>
                        {promedioEstrellas}
                      </span>
                      <span style={{ color: '#999', fontSize: '0.95em' }}>
                        ({comentarios.length} {comentarios.length === 1 ? 'opinión' : 'opiniones'})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de comentarios */}
              {comentarios.length > 0 ? (
                <div style={{ marginBottom: '40px' }}>
                  {comentarios.map((comentario) => (
                    <div 
                      key={comentario.id} 
                      style={{ 
                        borderBottom: '1px solid #e0e0e0',
                        paddingBottom: '20px',
                        marginBottom: '20px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '10px',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: '#333',
                            fontSize: '1.05em',
                            marginBottom: '6px'
                          }}>
                            {comentario.usuario}
                          </div>
                          {renderStars(comentario.estrellas)}
                        </div>
                        <div style={{ 
                          color: '#999', 
                          fontSize: '0.9em' 
                        }}>
                          {new Date(comentario.fecha).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <p style={{ 
                        color: '#666', 
                        lineHeight: '1.6',
                        marginTop: '8px'
                      }}>
                        {comentario.comentario}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  background: '#f8f8f8',
                  borderRadius: '8px',
                  marginBottom: '40px'
                }}>
                  <i className="material-icons" style={{ fontSize: '48px', color: '#ccc', marginBottom: '12px' }}>
                    comment
                  </i>
                  <p style={{ color: '#999', fontSize: '1.05em' }}>
                    Aún no hay opiniones. ¡Sé el primero en comentar!
                  </p>
                </div>
              )}

              {/* Formulario para nuevo comentario */}
              <div className="comentario-form-card">
  <h4 style={{ 
    fontFamily: 'Montserrat, sans-serif',
    color: '#2E8B57',
    fontSize: '1.3em',
    marginBottom: '20px'
  }}>
    Deja tu opinión
  </h4>
  
  {user && token ? (
    <form onSubmit={handleSubmitComentario}>
      {/* Selector de estrellas */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block',
          marginBottom: '10px',
          color: '#666',
          fontSize: '0.9em'
        }}>
          Calificación *
        </label>
        <div style={{ display: 'flex', gap: '5px', fontSize: '28px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setNuevoComentario({...nuevoComentario, estrellas: star})}
              style={{
                cursor: 'pointer',
                color: star <= nuevoComentario.estrellas ? '#FFB900' : '#ddd',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#FFB900'}
              onMouseLeave={(e) => e.target.style.color = star <= nuevoComentario.estrellas ? '#FFB900' : '#ddd'}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Campo de comentario */}
      <div className="input-field">
        <i className="material-icons prefix" style={{ color: '#2E8B57' }}>comment</i>
        <textarea
          id="comentario"
          className="materialize-textarea"
          value={nuevoComentario.comentario}
          onChange={(e) => setNuevoComentario({...nuevoComentario, comentario: e.target.value})}
          maxLength="100"
          style={{ minHeight: '80px' }}
        ></textarea>
        <label htmlFor="comentario">Tu opinión</label>
        <span 
          className="helper-text" 
          style={{ 
            color: nuevoComentario.comentario.length > 90 ? '#e74c3c' : '#666' 
          }}
        >
          {nuevoComentario.comentario.length}/100 caracteres
        </span>
      </div>

      {/* Botón de enviar */}
      <button
        type="submit"
        className="btn waves-effect waves-light"
        style={{
          backgroundColor: '#2E8B57',
          width: '100%',
          marginTop: '10px'
        }}
      >
        <i className="material-icons left">send</i>
        Enviar opinión
      </button>
    </form>
  ) : (
    <div style={{
      textAlign: 'center',
      padding: '30px',
      background: '#f8f8f8',
      borderRadius: '8px'
    }}>
      <i className="material-icons" style={{ fontSize: '48px', color: '#ccc', marginBottom: '12px' }}>
        lock
      </i>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Debes iniciar sesión para dejar una opinión
      </p>
      <button
        onClick={() => navigate('/login')}
        className="btn waves-effect waves-light"
        style={{ backgroundColor: '#2E8B57' }}
      >
        Iniciar sesión
      </button>
    </div>
  )}
</div>

            </div>
          </div>
        </div>

        {/* Botón volver */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link 
            to="/productos" 
            style={{ 
              color: '#2E8B57', 
              textDecoration: 'none',
              fontSize: '1em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="material-icons">arrow_back</i>
            Volver a la tienda
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
