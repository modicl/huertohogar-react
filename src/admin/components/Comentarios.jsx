import React, { useState, useEffect } from 'react';
import { productos } from '../../data/productos.jsx';
import './AdminDashboard.css';

export function Comentarios() {
  const [todosComentarios, setTodosComentarios] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editForm, setEditForm] = useState({
    comentario: '',
    estrellas: 5
  });
  const [filtroProducto, setFiltroProducto] = useState('todos');

  // Cargar comentarios de todos los productos
  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = () => {
    const storedProductos = JSON.parse(localStorage.getItem('productos') || JSON.stringify(productos));
    const allComments = [];
    
    storedProductos.forEach(producto => {
      if (producto.comentarios && producto.comentarios.length > 0) {
        producto.comentarios.forEach(comentario => {
          allComments.push({
            ...comentario,
            productoId: producto.id,
            productoNombre: producto.nombre
          });
        });
      }
    });

    // Ordenar por fecha más reciente
    allComments.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    setTodosComentarios(allComments);
  };

  // Función para eliminar comentario
  const handleEliminar = (comentarioId, productoId) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

    const storedProductos = JSON.parse(localStorage.getItem('productos') || JSON.stringify(productos));
    const productoIndex = storedProductos.findIndex(p => p.id === productoId);
    
    if (productoIndex !== -1) {
      storedProductos[productoIndex].comentarios = storedProductos[productoIndex].comentarios.filter(
        c => c.id !== comentarioId
      );
      localStorage.setItem('productos', JSON.stringify(storedProductos));
      cargarComentarios();
      alert('Comentario eliminado correctamente');
    }
  };

  // Función para abrir modal de edición
  const handleOpenEdit = (comentario) => {
    setEditingComment(comentario);
    setEditForm({
      comentario: comentario.comentario,
      estrellas: comentario.estrellas
    });

    setTimeout(() => {
      const modal = document.getElementById('modal-editar-comentario');
      if (modal) {
        const instance = window.M.Modal.init(modal);
        instance.open();
      }
    }, 100);
  };

  // Función para guardar edición
  const handleGuardarEdicion = () => {
    if (!editForm.comentario.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    if (editForm.comentario.length > 100) {
      alert('El comentario no puede exceder 100 caracteres');
      return;
    }

    const storedProductos = JSON.parse(localStorage.getItem('productos') || JSON.stringify(productos));
    const productoIndex = storedProductos.findIndex(p => p.id === editingComment.productoId);
    
    if (productoIndex !== -1) {
      const comentarioIndex = storedProductos[productoIndex].comentarios.findIndex(
        c => c.id === editingComment.id
      );
      
      if (comentarioIndex !== -1) {
        storedProductos[productoIndex].comentarios[comentarioIndex] = {
          ...storedProductos[productoIndex].comentarios[comentarioIndex],
          comentario: editForm.comentario.trim(),
          estrellas: editForm.estrellas
        };
        
        localStorage.setItem('productos', JSON.stringify(storedProductos));
        cargarComentarios();
        
        const modal = document.getElementById('modal-editar-comentario');
        const instance = window.M.Modal.getInstance(modal);
        instance.close();
        
        alert('Comentario actualizado correctamente');
        setEditingComment(null);
      }
    }
  };

  // Renderizar estrellas
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
              fontSize: interactive ? '24px' : '16px',
              cursor: interactive ? 'pointer' : 'default'
            }}
          >
            {star <= rating ? 'star' : 'star_border'}
          </i>
        ))}
      </div>
    );
  };

  // Filtrar comentarios
  const comentariosFiltrados = filtroProducto === 'todos' 
    ? todosComentarios 
    : todosComentarios.filter(c => c.productoId === parseInt(filtroProducto));

  // Calcular estadísticas
  const totalComentarios = todosComentarios.length;
  const promedioEstrellas = totalComentarios > 0
    ? (todosComentarios.reduce((sum, c) => sum + c.estrellas, 0) / totalComentarios).toFixed(1)
    : 0;
  const comentarios5Estrellas = todosComentarios.filter(c => c.estrellas === 5).length;
  const comentariosRecientes = todosComentarios.filter(c => {
    const fecha = new Date(c.fecha);
    const hoy = new Date();
    const diferencia = Math.abs(hoy - fecha);
    return diferencia <= 7 * 24 * 60 * 60 * 1000; // 7 días
  }).length;

  // Obtener lista única de productos con comentarios
  const productosConComentarios = [...new Set(todosComentarios.map(c => c.productoId))]
    .map(id => {
      const comentario = todosComentarios.find(c => c.productoId === id);
      return { id, nombre: comentario.productoNombre };
    });

  return (
    <div className="dashboard-wrapper">
      
      {/* Encabezado */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Gestión de Comentarios</h1>
        <p className="dashboard-subtitle">Modera y administra las opiniones de tus clientes</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row" style={{ marginBottom: '30px' }}>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <i className="material-icons">comment</i>
            </div>
            <div className="stat-info">
              <div className="stat-number">{totalComentarios}</div>
              <div className="stat-label">Total Comentarios</div>
            </div>
          </div>
        </div>

        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-orange">
            <div className="stat-icon">
              <i className="material-icons">star</i>
            </div>
            <div className="stat-info">
              <div className="stat-number">{promedioEstrellas}</div>
              <div className="stat-label">Promedio Estrellas</div>
            </div>
          </div>
        </div>

        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-green">
            <div className="stat-icon">
              <i className="material-icons">grade</i>
            </div>
            <div className="stat-info">
              <div className="stat-number">{comentarios5Estrellas}</div>
              <div className="stat-label">5 Estrellas</div>
            </div>
          </div>
        </div>

        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">
              <i className="material-icons">schedule</i>
            </div>
            <div className="stat-info">
              <div className="stat-number">{comentariosRecientes}</div>
              <div className="stat-label">Última Semana</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de comentarios */}
      <div className="admin-card">
        <div className="card-header">
          <h2>Todos los Comentarios</h2>
          
          {/* Filtro por producto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ color: '#7f8c8d', fontWeight: '600' }}>Filtrar por producto:</label>
            <select
              value={filtroProducto}
              onChange={(e) => setFiltroProducto(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.95em'
              }}
            >
              <option value="todos">Todos los productos</option>
              {productosConComentarios.map(producto => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {comentariosFiltrados.length > 0 ? (
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Producto</th>
                  <th>Comentario</th>
                  <th>Calificación</th>
                  <th>Fecha</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comentariosFiltrados.map((comentario) => (
                  <tr key={`${comentario.productoId}-${comentario.id}`}>
                    <td style={{ fontWeight: '600' }}>{comentario.usuario}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        background: '#e8f5e9',
                        color: '#2E8B57',
                        borderRadius: '12px',
                        fontSize: '0.85em',
                        fontWeight: '600'
                      }}>
                        {comentario.productoNombre}
                      </span>
                    </td>
                    <td style={{ maxWidth: '300px' }}>{comentario.comentario}</td>
                    <td>{renderStars(comentario.estrellas)}</td>
                    <td>
                      {new Date(comentario.fecha).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleOpenEdit(comentario)}
                        style={{
                          background: '#3498db',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '8px',
                          fontSize: '0.9em'
                        }}
                      >
                        <i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle' }}>edit</i>
                      </button>
                      <button
                        onClick={() => handleEliminar(comentario.id, comentario.productoId)}
                        style={{
                          background: '#e74c3c',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9em'
                        }}
                      >
                        <i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle' }}>delete</i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
            <i className="material-icons" style={{ fontSize: '64px', marginBottom: '16px' }}>
              comment_bank
            </i>
            <p style={{ fontSize: '1.1em' }}>No hay comentarios disponibles</p>
          </div>
        )}
      </div>

      {/* Modal para editar comentario */}
      <div id="modal-editar-comentario" className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-content">
          <h4 style={{ color: '#2c3e50', marginBottom: '20px' }}>Editar Comentario</h4>
          
          {editingComment && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  fontWeight: '600',
                  color: '#555',
                  marginBottom: '8px'
                }}>
                  Usuario:
                </label>
                <input
                  type="text"
                  value={editingComment.usuario}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: '#f5f5f5',
                    color: '#999'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  fontWeight: '600',
                  color: '#555',
                  marginBottom: '8px'
                }}>
                  Producto:
                </label>
                <input
                  type="text"
                  value={editingComment.productoNombre}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: '#f5f5f5',
                    color: '#999'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  fontWeight: '600',
                  color: '#555',
                  marginBottom: '8px'
                }}>
                  Calificación:
                </label>
                {renderStars(
                  editForm.estrellas,
                  true,
                  (rating) => setEditForm({ ...editForm, estrellas: rating })
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  fontWeight: '600',
                  color: '#555',
                  marginBottom: '8px'
                }}>
                  Comentario: <span style={{ color: '#999', fontWeight: 'normal' }}>(máx. 100 caracteres)</span>
                </label>
                <textarea
                  value={editForm.comentario}
                  onChange={(e) => setEditForm({ ...editForm, comentario: e.target.value })}
                  maxLength={100}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1em',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ 
                  textAlign: 'right', 
                  color: editForm.comentario.length >= 90 ? '#e74c3c' : '#999',
                  fontSize: '0.85em',
                  marginTop: '6px'
                }}>
                  {editForm.comentario.length}/100
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="modal-close waves-effect waves-light btn-flat"
            style={{ marginRight: '10px' }}
          >
            Cancelar
          </button>
          <button 
            onClick={handleGuardarEdicion}
            className="waves-effect waves-light btn"
            style={{ background: '#2E8B57' }}
          >
            <i className="material-icons left">save</i>
            Guardar Cambios
          </button>
        </div>
      </div>

    </div>
  );
}