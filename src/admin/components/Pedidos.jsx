import React, { useState, useEffect } from 'react';
import { ordenes as ordenesIniciales } from '../../data/ordenes.jsx';
import './AdminDashboard.css';

export function Pedidos() {
  const [ordenes, setOrdenes] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Estados posibles para los pedidos
  const estadosDisponibles = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado', 'Enviado'];

  // Cargar órdenes al iniciar
  useEffect(() => {
    const storedOrders = localStorage.getItem('ordenes');
    if (storedOrders) {
      setOrdenes(JSON.parse(storedOrders));
    } else {
      setOrdenes(ordenesIniciales);
      localStorage.setItem('ordenes', JSON.stringify(ordenesIniciales));
    }
  }, []);

  // Inicializar Materialize Modal y Select
  useEffect(() => {
    if (window.M) {
      const modals = document.querySelectorAll('.modal');
      window.M.Modal.init(modals);
      
      const selects = document.querySelectorAll('select');
      window.M.FormSelect.init(selects);
    }
  }, [ordenes, selectedOrden]);

  // Formatear fecha
  const formatearFecha = (fecha) => {
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
  const handleCambiarEstado = (ordenId, nuevoEstado) => {
    const ordenesActualizadas = ordenes.map(orden =>
      orden.id === ordenId ? { ...orden, estado: nuevoEstado } : orden
    );
    setOrdenes(ordenesActualizadas);
    localStorage.setItem('ordenes', JSON.stringify(ordenesActualizadas));
    
    // Actualizar selectedOrden si está abierta
    if (selectedOrden && selectedOrden.id === ordenId) {
      setSelectedOrden({ ...selectedOrden, estado: nuevoEstado });
    }
    
    window.M.toast({ html: 'Estado actualizado correctamente', classes: 'green' });
  };

  // Actualizar notas de la orden
  const handleActualizarNotas = (ordenId, nuevasNotas) => {
    const ordenesActualizadas = ordenes.map(orden =>
      orden.id === ordenId ? { ...orden, notas: nuevasNotas } : orden
    );
    setOrdenes(ordenesActualizadas);
    localStorage.setItem('ordenes', JSON.stringify(ordenesActualizadas));
    
    if (selectedOrden && selectedOrden.id === ordenId) {
      setSelectedOrden({ ...selectedOrden, notas: nuevasNotas });
    }
  };

  // Eliminar orden
  const handleEliminarOrden = (ordenId) => {
    if (window.confirm('¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.')) {
      const ordenesActualizadas = ordenes.filter(orden => orden.id !== ordenId);
      setOrdenes(ordenesActualizadas);
      localStorage.setItem('ordenes', JSON.stringify(ordenesActualizadas));
      
      // Cerrar modal si está abierto
      const modal = document.getElementById('detalleModal');
      const instance = window.M.Modal.getInstance(modal);
      if (instance) instance.close();
      
      window.M.toast({ html: 'Orden eliminada correctamente', classes: 'red' });
    }
  };

  // Filtrar órdenes
  const ordenesFiltradas = ordenes.filter(orden => {
    const cumpleFiltroEstado = filtroEstado === 'Todos' || orden.estado === filtroEstado;
    const cumpleBusqueda = 
      orden.id.toString().includes(busqueda) ||
      orden.id_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.shippingInfo.fullName.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.shippingInfo.email.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleFiltroEstado && cumpleBusqueda;
  });

  // Obtener color según estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente': return { bg: '#fff3cd', color: '#856404' };
      case 'En Proceso': return { bg: '#cfe2ff', color: '#084298' };
      case 'Completado': return { bg: '#d1e7dd', color: '#0f5132' };
      case 'Cancelado': return { bg: '#f8d7da', color: '#842029' };
      case 'Enviado': return { bg: '#d3d3f5', color: '#3d3d99' };
      default: return { bg: '#e2e3e5', color: '#41464b' };
    }
  };

  // Estadísticas
  const stats = {
    total: ordenes.length,
    pendientes: ordenes.filter(o => o.estado === 'Pendiente').length,
    enProceso: ordenes.filter(o => o.estado === 'En Proceso').length,
    completadas: ordenes.filter(o => o.estado === 'Completado').length,
    ingresoTotal: ordenes.reduce((sum, o) => sum + o.total, 0)
  };

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
                      placeholder="Buscar por ID, usuario, nombre o email..."
                    />
                  </div>
                </div>
                <div className="col s12 m6 l4">
                  <div className="input-field" style={{ marginTop: 0 }}>
                    <select
                      value={filtroEstado}
                      onChange={(e) => {
                        setFiltroEstado(e.target.value);
                        setTimeout(() => {
                          const selects = document.querySelectorAll('select');
                          window.M.FormSelect.init(selects);
                        }, 0);
                      }}
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
                <span className="dashboard-subtitle">
                  {ordenesFiltradas.length} pedido{ordenesFiltradas.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <table className="responsive-table striped admin-table">
                <thead>
                  <tr>
                    <th>ID Pedido</th>
                    <th>ID Usuario</th>
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
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    {busqueda || filtroEstado !== 'Todos' 
                      ? 'No se encontraron pedidos con los filtros aplicados'
                      : 'No hay pedidos registrados'}
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map(orden => {
                  const estadoStyle = getEstadoColor(orden.estado);
                  return (
                    <tr key={orden.id}>
                      <td className="font-medium">
                        #{orden.id}
                      </td>
                      <td>
                        <code style={{ background: '#f8f9fa', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em', color: '#7f8c8d' }}>
                          {orden.id_usuario}
                        </code>
                      </td>
                      <td>
                        <div>
                          <strong style={{ color: '#2c3e50' }}>{orden.shippingInfo.fullName}</strong>
                          <br />
                          <small className="dashboard-subtitle">{orden.shippingInfo.email}</small>
                        </div>
                      </td>
                      <td className="dashboard-subtitle">
                        {formatearFecha(orden.fecha)}
                      </td>
                      <td className="dashboard-subtitle">
                        {orden.productos.length} producto{orden.productos.length !== 1 ? 's' : ''}
                      </td>
                      <td className="font-medium" style={{ color: '#27ae60' }}>
                        ${orden.total.toLocaleString('es-CL')}
                      </td>
                      <td>
                        <select
                          value={orden.estado}
                          onChange={(e) => handleCambiarEstado(orden.id, e.target.value)}
                          style={{
                            background: estadoStyle.bg,
                            color: estadoStyle.color,
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '0.85em',
                            cursor: 'pointer'
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
                  <h4 className="dashboard-title" style={{ marginBottom: '5px' }}>Pedido #{selectedOrden.id}</h4>
                  <p className="dashboard-subtitle">
                    {formatearFecha(selectedOrden.fecha)}
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
                          {selectedOrden.id_usuario}
                        </code>
                      </p>
                      <p style={{ margin: '8px 0' }}><strong>Nombre:</strong> {selectedOrden.shippingInfo.fullName}</p>
                      <p style={{ margin: '8px 0' }}><strong>Email:</strong> {selectedOrden.shippingInfo.email}</p>
                      <p style={{ margin: '8px 0' }}><strong>Teléfono:</strong> {selectedOrden.shippingInfo.phone}</p>
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
                      <p style={{ margin: '8px 0' }}><strong>Dirección:</strong> {selectedOrden.shippingInfo.address}</p>
                      <p style={{ margin: '8px 0' }}><strong>Ciudad:</strong> {selectedOrden.shippingInfo.city}</p>
                      <p style={{ margin: '8px 0' }}><strong>Región:</strong> {selectedOrden.shippingInfo.region}</p>
                      <p style={{ margin: '8px 0' }}><strong>Código Postal:</strong> {selectedOrden.shippingInfo.zipCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div style={{ marginTop: '20px' }}>
                <h6 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="material-icons" style={{ color: '#2E8B57' }}>shopping_cart</i>
                  Productos ({selectedOrden.productos.length})
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
                    {selectedOrden.productos.map((producto, index) => (
                      <tr key={index}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {producto.imagen && (
                              <img 
                                src={producto.imagen} 
                                alt={producto.nombre}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            )}
                            <strong>{producto.nombre}</strong>
                          </div>
                        </td>
                        <td>${producto.precio.toLocaleString('es-CL')}</td>
                        <td>{producto.quantity}</td>
                        <td>
                          <strong>${(producto.precio * producto.quantity).toLocaleString('es-CL')}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen de costos */}
              <div style={{ marginTop: '20px', borderTop: '2px solid #e0e0e0', paddingTop: '20px' }}>
                <div style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Subtotal:</span>
                    <strong>${selectedOrden.subtotal.toLocaleString('es-CL')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Envío:</span>
                    <strong>${selectedOrden.envio.toLocaleString('es-CL')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', borderTop: '2px solid #2E8B57', paddingTop: '10px' }}>
                    <strong>Total:</strong>
                    <strong style={{ color: '#2E8B57' }}>${selectedOrden.total.toLocaleString('es-CL')}</strong>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div style={{ marginTop: '20px' }}>
                <h6 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="material-icons" style={{ color: '#2E8B57' }}>note</i>
                  Notas del Pedido
                </h6>
                <div className="input-field">
                  <textarea
                    id="notas"
                    className="materialize-textarea"
                    value={selectedOrden.notas}
                    onChange={(e) => handleActualizarNotas(selectedOrden.id, e.target.value)}
                    placeholder="Agregar notas sobre este pedido..."
                    style={{ minHeight: '80px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '10px' }}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ background: '#f8f9fa', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => handleEliminarOrden(selectedOrden.id)}
                className="btn waves-effect waves-light red"
              >
                <i className="material-icons left">delete</i>
                Eliminar Pedido
              </button>
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