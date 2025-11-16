import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from './Header';
import { Footer } from './Footer';

export function PerfilUsuario() {
  const { user, logout } = useAuth();
  const [vistaActual, setVistaActual] = useState('resumen');

  // Órdenes de ejemplo
  const ordenesEjemplo = [
    {
      id: 1,
      fecha: '2024-11-10',
      total: 25990,
      estado: 'Entregado',
      productos: [
        { nombre: 'Lechuga Orgánica', cantidad: 2, precio: 1990 },
        { nombre: 'Tomates Cherry', cantidad: 3, precio: 2990 },
        { nombre: 'Zanahorias', cantidad: 1, precio: 1500 }
      ]
    },
    {
      id: 2,
      fecha: '2024-11-08',
      total: 18500,
      estado: 'En camino',
      productos: [
        { nombre: 'Espinacas', cantidad: 2, precio: 2500 },
        { nombre: 'Brócoli', cantidad: 1, precio: 3500 }
      ]
    },
    {
      id: 3,
      fecha: '2024-11-05',
      total: 32400,
      estado: 'Entregado',
      productos: [
        { nombre: 'Mix de Lechugas', cantidad: 3, precio: 2800 },
        { nombre: 'Pepinos', cantidad: 2, precio: 1900 },
        { nombre: 'Albahaca Fresca', cantidad: 1, precio: 2500 }
      ]
    }
  ];

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
                            <h3 style={{ color: '#2E8B57', margin: '0' }}>{ordenesEjemplo.length}</h3>
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
                              ${ordenesEjemplo.reduce((sum, orden) => sum + orden.total, 0).toLocaleString('es-CL')}
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
                              {ordenesEjemplo.filter(o => o.estado === 'Entregado').length}
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

                  {ordenesEjemplo.map((orden) => (
                    <div key={orden.id} className="card" style={{ marginBottom: '20px', borderRadius: '10px' }}>
                      <div className="card-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                          <div>
                            <strong style={{ fontSize: '18px' }}>Orden #{orden.id}</strong>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                              Fecha: {new Date(orden.fecha).toLocaleDateString('es-CL')}
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
                              Total: ${orden.total.toLocaleString('es-CL')}
                            </p>
                          </div>
                        </div>

                        <div className="divider" style={{ margin: '15px 0' }}></div>

                        <h6 style={{ marginBottom: '10px' }}>Productos:</h6>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                          {orden.productos.map((producto, index) => (
                            <li key={index} style={{ 
                              padding: '8px 0', 
                              borderBottom: index < orden.productos.length - 1 ? '1px solid #eee' : 'none',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                              <span>{producto.nombre} (x{producto.cantidad})</span>
                              <span style={{ color: '#2E8B57' }}>${(producto.precio * producto.cantidad).toLocaleString('es-CL')}</span>
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
