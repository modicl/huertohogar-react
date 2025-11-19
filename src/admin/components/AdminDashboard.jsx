import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productos } from '../../data/productos.jsx';
import './AdminDashboard.css';
import axios from 'axios';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar órdenes desde API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // 1. Fetch all orders
        const response = await axios.get('https://hh-ordenes-backend-barnt.ondigitalocean.app/api/v1/ordenes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allOrders = response.data;
        setOrdenes(allOrders);

        // 2. Get top 10 recent orders
        const top10 = [...allOrders]
          .sort((a, b) => new Date(b.fechaOrden) - new Date(a.fechaOrden))
          .slice(0, 10);

        // 3. Fetch user details for these orders
        const enrichedOrders = await Promise.all(top10.map(async (order) => {
          try {
            // Check if we have a valid user ID
            if (!order.idUsuario) return order;

            const userResponse = await axios.get(`https://hh-usuario-backend-efp2p.ondigitalocean.app/api/v1/usuarios/${order.idUsuario}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            // Merge user data into order.usuario
            return {
              ...order,
              usuario: { ...order.usuario, ...userResponse.data }
            };
          } catch (userErr) {
            console.error(`Could not fetch user ${order.idUsuario}`, userErr);
            return order; // Return original order if fetch fails
          }
        }));

        setRecentOrders(enrichedOrders);
        setLoading(false);

      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular estadísticas
  const totalOrdenes = ordenes.length;
  const ordenesPendientes = ordenes.filter(o => o.estado === 'pendiente').length;
  const ventasTotales = ordenes
    .filter(o => o.estado !== 'Cancelado')
    .reduce((sum, o) => sum + o.totalOrden, 0);

  // Productos con stock bajo (menos de 10 unidades)
  const storedProductos = JSON.parse(localStorage.getItem('productos') || JSON.stringify(productos));
  const stockBajo = storedProductos.filter(p => p.stock < 10).length;

  // Función para obtener clase de badge según estado
  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Completado':
      case 'Entregado':
        return 'badge-success';
      case 'Pendiente':
      case 'pendiente':
        return 'badge-warning';
      case 'Cancelado':
        return 'badge-danger';
      case 'En Proceso':
      case 'En camino':
        return 'badge-status';
      default:
        return 'badge-status';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper center-align" style={{ paddingTop: '50px' }}>
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
    );
  }

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
                <span className="card-title-admin">Últimos 10 Pedidos</span>
                <button
                  onClick={() => navigate('/admin/pedidos')}
                  className="btn-flat waves-effect"
                  style={{ color: '#2E8B57', fontWeight: '600' }}
                >
                  Ver todos
                </button>
              </div>

              {recentOrders.length > 0 ? (
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
                    {recentOrders.map((orden) => (
                      <tr key={orden.idOrden}>
                        <td className="font-medium">#{orden.idOrden}</td>
                        <td>
                          {orden.usuario && orden.usuario.nombre
                            ? `${orden.usuario.nombre} ${orden.usuario.aPaterno || ''}`
                            : 'Cliente'}
                        </td>
                        <td>
                          {new Date(orden.fechaOrden).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="font-medium">
                          ${orden.totalOrden.toLocaleString('es-CL')}
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
