import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordenes as ordenesIniciales } from '../../data/ordenes.jsx';
import { productos } from '../../data/productos.jsx';
import './AdminDashboard.css';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);

  // Cargar órdenes desde localStorage o usar datos iniciales
  useEffect(() => {
    const storedOrdenes = JSON.parse(localStorage.getItem('ordenes') || JSON.stringify(ordenesIniciales));
    setOrdenes(storedOrdenes);
  }, []);

  // Calcular estadísticas
  const totalOrdenes = ordenes.length;
  const ordenesPendientes = ordenes.filter(o => o.estado === 'Pendiente').length;
  const ventasTotales = ordenes
    .filter(o => o.estado !== 'Cancelado')
    .reduce((sum, o) => sum + o.total, 0);
  
  // Productos con stock bajo (menos de 10 unidades)
  const storedProductos = JSON.parse(localStorage.getItem('productos') || JSON.stringify(productos));
  const stockBajo = storedProductos.filter(p => p.stock < 10).length;

  // Obtener las 5 órdenes más recientes
  const ordenesRecientes = [...ordenes]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  // Función para obtener clase de badge según estado
  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'badge-success';
      case 'Pendiente':
        return 'badge-warning';
      case 'Cancelado':
        return 'badge-danger';
      case 'En Proceso':
        return 'badge-status';
      default:
        return 'badge-status';
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h4 className="dashboard-title">Panel de Control</h4>
        <p className="dashboard-subtitle">Resumen general del sistema</p>
      </div>

      {/* Estadísticas principales */}
      <div className="row">
        <div className="col s12 m6 l3" data-testid="ventas-dash">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <i className="material-icons">attach_money</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Ventas Totales</p>
              <h5 className="stat-value">
                ${ventasTotales.toLocaleString('es-CL')}
              </h5>
            </div>
          </div>
        </div>
        
        <div className="col s12 m6 l3" data-testid="totalpedidos-dash">
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">
              <i className="material-icons">shopping_cart</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Pedidos</p>
              <h5 className="stat-value">{totalOrdenes}</h5>
            </div>
          </div>
        </div>
        
        <div className="col s12 m6 l3" data-testid="pendientes-dash">
          <div className="stat-card stat-card-green">
            <div className="stat-icon">
              <i className="material-icons">pending</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Pedidos Pendientes</p>
              <h5 className="stat-value">{ordenesPendientes}</h5>
            </div>
          </div>
        </div>
        
        <div className="col s12 m6 l3" data-testid="stock-dash">
          <div className="stat-card stat-card-orange">
            <div className="stat-icon">
              <i className="material-icons">warning</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Stock Bajo</p>
              <h5 className="stat-value">{stockBajo}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de pedidos recientes */}
      <div className="row">
        <div className="col s12">
          <div className="card admin-card">
            <div className="card-content">
              <div className="card-header">
                <span className="card-title-admin">Pedidos Recientes</span>
                <button 
                  onClick={() => navigate('/admin/pedidos')}
                  className="btn-flat waves-effect"
                  style={{ color: '#2E8B57', fontWeight: '600' }}
                >
                  Ver todos
                </button>
              </div>
              
              {ordenesRecientes.length > 0 ? (
                <table className="responsive-table striped admin-table">
                  <thead>
                    <tr>
                      <th>ID Pedido</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th style={{ textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenesRecientes.map((orden) => (
                      <tr key={orden.id}>
                        <td className="font-medium">#{orden.id_usuario}</td>
                        <td>{orden.shippingInfo.nombre}</td>
                        <td>
                          {new Date(orden.fecha).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="font-medium">
                          ${orden.total.toLocaleString('es-CL')}
                        </td>
                        <td>
                          <span className={`badge-status ${getBadgeClass(orden.estado)}`}>
                            {orden.estado}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => navigate('/admin/pedidos')}
                            className="btn-small btn-flat waves-effect"
                            style={{ color: '#3498db' }}
                          >
                            <i className="material-icons">visibility</i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#7f8c8d'
                }}>
                  <i className="material-icons" style={{ fontSize: '48px', marginBottom: '16px' }}>
                    shopping_cart
                  </i>
                  <p style={{ fontSize: '1.1em' }}>No hay pedidos registrados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
