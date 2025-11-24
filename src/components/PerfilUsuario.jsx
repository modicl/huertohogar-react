import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { API_URLS } from '../config/api.js';

export function PerfilUsuario() {
  const { user, token, logout } = useAuth();
  const [vistaActual, setVistaActual] = useState('resumen');
  const [ordenes, setOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);

  // Cargar órdenes del usuario
  useEffect(() => {
    const fetchOrdenes = async () => {
      if (!token) return;
      
      setLoadingOrdenes(true);
      try {
        const response = await axios.get(`${API_URLS.ordenes}/mis-ordenes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          // Ordenar por fecha descendente (más recientes primero)
          const ordenesOrdenadas = Array.isArray(response.data) 
            ? response.data.sort((a, b) => new Date(b.fechaOrden) - new Date(a.fechaOrden))
            : [];
          setOrdenes(ordenesOrdenadas);
        }
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
        if (window.M) {
          window.M.toast({ html: 'Error al cargar tus órdenes', classes: 'red' });
        }
      } finally {
        setLoadingOrdenes(false);
      }
    };

    fetchOrdenes();
  }, [token]);

  const handleLogout = () => {
    logout();
    window.location.href = '/registro';
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '70vh', paddingTop: '30px', paddingBottom: '30px' }}>
        <div className="container">
          <div className="row">
            {/* Menú lateral */}
            <div className="col s12 m3">
              <div className="card-panel" style={{ borderRadius: '15px' }}>
                <h5 style={{ fontFamily: "'Playfair Display', serif", color: "#8B4513", marginBottom: '20px' }}>
                  Mi Cuenta
                </h5>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '15px' }}>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); setVistaActual('resumen'); }}
                      style={{
                        color: vistaActual === 'resumen' ? '#2E8B57' : '#333',
                        fontWeight: vistaActual === 'resumen' ? 'bold' : 'normal',
                        fontSize: '16px',
                        display: 'block',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: vistaActual === 'resumen' ? '#f0f8f0' : 'transparent',
                        transition: 'all 0.3s'
                      }}
                    >
                      📊 Resumen
                    </a>
                  </li>
                  <li style={{ marginBottom: '15px' }}>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); setVistaActual('ordenes'); }}
                      style={{
                        color: vistaActual === 'ordenes' ? '#2E8B57' : '#333',
                        fontWeight: vistaActual === 'ordenes' ? 'bold' : 'normal',
                        fontSize: '16px',
                        display: 'block',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: vistaActual === 'ordenes' ? '#f0f8f0' : 'transparent',
                        transition: 'all 0.3s'
                      }}
                    >
                      📦 Mis Órdenes
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleLogout(); }}
                      style={{
                        color: '#d32f2f',
                        fontSize: '16px',
                        display: 'block',
                        padding: '10px',
                        borderRadius: '8px',
                        transition: 'all 0.3s'
                      }}
                    >
                      🚪 Cerrar Sesión
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="col s12 m9">
              {vistaActual === 'resumen' && (
                <div className="card-panel" style={{ borderRadius: '15px', padding: '30px' }}>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#8B4513", marginBottom: '30px' }}>
                    Bienvenido, {user.nombre || user.pnombre}!
                  </h4>
                  
                  <div className="row">
                    <div className="col s12">
                      <h6 style={{ color: '#666', marginBottom: '20px', fontSize: '18px' }}>
                        Información Personal
                      </h6>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12 m6">
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#8B4513' }}>Nombre Completo:</strong>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>
                          {user.nombre || user.pnombre} {user.sNombre || ''} {user.aPaterno || user.apaterno} {user.aMaterno || user.amaterno || ''}
                        </p>
                      </div>
                    </div>
                    <div className="col s12 m6">
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#8B4513' }}>Email:</strong>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12 m6">
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#8B4513' }}>RUT:</strong>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>
                          {user.rut}-{user.dv}
                        </p>
                      </div>
                    </div>
                    <div className="col s12 m6">
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#8B4513' }}>Fecha de Nacimiento:</strong>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>
                          {user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-CL') : 'No disponible'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12 m6">
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#8B4513' }}>Teléfono:</strong>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>{user.telefono || 'No disponible'}</p>
                      </div>
                    </div>
                    <div className="col s12 m6">
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#8B4513' }}>Región:</strong>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>Región {user.idRegion}</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12">
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#8B4513' }}>Dirección:</strong>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>{user.direccion || 'No disponible'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12 m6">
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#8B4513' }}>Rol:</strong>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>
                          <span style={{
                            backgroundColor: user.rol === 'ADMIN' ? '#4CAF50' : '#2196F3',
                            color: 'white',
                            padding: '5px 15px',
                            borderRadius: '20px',
                            fontSize: '14px'
                          }}>
                            {user.rol}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="col s12 m6">
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#8B4513' }}>ID de Usuario:</strong>
                        <p style={{ margin: '5px 0', fontSize: '16px' }}>#{user.idUsuario}</p>
                      </div>
                    </div>
                  </div>

                  <div className="divider" style={{ margin: '30px 0' }}></div>

                  <div className="row">
                    <div className="col s12">
                      <h6 style={{ color: '#666', marginBottom: '15px', fontSize: '18px' }}>
                        Resumen de actividad
                      </h6>
                      <div className="row">
                        <div className="col s12 m4">
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '20px', 
                            backgroundColor: '#f5f5f5', 
                            borderRadius: '10px',
                            marginBottom: '10px'
                          }}>
                            <h3 style={{ color: '#2E8B57', margin: '0' }}>{ordenes.length}</h3>
                            <p style={{ margin: '5px 0', color: '#666' }}>Órdenes totales</p>
                          </div>
                        </div>
                        <div className="col s12 m4">
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '20px', 
                            backgroundColor: '#f5f5f5', 
                            borderRadius: '10px',
                            marginBottom: '10px'
                          }}>
                            <h3 style={{ color: '#2E8B57', margin: '0' }}>
                              ${ordenes.reduce((sum, orden) => sum + (orden.totalOrden || 0), 0).toLocaleString('es-CL')}
                            </h3>
                            <p style={{ margin: '5px 0', color: '#666' }}>Total gastado</p>
                          </div>
                        </div>
                        <div className="col s12 m4">
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '20px', 
                            backgroundColor: '#f5f5f5', 
                            borderRadius: '10px',
                            marginBottom: '10px'
                          }}>
                            <h3 style={{ color: '#2E8B57', margin: '0' }}>
                              {ordenes.filter(o => o.estado === 'Entregado').length}
                            </h3>
                            <p style={{ margin: '5px 0', color: '#666' }}>Entregadas</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {vistaActual === 'ordenes' && (
                <div className="card-panel" style={{ borderRadius: '15px', padding: '30px' }}>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#8B4513", marginBottom: '30px' }}>
                    Mis Órdenes
                  </h4>

                  {loadingOrdenes ? (
                    <div className="center-align" style={{ padding: '40px' }}>
                      <div className="preloader-wrapper active">
                        <div className="spinner-layer spinner-green-only">
                          <div className="circle-clipper left">
                            <div className="circle"></div>
                          </div><div className="gap-patch">
                            <div className="circle"></div>
                          </div><div className="circle-clipper right">
                            <div className="circle"></div>
                          </div>
                        </div>
                      </div>
                      <p>Cargando tus órdenes...</p>
                    </div>
                  ) : ordenes.length === 0 ? (
                    <div className="center-align" style={{ padding: '40px', color: '#999' }}>
                      <i className="material-icons" style={{ fontSize: '48px', marginBottom: '10px' }}>shopping_basket</i>
                      <p>No tienes órdenes registradas aún.</p>
                    </div>
                  ) : (
                    ordenes.map((orden) => (
                      <div key={orden.idOrden} className="card" style={{ marginBottom: '20px', borderRadius: '10px' }}>
                        <div className="card-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap' }}>
                            <div>
                              <strong style={{ fontSize: '18px' }}>Orden #{orden.idOrden}</strong>
                              <p style={{ margin: '5px 0', color: '#666' }}>
                                Fecha: {orden.fechaOrden ? new Date(orden.fechaOrden).toLocaleDateString('es-CL') : 'Fecha no disponible'}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{
                                backgroundColor: orden.estado === 'Entregado' ? '#4CAF50' : '#FF9800',
                                color: 'white',
                                padding: '5px 15px',
                                borderRadius: '20px',
                                fontSize: '14px'
                              }}>
                                {orden.estado}
                              </span>
                              <p style={{ margin: '10px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2E8B57' }}>
                                Total: ${(orden.totalOrden || 0).toLocaleString('es-CL')}
                              </p>
                            </div>
                          </div>

                          <div className="divider" style={{ margin: '15px 0' }}></div>

                          <h6 style={{ marginBottom: '10px' }}>Productos:</h6>
                          <ul style={{ listStyle: 'none', padding: 0 }}>
                            {orden.detalleOrden && orden.detalleOrden.length > 0 ? (
                              orden.detalleOrden.map((detalle, index) => (
                                <li key={index} style={{ 
                                  padding: '8px 0', 
                                  borderBottom: index < orden.detalleOrden.length - 1 ? '1px solid #eee' : 'none',
                                  display: 'flex',
                                  justifyContent: 'space-between'
                                }}>
                                  <span>
                                    {detalle.producto?.nombreProducto || `Producto #${detalle.producto?.idProducto}`} (x{detalle.cantidad})
                                  </span>
                                  <span style={{ color: '#2E8B57' }}>
                                    ${((detalle.precioUnitario || 0) * detalle.cantidad).toLocaleString('es-CL')}
                                  </span>
                                </li>
                              ))
                            ) : (
                              <li style={{ color: '#999', fontStyle: 'italic' }}>No hay detalles disponibles</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
