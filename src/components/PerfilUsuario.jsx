import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from './Header';
import { Footer } from './Footer';
import axios from 'axios';

export function PerfilUsuario() {
  const { user, logout } = useAuth();
  const [vistaActual, setVistaActual] = useState('resumen');
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch de órdenes
  useEffect(() => {
    const fetchOrdenes = async () => {
      if (vistaActual === 'ordenes') {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('https://hh-ordenes-backend-barnt.ondigitalocean.app/api/v1/ordenes/mis-ordenes', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setOrdenes(response.data);
        } catch (err) {
          console.error('Error al obtener órdenes:', err);
          setError('No se pudieron cargar tus órdenes. Por favor intenta más tarde.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrdenes();
  }, [vistaActual]);

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
                </div>
              )}

              {vistaActual === 'ordenes' && (
                <div className="card-panel" style={{ borderRadius: '15px', padding: '30px' }}>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#8B4513", marginBottom: '30px' }}>
                    Mis Órdenes
                  </h4>

                  {loading && (
                    <div className="center-align">
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
                    </div>
                  )}

                  {error && (
                    <div className="card-panel red lighten-4 red-text text-darken-4">
                      {error}
                    </div>
                  )}

                  {!loading && !error && ordenes.length === 0 && (
                    <p className="center-align">No tienes órdenes registradas.</p>
                  )}

                  {!loading && !error && ordenes.map((orden) => (
                    <div key={orden.idOrden} className="card" style={{ marginBottom: '20px', borderRadius: '10px' }}>
                      <div className="card-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                          <div>
                            <strong style={{ fontSize: '18px' }}>Orden #{orden.idOrden}</strong>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                              Fecha: {new Date(orden.fechaOrden).toLocaleDateString('es-CL')}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                              <i className="tiny material-icons" style={{ verticalAlign: 'middle', marginRight: '4px' }}>location_on</i>
                              {orden.direccionEnvio}
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
                              Total: ${orden.totalOrden.toLocaleString('es-CL')}
                            </p>
                          </div>
                        </div>

                        <div className="divider" style={{ margin: '15px 0' }}></div>

                        <h6 style={{ marginBottom: '10px' }}>Productos:</h6>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                          {orden.detalleOrden.map((detalle, index) => (
                            <li key={detalle.idDetalle || index} style={{
                              padding: '8px 0',
                              borderBottom: index < orden.detalleOrden.length - 1 ? '1px solid #eee' : 'none',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                              <span>{detalle.producto.nombreProducto} (x{detalle.cantidad})</span>
                              <span style={{ color: '#2E8B57' }}>${(detalle.precioUnitario * detalle.cantidad).toLocaleString('es-CL')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
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
