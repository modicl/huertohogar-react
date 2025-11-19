import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

export function Pedidos() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Estados posibles para los pedidos
  const estadosDisponibles = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado', 'Enviado'];

  // Cargar órdenes al iniciar
  useEffect(() => {
    fetchOrdenes();
  }, []);

  // Inicializar Materialize Modal y Select
  useEffect(() => {
    if (window.M) {
      setTimeout(() => {
        const modals = document.querySelectorAll('.modal');
        window.M.Modal.init(modals);

        // Only init selects that are not browser-default
        const selects = document.querySelectorAll('select:not(.browser-default)');
        window.M.FormSelect.init(selects);
      }, 500);
    }
  }, [ordenes, selectedOrden]);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // 1. Fetch all orders
      const response = await axios.get('https://hh-ordenes-backend-barnt.ondigitalocean.app/api/v1/ordenes', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allOrders = response.data;

      // 2. Fetch user details for each order
      const enrichedOrders = await Promise.all(allOrders.map(async (order) => {
        try {
          if (!order.idUsuario) return order;

          const userResponse = await axios.get(`https://hh-usuario-backend-efp2p.ondigitalocean.app/api/v1/usuarios/${order.idUsuario}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          return {
            ...order,
            usuario: { ...order.usuario, ...userResponse.data }
          };
        } catch (userErr) {
          console.error(`Could not fetch user ${order.idUsuario}`, userErr);
          return order;
        }
      }));

      setOrdenes(enrichedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
      if (window.M) window.M.toast({ html: 'Error al cargar los pedidos', classes: 'red' });
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Abrir modal de detalles
  const handleVerDetalle = (orden) => {
    setSelectedOrden(orden);
    const modal = document.getElementById('detalleModal');
    const instance = window.M.Modal.getInstance(modal);
    if (instance) instance.open();
  };

  // Cambiar estado de la orden
  const handleCambiarEstado = async (ordenId, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');

      await axios.patch(`https://hh-ordenes-backend-barnt.ondigitalocean.app/api/v1/ordenes/${ordenId}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar estado local
      const ordenesActualizadas = ordenes.map(orden =>
        orden.idOrden === ordenId ? { ...orden, estado: nuevoEstado } : orden
      );
      setOrdenes(ordenesActualizadas);

      // Actualizar selectedOrden si está abierta
      if (selectedOrden && selectedOrden.idOrden === ordenId) {
        setSelectedOrden({ ...selectedOrden, estado: nuevoEstado });
      }

      if (window.M) window.M.toast({ html: 'Estado actualizado correctamente', classes: 'green' });
    } catch (error) {
      console.error('Error updating status:', error);
      if (window.M) window.M.toast({ html: 'Error al actualizar el estado', classes: 'red' });
    }
  };

  // Filtrar órdenes
  const ordenesFiltradas = ordenes.filter(orden => {
    const cumpleFiltroEstado = filtroEstado === 'Todos' || orden.estado === filtroEstado;

    const nombreCliente = orden.usuario ? `${orden.usuario.nombre} ${orden.usuario.aPaterno || ''}` : '';
    const emailCliente = orden.usuario ? orden.usuario.email : '';

    const cumpleBusqueda =
      orden.idOrden.toString().includes(busqueda) ||
      nombreCliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      emailCliente.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleFiltroEstado && cumpleBusqueda;
  });

  // Obtener color según estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
      case 'pendiente':
        return { bg: '#fff3cd', color: '#856404' };
      case 'En Proceso':
      case 'En camino':
        return { bg: '#cfe2ff', color: '#084298' };
      case 'Completado':
      case 'Entregado':
        return { bg: '#d1e7dd', color: '#0f5132' };
      case 'Cancelado':
        return { bg: '#f8d7da', color: '#842029' };
      case 'Enviado':
        return { bg: '#d3d3f5', color: '#3d3d99' };
      default: return { bg: '#e2e3e5', color: '#41464b' };
    }
  };

  // Estadísticas
  const stats = {
    total: ordenes.length,
    pendientes: ordenes.filter(o => o.estado === 'pendiente' || o.estado === 'Pendiente').length,
    enProceso: ordenes.filter(o => o.estado === 'En Proceso' || o.estado === 'En camino').length,
    completadas: ordenes.filter(o => o.estado === 'Completado' || o.estado === 'Entregado').length,
    ingresoTotal: ordenes.reduce((sum, o) => sum + (o.totalOrden || 0), 0)
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper center-align" style={{ paddingTop: '50px' }}>
        <div className="preloader-wrapper active">
          <div className="spinner-layer spinner-green-only">
            <div className="circle-clipper left"><div className="circle"></div></div>
            <div className="gap-patch"><div className="circle"></div></div>
            <div className="circle-clipper right"><div className="circle"></div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header">
        <h4 className="dashboard-title">Gestión de Pedidos</h4>
        <p className="dashboard-subtitle">Administra todas las órdenes realizadas por los clientes</p>
      </div>

      {/* Estadísticas */}
      <div className="row">
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <i className="material-icons">shopping_cart</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Pedidos</p>
              <h5 className="stat-value">{stats.total}</h5>
            </div>
          </div>
        </div>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-orange">
            <div className="stat-icon">
              <i className="material-icons">pending_actions</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Pendientes</p>
              <h5 className="stat-value">{stats.pendientes}</h5>
            </div>
          </div>
        </div>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">
              <i className="material-icons">autorenew</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">En Proceso</p>
              <h5 className="stat-value">{stats.enProceso}</h5>
            </div>
          </div>
        </div>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-green">
            <div className="stat-icon">
              <i className="material-icons">attach_money</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Ingresos Totales</p>
              <h5 className="stat-value">${(stats.ingresoTotal / 1000).toFixed(0)}K</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="row">
        <div className="col s12">
          <div className="card admin-card">
            <div className="card-content">
              <div className="row" style={{ marginBottom: 0 }}>
                <div className="col s12 m6 l4">
                  <div className="input-field" style={{ marginTop: 0 }}>
                    <i className="material-icons prefix">search</i>
                    <input
                      type="text"
                      id="busqueda"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar por ID, nombre o email..."
                    />
                  </div>
                </div>
                <div className="col s12 m6 l4">
                  <div className="input-field" style={{ marginTop: 0 }}>
                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                      <option value="Todos">Todos los estados</option>
                      {estadosDisponibles.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                    <label>Filtrar por estado</label>
                  </div>
                </div>
                <div className="col s12 m12 l4" style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
                  <span className="dashboard-subtitle">
                    Mostrando {ordenesFiltradas.length} de {ordenes.length} pedidos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de órdenes */}
      <div className="row">
        <div className="col s12">
          <div className="card admin-card">
            <div className="card-content">
              <div className="card-header">
                <span className="card-title-admin">Listado de Pedidos</span>
              </div>

              <table className="responsive-table striped admin-table">
                <thead>
                  <tr>
                    <th>ID Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        {busqueda || filtroEstado !== 'Todos'
                          ? 'No se encontraron pedidos con los filtros aplicados'
                          : 'No hay pedidos registrados'}
                      </td>
                    </tr>
                  ) : (
                    ordenesFiltradas.map(orden => {
                      const estadoStyle = getEstadoColor(orden.estado);
                      return (
                        <tr key={orden.idOrden}>
                          <td className="font-medium">
                            #{orden.idOrden}
                          </td>
                          <td>
                            <div>
                              <strong style={{ color: '#2c3e50' }}>
                                {orden.usuario ? `${orden.usuario.nombre} ${orden.usuario.aPaterno || ''}` : 'Cliente'}
                              </strong>
                              <br />
                              <small className="dashboard-subtitle">{orden.usuario ? orden.usuario.email : ''}</small>
                            </div>
                          </td>
                          <td className="dashboard-subtitle">
                            {formatearFecha(orden.fechaOrden)}
                          </td>
                          <td className="dashboard-subtitle">
                            {orden.detalleOrden ? orden.detalleOrden.length : 0} producto(s)
                          </td>
                          <td className="font-medium" style={{ color: '#27ae60' }}>
                            ${orden.totalOrden.toLocaleString('es-CL')}
                          </td>
                          <td>
                            <select
                              className="browser-default"
                              value={orden.estado}
                              onChange={(e) => handleCambiarEstado(orden.idOrden, e.target.value)}
                              style={{
                                background: estadoStyle.bg,
                                color: estadoStyle.color,
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '0.85em',
                                cursor: 'pointer',
                                display: 'block',
                                width: 'auto'
                              }}
                            >
                              {estadosDisponibles.map(estado => (
                                <option key={estado} value={estado}>{estado}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => handleVerDetalle(orden)}
                              className="btn-small btn-flat waves-effect"
                            >
                              <i className="material-icons" style={{ color: '#3498db' }}>visibility</i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      <div id="detalleModal" className="modal" style={{ maxWidth: '900px', maxHeight: '90%' }}>
        {selectedOrden && (
          <>
            <div className="modal-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h4 className="dashboard-title" style={{ marginBottom: '5px' }}>Pedido #{selectedOrden.idOrden}</h4>
                  <p className="dashboard-subtitle">
                    {formatearFecha(selectedOrden.fechaOrden)}
                  </p>
                </div>
                <div>
                  {(() => {
                    const estadoStyle = getEstadoColor(selectedOrden.estado);
                    return (
                      <span className="badge-status" style={{
                        background: estadoStyle.bg,
                        color: estadoStyle.color
                      }}>
                        {selectedOrden.estado}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="row">
                {/* Información del cliente */}
                <div className="col s12 m6">
                  <div className="card" style={{ borderRadius: '8px', background: '#f8f9fa' }}>
                    <div className="card-content">
                      <h6 style={{ marginTop: 0, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="material-icons" style={{ color: '#2E8B57' }}>person</i>
                        Información del Cliente
                      </h6>
                      <p style={{ margin: '8px 0' }}>
                        <strong>ID Usuario:</strong><br />
                        <code style={{ background: '#fff', padding: '4px 8px', borderRadius: '4px' }}>
                          {selectedOrden.idUsuario}
                        </code>
                      </p>
                      <p style={{ margin: '8px 0' }}>
                        <strong>Nombre:</strong> {selectedOrden.usuario ? `${selectedOrden.usuario.nombre} ${selectedOrden.usuario.aPaterno || ''}` : 'N/A'}
                      </p>
                      <p style={{ margin: '8px 0' }}>
                        <strong>Email:</strong> {selectedOrden.usuario ? selectedOrden.usuario.email : 'N/A'}
                      </p>
                      <p style={{ margin: '8px 0' }}>
                        <strong>Teléfono:</strong> {selectedOrden.usuario ? selectedOrden.usuario.telefono : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información de envío */}
                <div className="col s12 m6">
                  <div className="card" style={{ borderRadius: '8px', background: '#f8f9fa' }}>
                    <div className="card-content">
                      <h6 style={{ marginTop: 0, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="material-icons" style={{ color: '#2E8B57' }}>local_shipping</i>
                        Dirección de Envío
                      </h6>
                      <p style={{ margin: '8px 0' }}>
                        <i className="tiny material-icons" style={{ verticalAlign: 'middle', marginRight: '4px' }}>location_on</i>
                        {selectedOrden.direccionEnvio || 'No especificada'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div style={{ marginTop: '20px' }}>
                <h6 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="material-icons" style={{ color: '#2E8B57' }}>shopping_cart</i>
                  Productos ({selectedOrden.detalleOrden ? selectedOrden.detalleOrden.length : 0})
                </h6>
                <table className="striped">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio Unit.</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrden.detalleOrden && selectedOrden.detalleOrden.map((detalle, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{detalle.producto ? detalle.producto.nombreProducto : 'Producto'}</strong>
                        </td>
                        <td>${detalle.precioUnitario ? detalle.precioUnitario.toLocaleString('es-CL') : 0}</td>
                        <td>{detalle.cantidad}</td>
                        <td>
                          <strong>${(detalle.precioUnitario * detalle.cantidad).toLocaleString('es-CL')}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen de costos */}
              <div style={{ marginTop: '20px', borderTop: '2px solid #e0e0e0', paddingTop: '20px' }}>
                <div style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', borderTop: '2px solid #2E8B57', paddingTop: '10px' }}>
                    <strong>Total:</strong>
                    <strong style={{ color: '#2E8B57' }}>${selectedOrden.totalOrden.toLocaleString('es-CL')}</strong>
                  </div>
                </div>
              </div>

            </div>

            <div className="modal-footer" style={{ background: '#f8f9fa', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="modal-close btn waves-effect waves-light"
                style={{ background: '#2E8B57' }}
              >
                <i className="material-icons left">check</i>
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}