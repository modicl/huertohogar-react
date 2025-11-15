import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

export function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [paises, setPaises] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreProducto: '',
    idCategoria: '',
    descripcionProducto: '',
    precioProducto: '',
    stockProducto: '',
    idPais: '',
    imagenUrl: ''
  });

  // Cargar productos, categorías y países al iniciar
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchPaises();
  }, []);

  // Obtener categorías del backend
  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/categorias', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      // Fallback a categorías de ejemplo si falla
      setCategorias([
        { idCategoria: 1, nombreCategoria: 'Verduras' },
        { idCategoria: 2, nombreCategoria: 'Frutas' },
        { idCategoria: 3, nombreCategoria: 'Hortalizas' }
      ]);
    }
  };

  // Obtener países del backend
  const fetchPaises = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/paises', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPaises(response.data);
    } catch (error) {
      console.error('Error al obtener países:', error);
      // Fallback a países de ejemplo si falla
      setPaises([
        { idPais: 1, nombre: 'Chile' },
        { idPais: 2, nombre: 'Argentina' },
        { idPais: 3, nombre: 'Perú' }
      ]);
    }
  };

  // Inicializar Materialize Modal y Select
  useEffect(() => {
    if (window.M) {
      const modals = document.querySelectorAll('.modal');
      window.M.Modal.init(modals);
    }
  }, []);

  // Reinicializar selects cuando cambia formData
  useEffect(() => {
    if (window.M) {
      const selects = document.querySelectorAll('select');
      window.M.FormSelect.init(selects);
    }
  }, [formData]);

  // Obtener productos del backend
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/productos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      if (window.M) {
        window.M.toast({
          html: 'Error al cargar productos',
          classes: 'red'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombreProducto: '',
      idCategoria: '',
      descripcionProducto: '',
      precioProducto: '',
      stockProducto: '',
      idPais: '',
      imagenUrl: ''
    });
    setEditingProduct(null);
    
    // Reinicializar los selects de Materialize
    setTimeout(() => {
      if (window.M) {
        const selects = document.querySelectorAll('select');
        window.M.FormSelect.init(selects);
      }
    }, 100);
  };

  // Abrir modal para crear
  const handleCreate = () => {
    resetForm();
    setTimeout(() => {
      const modal = document.getElementById('productModal');
      if (modal) {
        let instance = window.M.Modal.getInstance(modal);
        if (!instance) {
          instance = window.M.Modal.init(modal);
        }
        instance.open();
      }
    }, 100);
  };

  // Abrir modal para editar
  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setFormData({
      nombreProducto: producto.nombreProducto,
      idCategoria: producto.categoria?.idCategoria || '',
      descripcionProducto: producto.descripcionProducto || '',
      precioProducto: producto.precioProducto,
      stockProducto: producto.stockProducto,
      idPais: producto.paisOrigen?.idPais || '',
      imagenUrl: producto.imagenUrl || ''
    });
    
    // Abrir modal y reinicializar componentes de Materialize
    setTimeout(() => {
      if (window.M) {
        const selects = document.querySelectorAll('select');
        window.M.FormSelect.init(selects);
        window.M.updateTextFields();
        
        const modal = document.getElementById('productModal');
        if (modal) {
          let instance = window.M.Modal.getInstance(modal);
          if (!instance) {
            instance = window.M.Modal.init(modal);
          }
          instance.open();
        }
      }
    }, 100);
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombreProducto || !formData.idCategoria || !formData.precioProducto || !formData.stockProducto) {
      if (window.M) {
        window.M.toast({
          html: 'Por favor completa todos los campos obligatorios',
          classes: 'red'
        });
      }
      return;
    }

    setLoading(true);

    try {
      const productoData = {
        nombreProducto: formData.nombreProducto,
        categoria: {
          idCategoria: parseInt(formData.idCategoria)
        },
        descripcionProducto: formData.descripcionProducto,
        precioProducto: parseInt(formData.precioProducto),
        stockProducto: parseInt(formData.stockProducto),
        paisOrigen: {
          idPais: parseInt(formData.idPais) || 1
        },
        imagenUrl: formData.imagenUrl || ''
      };

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      if (editingProduct) {
        // Actualizar producto existente (PATCH)
        await axios.patch(`/api/v1/productos/${editingProduct.idProducto}`, productoData, config);
        if (window.M) {
          window.M.toast({
            html: 'Producto actualizado exitosamente',
            classes: 'green'
          });
        }
      } else {
        // Crear nuevo producto (POST)
        await axios.post('/api/v1/productos', productoData, config);
        if (window.M) {
          window.M.toast({
            html: 'Producto creado exitosamente',
            classes: 'green'
          });
        }
      }

      // Recargar productos
      await fetchProductos();
      
      // Cerrar modal
      const modal = document.getElementById('productModal');
      const instance = window.M.Modal.getInstance(modal);
      if (instance) instance.close();
      
      resetForm();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      if (window.M) {
        window.M.toast({
          html: error.response?.data?.message || 'Error al guardar el producto',
          classes: 'red',
          displayLength: 6000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/v1/productos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (window.M) {
          window.M.toast({
            html: 'Producto eliminado exitosamente',
            classes: 'green'
          });
        }
        await fetchProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        if (window.M) {
          window.M.toast({
            html: error.response?.data?.message || 'Error al eliminar el producto',
            classes: 'red'
          });
        }
      } finally {
        setLoading(false);
      }
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
              <h5 className="stat-value">{productos.reduce((sum, p) => sum + (p.stockProducto || 0), 0)}</h5>
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
              <h5 className="stat-value">{new Set(productos.map(p => p.categoria?.nombreCategoria)).size}</h5>
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
              <h5 className="stat-value">${(productos.reduce((sum, p) => sum + ((p.precioProducto || 0) * (p.stockProducto || 0)), 0) / 1000).toFixed(0)}K</h5>
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
                  <tr key={producto.idProducto}>
                    <td style={{ padding: '15px' }}>{producto.idProducto}</td>
                    <td>
                      {producto.imagenUrl && (
                        <img 
                          src={producto.imagenUrl} 
                          alt={producto.nombreProducto}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      )}
                    </td>
                    <td>
                      <strong>{producto.nombreProducto}</strong>
                      <br />
                      <small style={{ color: '#999' }}>{producto.descripcionProducto}</small>
                    </td>
                    <td>
                      <span className="badge-status badge-success" style={{
                        background: '#e8f5e9',
                        color: '#27ae60'
                      }}>
                        {producto.categoria?.nombreCategoria || 'N/A'}
                      </span>
                    </td>
                    <td className="font-medium" style={{ color: '#2c3e50' }}>
                      ${producto.precioProducto?.toLocaleString('es-CL')}
                    </td>
                    <td>
                      <span className={
                        producto.stockProducto > 20 ? 'badge-status badge-success' : 
                        producto.stockProducto > 10 ? 'badge-status badge-warning' : 
                        'badge-status badge-danger'
                      }>
                        {producto.stockProducto} unid.
                      </span>
                    </td>
                    <td style={{ color: '#7f8c8d' }}>{producto.paisOrigen?.nombre || producto.paisOrigen?.nombrePais || 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(producto)}
                        className="btn-small btn-flat waves-effect"
                        style={{ marginRight: '5px' }}
                      >
                        <i className="material-icons" style={{ color: '#3498db' }}>edit</i>
                      </button>
                      <button
                        onClick={() => handleDelete(producto.idProducto)}
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
                  id="nombreProducto"
                  name="nombreProducto"
                  type="text"
                  value={formData.nombreProducto}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="nombreProducto" className={formData.nombreProducto ? 'active' : ''}>
                  Nombre del Producto *
                </label>
              </div>

              {/* Categoría */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>category</i>
                <select
                  id="idCategoria"
                  name="idCategoria"
                  value={formData.idCategoria}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombreCategoria}
                    </option>
                  ))}
                </select>
                <label htmlFor="idCategoria">Categoría *</label>
              </div>

              {/* Precio */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>attach_money</i>
                <input
                  id="precioProducto"
                  name="precioProducto"
                  type="number"
                  min="0"
                  value={formData.precioProducto}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="precioProducto" className={formData.precioProducto ? 'active' : ''}>
                  Precio (CLP) *
                </label>
              </div>

              {/* Stock */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>inventory</i>
                <input
                  id="stockProducto"
                  name="stockProducto"
                  type="number"
                  min="0"
                  value={formData.stockProducto}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="stockProducto" className={formData.stockProducto ? 'active' : ''}>
                  Stock Disponible *
                </label>
              </div>

              {/* Origen */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>place</i>
                <select
                  id="idPais"
                  name="idPais"
                  value={formData.idPais}
                  onChange={handleInputChange}
                >
                  <option value="">Sin especificar</option>
                  {paises.map(pais => (
                    <option key={pais.idPais} value={pais.idPais}>
                      {pais.nombre || pais.nombrePais}
                    </option>
                  ))}
                </select>
                <label htmlFor="idPais">País de Origen</label>
              </div>

              {/* Descripción */}
              <div className="input-field col s12">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>description</i>
                <textarea
                  id="descripcionProducto"
                  name="descripcionProducto"
                  className="materialize-textarea"
                  value={formData.descripcionProducto}
                  onChange={handleInputChange}
                  style={{ minHeight: '80px' }}
                />
                <label htmlFor="descripcionProducto" className={formData.descripcionProducto ? 'active' : ''}>
                  Descripción del Producto
                </label>
              </div>

              {/* URL de Imagen */}
              <div className="input-field col s12">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>image</i>
                <input
                  id="imagenUrl"
                  name="imagenUrl"
                  type="text"
                  value={formData.imagenUrl}
                  onChange={handleInputChange}
                  placeholder="URL de la imagen o ruta relativa"
                />
                <label htmlFor="imagenUrl" className={formData.imagenUrl ? 'active' : ''}>
                  URL de Imagen
                </label>
                <span className="helper-text">
                  Ingresa la URL completa o la ruta relativa (ej: /images/producto.jpg)
                </span>
              </div>

              {/* Preview de imagen */}
              {formData.imagenUrl && (
                <div className="col s12" style={{ marginTop: '10px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>Vista previa:</p>
                  <img 
                    src={formData.imagenUrl} 
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

