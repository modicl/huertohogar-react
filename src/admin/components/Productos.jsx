import React, { useState, useEffect } from 'react';
import { productos as productosIniciales } from '../../data/productos.jsx';
import './AdminDashboard.css';

export function Productos() {
  const [productos, setProductos] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    categoria: '',
    descripcion: '',
    precio: '',
    stock: '',
    origen: '',
    imagen: ''
  });

  // Cargar productos al iniciar
  useEffect(() => {
    const storedProducts = localStorage.getItem('productos');
    if (storedProducts) {
      setProductos(JSON.parse(storedProducts));
    } else {
      setProductos(productosIniciales);
      localStorage.setItem('productos', JSON.stringify(productosIniciales));
    }
  }, []);

  // Inicializar Materialize Modal
  useEffect(() => {
    if (window.M) {
      const modals = document.querySelectorAll('.modal');
      window.M.Modal.init(modals);
    }
  }, []);

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      id: '',
      nombre: '',
      categoria: '',
      descripcion: '',
      precio: '',
      stock: '',
      origen: '',
      imagen: ''
    });
    setEditingProduct(null);
  };

  // Abrir modal para crear
  const handleCreate = () => {
    resetForm();
    const modal = document.getElementById('productModal');
    const instance = window.M.Modal.getInstance(modal);
    if (instance) instance.open();
  };

  // Abrir modal para editar
  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setFormData({
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      origen: producto.origen || '',
      imagen: producto.imagen || ''
    });
    const modal = document.getElementById('productModal');
    const instance = window.M.Modal.getInstance(modal);
    if (instance) instance.open();
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar producto (crear o editar)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.categoria || !formData.precio || !formData.stock) {
      alert('Por favor completa todos los campos obligatorios (nombre, categoría, precio, stock)');
      return;
    }

    const productoData = {
      id: editingProduct ? formData.id : Date.now(),
      nombre: formData.nombre,
      categoria: formData.categoria,
      descripcion: formData.descripcion,
      precio: parseInt(formData.precio),
      stock: parseInt(formData.stock),
      origen: formData.origen || 'Chile',
      imagen: formData.imagen || ''
    };

    let updatedProducts;
    if (editingProduct) {
      // Actualizar producto existente
      updatedProducts = productos.map(p => 
        p.id === formData.id ? productoData : p
      );
      alert('Producto actualizado exitosamente');
    } else {
      // Crear nuevo producto
      updatedProducts = [...productos, productoData];
      alert('Producto creado exitosamente');
    }

    setProductos(updatedProducts);
    localStorage.setItem('productos', JSON.stringify(updatedProducts));
    
    // Cerrar modal
    const modal = document.getElementById('productModal');
    const instance = window.M.Modal.getInstance(modal);
    if (instance) instance.close();
    
    resetForm();
  };

  // Eliminar producto
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const updatedProducts = productos.filter(p => p.id !== id);
      setProductos(updatedProducts);
      localStorage.setItem('productos', JSON.stringify(updatedProducts));
      alert('Producto eliminado exitosamente');
    }
  };

  // Exportar productos a JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(productos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'productos.json';
    link.click();
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 className="dashboard-title">Gestión de Productos</h4>
            <p className="dashboard-subtitle">Administra el catálogo completo de productos</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleExport}
              className="btn waves-effect waves-light"
              style={{ background: '#3498db' }}
            >
              <i className="material-icons left">download</i>
              Exportar
            </button>
            <button 
              onClick={handleCreate}
              className="btn waves-effect waves-light"
              style={{ background: '#27ae60' }}
            >
              <i className="material-icons left">add</i>
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row">
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <i className="material-icons">inventory_2</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Productos</p>
              <h5 className="stat-value">{productos.length}</h5>
            </div>
          </div>
        </div>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">
              <i className="material-icons">storage</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Stock Total</p>
              <h5 className="stat-value">{productos.reduce((sum, p) => sum + p.stock, 0)}</h5>
            </div>
          </div>
        </div>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-green">
            <div className="stat-icon">
              <i className="material-icons">category</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Categorías</p>
              <h5 className="stat-value">{new Set(productos.map(p => p.categoria)).size}</h5>
            </div>
          </div>
        </div>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-orange">
            <div className="stat-icon">
              <i className="material-icons">attach_money</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Valor Inventario</p>
              <h5 className="stat-value">${(productos.reduce((sum, p) => sum + (p.precio * p.stock), 0) / 1000).toFixed(0)}K</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="row">
        <div className="col s12">
          <div className="card admin-card">
            <div className="card-content">
              <div className="card-header">
                <span className="card-title-admin">Listado de Productos</span>
                <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                  {productos.length} producto{productos.length !== 1 ? 's' : ''} registrado{productos.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <table className="responsive-table striped admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Origen</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                productos.map(producto => (
                  <tr key={producto.id}>
                    <td style={{ padding: '15px' }}>{producto.id}</td>
                    <td>
                      {producto.imagen && (
                        <img 
                          src={producto.imagen} 
                          alt={producto.nombre}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      )}
                    </td>
                    <td>
                      <strong>{producto.nombre}</strong>
                      <br />
                      <small style={{ color: '#999' }}>{producto.descripcion}</small>
                    </td>
                    <td>
                      <span className="badge-status badge-success" style={{
                        background: '#e8f5e9',
                        color: '#27ae60'
                      }}>
                        {producto.categoria}
                      </span>
                    </td>
                    <td className="font-medium" style={{ color: '#2c3e50' }}>
                      ${producto.precio.toLocaleString('es-CL')}
                    </td>
                    <td>
                      <span className={
                        producto.stock > 20 ? 'badge-status badge-success' : 
                        producto.stock > 10 ? 'badge-status badge-warning' : 
                        'badge-status badge-danger'
                      }>
                        {producto.stock} unid.
                      </span>
                    </td>
                    <td style={{ color: '#7f8c8d' }}>{producto.origen || 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(producto)}
                        className="btn-small btn-flat waves-effect"
                        style={{ marginRight: '5px' }}
                      >
                        <i className="material-icons" style={{ color: '#3498db' }}>edit</i>
                      </button>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="btn-small btn-flat waves-effect"
                      >
                        <i className="material-icons" style={{ color: '#e74c3c' }}>delete</i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

      {/* Modal para crear/editar producto */}
      <div id="productModal" className="modal" style={{ maxWidth: '700px' }}>
        <div className="modal-content">
          <h4 className="dashboard-title" style={{ marginBottom: '10px' }}>
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h4>
          <p className="dashboard-subtitle" style={{ marginBottom: '20px' }}>
            {editingProduct ? 'Modifica los datos del producto' : 'Completa la información del nuevo producto'}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Nombre */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>shopping_basket</i>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="nombre" className={formData.nombre ? 'active' : ''}>
                  Nombre del Producto *
                </label>
              </div>

              {/* Categoría */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>category</i>
                <input
                  id="categoria"
                  name="categoria"
                  type="text"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  placeholder="Ej: Frutas, Verduras, Lacteos"
                  required
                />
                <label htmlFor="categoria" className={formData.categoria ? 'active' : ''}>
                  Categoría *
                </label>
              </div>

              {/* Precio */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>attach_money</i>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="0"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="precio" className={formData.precio ? 'active' : ''}>
                  Precio (CLP) *
                </label>
              </div>

              {/* Stock */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>inventory</i>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="stock" className={formData.stock ? 'active' : ''}>
                  Stock Disponible *
                </label>
              </div>

              {/* Origen */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>place</i>
                <input
                  id="origen"
                  name="origen"
                  type="text"
                  value={formData.origen}
                  onChange={handleInputChange}
                  placeholder="Chile"
                />
                <label htmlFor="origen" className={formData.origen ? 'active' : ''}>
                  Origen
                </label>
              </div>

              {/* Descripción */}
              <div className="input-field col s12">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>description</i>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="materialize-textarea"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  style={{ minHeight: '80px' }}
                />
                <label htmlFor="descripcion" className={formData.descripcion ? 'active' : ''}>
                  Descripción del Producto
                </label>
              </div>

              {/* URL de Imagen */}
              <div className="input-field col s12">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>image</i>
                <input
                  id="imagen"
                  name="imagen"
                  type="text"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="URL de la imagen o ruta relativa"
                />
                <label htmlFor="imagen" className={formData.imagen ? 'active' : ''}>
                  URL de Imagen
                </label>
                <span className="helper-text">
                  Ingresa la URL completa o la ruta relativa (ej: /images/producto.jpg)
                </span>
              </div>

              {/* Preview de imagen */}
              {formData.imagen && (
                <div className="col s12" style={{ marginTop: '10px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>Vista previa:</p>
                  <img 
                    src={formData.imagen} 
                    alt="Preview"
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.85em', color: '#999', marginTop: '20px' }}>
              * Campos obligatorios
            </p>
          </form>
        </div>

        <div className="modal-footer" style={{ background: '#f8f9fa' }}>
          <button
            type="button"
            className="modal-close btn-flat waves-effect"
            style={{ marginRight: '10px' }}
            onClick={resetForm}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn waves-effect waves-light"
            style={{ background: '#27ae60' }}
            onClick={handleSubmit}
          >
            <i className="material-icons left">save</i>
            {editingProduct ? 'Actualizar' : 'Crear'} Producto
          </button>
        </div>
      </div>
    </div>
  );
}

