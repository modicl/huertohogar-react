import { Footer } from './Footer'
import { Header } from './Header'
import './Producto.css'
import { productos as productosEstaticos } from '../data/productos.jsx'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URLS } from '../config/api.js'

export function Producto() {
  // Estado para los productos obtenidos desde la API
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para normalizar productos de la API al formato del componente
  const normalizarProducto = (productoAPI) => {
    return {
      id: productoAPI.idProducto,
      nombre: productoAPI.nombreProducto,
      categoria: {
        id: productoAPI.categoria?.idCategoria,
        nombre: productoAPI.categoria?.nombreCategoria,
        descripcion: productoAPI.categoria?.descripcionCategoria
      },
      categoriaNombre: productoAPI.categoria?.nombreCategoria, // Para compatibilidad
      descripcion: productoAPI.descripcionProducto,
      precio: productoAPI.precioProducto,
      stock: productoAPI.stockProducto,
      origen: productoAPI.paisOrigen?.nombre || productoAPI.origen,
      imagen: productoAPI.imagenUrl,
      comentarios: productoAPI.comentarios || []
    };
  };

  // Estado para manejar las cantidades de cada producto
  const [quantities, setQuantities] = useState({});

  // Estado para las categorías obtenidas desde la API
  const [categorias, setCategorias] = useState([]);

  // Estados para los filtros
  const [filtros, setFiltros] = useState({
    categoriaId: null,
    categoriaNombre: 'todas',
    precioMin: 0,
    precioMax: 10000,
    ordenar: 'ninguno'
  });

  // Estado para mostrar/ocultar filtros en móvil
  const [showFiltros, setShowFiltros] = useState(false);

  // ============================================
  // EFECTOS - CARGA DE DATOS DESDE API
  // ============================================

  /**
   * Efecto principal: Carga inicial de productos y categorías
   * Se ejecuta una sola vez al montar el componente
   */
  useEffect(() => {
    fetchProductosYCategorias();
  }, []);

  /**
   * Función para cargar productos desde la API
   * Extrae las categorías únicas de los productos
   */
  const fetchProductosYCategorias = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Cargando productos desde la API...');
      console.log('URL de la API:', API_URLS.productos);

      // Realizar la petición GET a la API
      const response = await axios.get(API_URLS.productos, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Si la petición fue exitosa
      if (response.status === 200 && response.data) {
        console.log('✅ Productos raw desde API:', response.data);

        // Normalizar los productos de la API
        const productosNormalizados = response.data.map(normalizarProducto);
        console.log('✅ Productos normalizados:', productosNormalizados);

        setProductos(productosNormalizados);

        // Extraer categorías únicas de los productos
        const categoriasMap = new Map();
        response.data.forEach(producto => {
          if (producto.categoria && producto.categoria.idCategoria) {
            categoriasMap.set(producto.categoria.idCategoria, {
              id: producto.categoria.idCategoria,
              nombre: producto.categoria.nombreCategoria,
              descripcion: producto.categoria.descripcionCategoria
            });
          }
        });

        const categoriasNormalizadas = Array.from(categoriasMap.values());
        console.log('✅ Categorías extraídas:', categoriasNormalizadas);

        setCategorias(categoriasNormalizadas);

        // Ajustar rango de precios basado en productos reales
        if (productosNormalizados.length > 0) {
          const precios = productosNormalizados.map(p => p.precio).filter(p => p);
          const maxPrecio = Math.max(...precios);
          setFiltros(prev => ({
            ...prev,
            precioMax: Math.ceil(maxPrecio / 1000) * 1000 // Redondear al millar superior
          }));
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      console.error('Respuesta del servidor:', error.response?.data);

      let mensajeError = 'Error al cargar productos. Usando datos de respaldo.';

      if (error.response) {
        mensajeError = error.response.data?.message || error.response.data?.error || mensajeError;
      } else if (error.request) {
        mensajeError = 'No se pudo conectar con el servidor. Usando datos de respaldo.';
      }

      console.warn(mensajeError);
      setError(mensajeError);

      // En caso de error, usar productos estáticos como respaldo
      setProductos(productosEstaticos);
      setLoading(false);

      // Mostrar toast si está disponible
      if (window.M) {
        window.M.toast({
          html: mensajeError,
          classes: 'orange darken-2',
          displayLength: 4000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNCIONES DE MANEJO DE EVENTOS
  // ============================================

  // Función para actualizar cantidad de un producto
  const handleQuantityChange = (productId, value) => {
    const newValue = parseInt(value) || 1;
    setQuantities(prev => ({
      ...prev,
      [productId]: newValue
    }));
  };

  /**
   * Agrega un producto al carrito
   * Guarda en localStorage y sincroniza con el estado global del carrito
   * 
   * @param {Object} producto - Objeto producto a agregar
   */
  const addToCart = (producto) => {
    const quantity = quantities[producto.id] || 1;

    // Obtener carrito actual de localStorage
    const currentCart = JSON.parse(localStorage.getItem('cartHuerto') || '[]');

    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = currentCart.findIndex(item => item.id === producto.id);

    if (existingProductIndex >= 0) {
      // Si existe, actualizar cantidad
      currentCart[existingProductIndex].quantity += quantity;
      console.log(`📦 Actualizado producto en carrito: ${producto.nombre} (${currentCart[existingProductIndex].quantity} unidades)`);
    } else {
      // Si no existe, agregar nuevo producto
      currentCart.push({
        ...producto,
        quantity: quantity
      });
      console.log(`🛒 Agregado al carrito: ${producto.nombre} (${quantity} unidades)`);
    }

    // Guardar en localStorage
    localStorage.setItem('cartHuerto', JSON.stringify(currentCart));

    // Disparar evento personalizado para que otros componentes se actualicen
    window.dispatchEvent(new Event('cartUpdated'));

    // Mostrar confirmación
    alert(`✅ Se agregaron ${quantity} unidad(es) de ${producto.nombre} al carrito`);

    // Resetear cantidad a 1
    setQuantities(prev => ({
      ...prev,
      [producto.id]: 1
    }));
  };

  /**
   * Maneja el cambio de categoría
   * Puede usar filtrado de API o filtrado local según configuración
   * 
   * @param {string} categoriaId - ID de la categoría seleccionada
   * @param {string} categoriaNombre - Nombre de la categoría para UI
   */
  const handleCategoriaChange = (categoriaId, categoriaNombre) => {
    console.log('📂 Cambio de categoría:', categoriaNombre, categoriaId);

    setFiltros(prev => ({
      ...prev,
      categoriaId: categoriaId,
      categoriaNombre: categoriaNombre
    }));
  };

  /**
   * Aplica filtro de precio (filtrado local, no requiere API)
   * Se activa con un botón para evitar múltiples llamadas
   */
  const aplicarFiltroPrecio = () => {
    console.log(`💰 Aplicando filtro de precio: $${filtros.precioMin} - $${filtros.precioMax}`);
    // El filtrado se hace automáticamente en productosFiltrados
    // Esta función solo sirve para dar feedback al usuario
  };

  /**
   * Resetea todos los filtros y recarga los productos
   */
  const resetFiltros = () => {
    console.log('🔄 Reseteando filtros...');

    setFiltros({
      categoriaId: null,
      categoriaNombre: 'todas',
      precioMin: 0,
      precioMax: 50000,
      ordenar: 'ninguno'
    });

    // Recargar todos los productos
    fetchProductosYCategorias();
  };

  // ============================================
  // FILTRADO Y ORDENAMIENTO LOCAL
  // ============================================

  /**
   * Filtra y ordena productos localmente
   */
  const productosFiltrados = productos
    .filter(producto => {
      // Filtrar por categoría
      if (filtros.categoriaId && producto.categoria?.id !== filtros.categoriaId) {
        console.log('Producto filtrado por categoría:', producto.nombre, 'categoria:', producto.categoria?.id, 'filtro:', filtros.categoriaId);
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
  console.log('Productos totales:', productos.length);
  console.log('Productos filtrados:', productosFiltrados.length);
  if (productos.length > 0) {
    console.log('Ejemplo de producto:', productos[0]);
  }

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
        <h1 className="section-title center" style={{ margin: "0 0 30px 0", color: '#2E8B57' }}>
          
        </h1>

        {/* Mostrar estado de carga */}
        {loading && (
          <div className="center" style={{ padding: '60px 20px' }}>
            <div className="preloader-wrapper big active">
              <div className="spinner-layer spinner-green-only">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div>
                <div className="gap-patch">
                  <div className="circle"></div>
                </div>
                <div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>
            <p style={{ marginTop: '20px', fontSize: '1.2em', color: '#666' }}>
              Cargando productos...
            </p>
          </div>
        )}

        {/* Mostrar error si existe (pero aún así mostrar productos de respaldo) */}
        {error && !loading && (
          <div className="center" style={{
            padding: '15px 20px',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#856404'
          }}>
            <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
              warning
            </i>
            {error}
          </div>
        )}

        {/* Contenido principal (solo mostrar cuando no está cargando) */}
        {!loading && (
          <>
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

                {/* Filtro por Categoría - INTEGRADO CON API */}
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
                    {/* Opción "Todas" */}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 12px',
                        background: filtros.categoriaNombre === 'todas' ? '#e8f5e9' : '#fff',
                        border: `2px solid ${filtros.categoriaNombre === 'todas' ? '#2E8B57' : '#e0e0e0'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.95em',
                        fontWeight: filtros.categoriaNombre === 'todas' ? '600' : '400',
                        color: filtros.categoriaNombre === 'todas' ? '#2E8B57' : '#333'
                      }}
                      onMouseEnter={(e) => {
                        if (filtros.categoriaNombre !== 'todas') {
                          e.currentTarget.style.background = '#f5f5f5';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (filtros.categoriaNombre !== 'todas') {
                          e.currentTarget.style.background = '#fff';
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="categoria"
                        checked={filtros.categoriaNombre === 'todas'}
                        onChange={() => handleCategoriaChange(null, 'todas')}
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                      />
                      Todas las categorías
                    </label>

                    {/* Categorías desde la API */}
                    {categorias.map(cat => (
                      <label
                        key={cat.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: filtros.categoriaId === cat.id ? '#e8f5e9' : '#fff',
                          border: `2px solid ${filtros.categoriaId === cat.id ? '#2E8B57' : '#e0e0e0'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.95em',
                          fontWeight: filtros.categoriaId === cat.id ? '600' : '400',
                          color: filtros.categoriaId === cat.id ? '#2E8B57' : '#333'
                        }}
                        onMouseEnter={(e) => {
                          if (filtros.categoriaId !== cat.id) {
                            e.currentTarget.style.background = '#f5f5f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (filtros.categoriaId !== cat.id) {
                            e.currentTarget.style.background = '#fff';
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name="categoria"
                          checked={filtros.categoriaId === cat.id}
                          onChange={() => handleCategoriaChange(cat.id, cat.nombre)}
                          style={{ marginRight: '10px', cursor: 'pointer' }}
                        />
                        {cat.nombre}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filtro por Rango de Precio - CON BOTÓN APLICAR */}
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
                      max="50000"
                      step="1000"
                      value={filtros.precioMin}
                      onChange={(e) => setFiltros({ ...filtros, precioMin: parseInt(e.target.value) })}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.85em', color: '#666', display: 'block', marginBottom: '5px' }}>
                      Precio Máximo: ${filtros.precioMax.toLocaleString('es-CL')}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={filtros.precioMax}
                      onChange={(e) => setFiltros({ ...filtros, precioMax: parseInt(e.target.value) })}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Botón para aplicar filtro de precio via API */}
                  <button
                    onClick={aplicarFiltroPrecio}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#FF8C00',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9em',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'background 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#e67e00'}
                    onMouseOut={(e) => e.target.style.background = '#FF8C00'}
                  >
                    <i className="material-icons" style={{ fontSize: '18px' }}>search</i>
                    Buscar por Precio
                  </button>
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
                      { value: 'precio-asc', label: 'Precio: Menor a Mayor' },
                      { value: 'precio-desc', label: 'Precio: Mayor a Menor' }
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
                    {productosFiltrados.map((producto, index) => (
                      <div
                        className="product-card"
                        key={producto.id || `producto-${index}`}
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
                        {/* Imagen del producto - Con fallback y botón hover */}
                        <div
                          style={{
                            position: "relative",
                            width: "120px",
                            height: "120px",
                            marginBottom: "16px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            group: "image"
                          }}
                        >
                          <img
                            src={producto.imagenUrl || producto.imagen || '/placeholder.jpg'}
                            alt={producto.nombre}
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px"
                            }}
                          />
                          {/* Overlay con botón Ver Detalle */}
                          <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none' }}>
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: "rgba(46, 139, 87, 0.9)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                                borderRadius: "8px",
                                cursor: "pointer"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "1";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "0";
                              }}
                              className="image-overlay"
                            >
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#fff",
                                fontWeight: "500",
                                fontSize: "0.9em"
                              }}>
                                <i className="material-icons" style={{ fontSize: "20px" }}>visibility</i>
                                Ver Detalle
                              </div>
                            </div>
                          </Link>
                        </div>

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

                        {/* Categoría - Desde API */}
                        <p style={{ margin: "4px 0", fontSize: "0.9em", color: "#666" }}>
                          <strong>Categoría:</strong> {producto.categoria?.nombre || producto.categoriaNombre || 'Sin categoría'}
                        </p>

                        {/* Precio */}
                        <p style={{ margin: "4px 0", fontSize: "1.1em", color: "#8B4513", fontWeight: "bold" }}>
                          ${(producto.precio || 0).toLocaleString('es-CL')}
                        </p>

                        {/* Selector de cantidad - Más compacto */}
                        <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                          <label htmlFor={`quantity-${producto.id}`} style={{ fontSize: "0.85em", fontWeight: "500", color: "#555" }}>
                            Cantidad:
                          </label>
                          <input
                            id={`quantity-${producto.id}`}
                            type="number"
                            min="1"
                            max={producto.stock || 99}
                            value={quantities[producto.id] || 0}
                            onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                            style={{
                              width: "35px",
                              height: "20px",
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
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}