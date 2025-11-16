import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../../config/api.js';
import './AdminDashboard.css';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    sNombre: '',
    aPaterno: '',
    aMaterno: '',
    rut: '',
    dv: '',
    fechaNacimiento: '',
    idRegion: '',
    direccion: '',
    email: '',
    telefono: '',
    rol: 'USER',
    passwordHashed: ''
  });

  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Inicializar Materialize Modal
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

  // Obtener usuarios del backend
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URLS.usuarios.base, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      if (window.M) {
        window.M.toast({
          html: 'Error al cargar usuarios',
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
      nombre: '',
      sNombre: '',
      aPaterno: '',
      aMaterno: '',
      rut: '',
      dv: '',
      fechaNacimiento: '',
      idRegion: '',
      direccion: '',
      email: '',
      telefono: '',
      rol: 'USER',
      passwordHashed: ''
    });
    setEditingUser(null);
    
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
      const modal = document.getElementById('userModal');
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
  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre || '',
      sNombre: usuario.sNombre || '',
      aPaterno: usuario.aPaterno || '',
      aMaterno: usuario.aMaterno || '',
      rut: usuario.rut || '',
      dv: usuario.dv || '',
      fechaNacimiento: usuario.fechaNacimiento || '',
      idRegion: usuario.idRegion || '',
      direccion: usuario.direccion || '',
      email: usuario.email || '',
      telefono: usuario.telefono || '',
      rol: usuario.rol || 'USER',
      passwordHashed: '' // No mostrar contraseña por seguridad
    });
    
    setTimeout(() => {
      if (window.M) {
        const selects = document.querySelectorAll('select');
        window.M.FormSelect.init(selects);
        window.M.updateTextFields();
        
        const modal = document.getElementById('userModal');
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

  // Guardar usuario (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.email || !formData.nombre || !formData.aPaterno) {
      if (window.M) {
        window.M.toast({
          html: 'Por favor completa los campos obligatorios (Nombre, Apellido Paterno, Email)',
          classes: 'red'
        });
      }
      return;
    }

    // Validar password solo al crear nuevo usuario
    if (!editingUser && !formData.passwordHashed) {
      if (window.M) {
        window.M.toast({
          html: 'La contraseña es obligatoria para crear un usuario',
          classes: 'red'
        });
      }
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nombre: formData.nombre,
        sNombre: formData.sNombre || '',
        aPaterno: formData.aPaterno,
        aMaterno: formData.aMaterno || '',
        rut: formData.rut,
        dv: formData.dv,
        fechaNacimiento: formData.fechaNacimiento,
        idRegion: parseInt(formData.idRegion) || 13,
        direccion: formData.direccion,
        email: formData.email,
        telefono: formData.telefono,
        passwordHashed: formData.passwordHashed
      };

      if (editingUser) {
        // Actualizar usuario existente (PATCH) - Requiere Bearer token
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // Solo incluir password si se proporcionó uno nuevo
        if (!formData.passwordHashed) {
          delete userData.passwordHashed;
        }

        await axios.patch(`${API_URLS.usuarios.base}/${editingUser.idUsuario}`, userData, config);
        if (window.M) {
          window.M.toast({
            html: 'Usuario actualizado exitosamente',
            classes: 'green'
          });
        }
      } else {
        // Crear nuevo usuario (POST) - NO requiere Bearer token
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        await axios.post(API_URLS.usuarios.base, userData, config);
        if (window.M) {
          window.M.toast({
            html: 'Usuario creado exitosamente',
            classes: 'green'
          });
        }
      }

      // Recargar usuarios
      await fetchUsuarios();
      
      // Cerrar modal
      const modal = document.getElementById('userModal');
      const instance = window.M.Modal.getInstance(modal);
      if (instance) instance.close();
      
      resetForm();

    } catch (error) {
      console.error('Error al guardar usuario:', error);
      if (window.M) {
        window.M.toast({
          html: error.response?.data?.message || 'Error al guardar el usuario',
          classes: 'red',
          displayLength: 6000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URLS.usuarios.base}/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (window.M) {
          window.M.toast({
            html: 'Usuario eliminado exitosamente',
            classes: 'green'
          });
        }
        await fetchUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        if (window.M) {
          window.M.toast({
            html: error.response?.data?.message || 'Error al eliminar el usuario',
            classes: 'red'
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Exportar usuarios a JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(usuarios, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usuarios.json';
    link.click();
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 className="dashboard-title">
              <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '10px' }}>people</i>
              Gestión de Usuarios
            </h4>
            <p className="dashboard-subtitle">Administra los usuarios del sistema</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleExport}
              className="btn waves-effect waves-light"
              style={{ background: '#607D8B' }}
            >
              <i className="material-icons left">file_download</i>
              Exportar
            </button>
            <button 
              onClick={handleCreate}
              className="btn waves-effect waves-light"
              style={{ background: '#27ae60' }}
            >
              <i className="material-icons left">person_add</i>
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row">
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <i className="material-icons">people</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Usuarios</p>
              <h5 className="stat-value">{usuarios.length}</h5>
            </div>
          </div>
        </div>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-green">
            <div className="stat-icon">
              <i className="material-icons">admin_panel_settings</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Administradores</p>
              <h5 className="stat-value">{usuarios.filter(u => u.rol === 'ADMIN').length}</h5>
            </div>
          </div>
        </div>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">
              <i className="material-icons">person</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Usuarios Regulares</p>
              <h5 className="stat-value">{usuarios.filter(u => u.rol === 'USER').length}</h5>
            </div>
          </div>
        </div>
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-orange">
            <div className="stat-icon">
              <i className="material-icons">location_on</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Regiones</p>
              <h5 className="stat-value">{new Set(usuarios.map(u => u.idRegion)).size}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="row">
        <div className="col s12">
          <div className="card admin-card">
            <div className="card-content">
              <div className="card-header">
                <span className="card-title-admin">Listado de Usuarios</span>
                <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                  {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} registrado{usuarios.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <table className="responsive-table striped admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th style={{ width: '100px' }}>RUT</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th style={{ width: '120px' }}>Región</th>
                    <th>Rol</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map(usuario => (
                  <tr key={usuario.idUsuario}>
                    <td style={{ padding: '15px' }}>{usuario.idUsuario}</td>
                    <td>
                      <strong>{usuario.nombre} {usuario.aPaterno}</strong>
                      <br />
                      <small style={{ color: '#999' }}>{usuario.sNombre} {usuario.aMaterno}</small>
                    </td>
                    <td>{usuario.rut}-{usuario.dv}</td>
                    <td style={{ color: '#7f8c8d' }}>{usuario.email}</td>
                    <td>{usuario.telefono || 'N/A'}</td>
                    <td>
                      <span style={{ 
                        background: '#E3F2FD', 
                        color: '#1976D2', 
                        padding: '4px 12px', 
                        borderRadius: '12px',
                        fontSize: '0.85em',
                        fontWeight: '500'
                      }}>
                        Región {usuario.idRegion}
                      </span>
                    </td>
                    <td>
                      <span className={
                        usuario.rol === 'ADMIN' ? 'badge-status badge-success' : 'badge-status badge-info'
                      } style={{
                        background: usuario.rol === 'ADMIN' ? '#4CAF50' : '#2196F3',
                        color: 'white'
                      }}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="btn-small btn-flat waves-effect"
                        style={{ marginRight: '5px' }}
                      >
                        <i className="material-icons" style={{ color: '#3498db' }}>edit</i>
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.idUsuario)}
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

      {/* Modal para editar usuario */}
      <div id="userModal" className="modal" style={{ maxWidth: '700px' }}>
        <div className="modal-content">
          <h4 className="dashboard-title" style={{ marginBottom: '10px' }}>
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h4>
          <p className="dashboard-subtitle" style={{ marginBottom: '20px' }}>
            {editingUser ? 'Modifica los datos del usuario' : 'Completa la información del nuevo usuario'}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Nombre */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>person</i>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="nombre" className={formData.nombre ? 'active' : ''}>
                  Primer Nombre *
                </label>
              </div>

              {/* Segundo Nombre */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>person_outline</i>
                <input
                  id="sNombre"
                  name="sNombre"
                  type="text"
                  value={formData.sNombre}
                  onChange={handleInputChange}
                />
                <label htmlFor="sNombre" className={formData.sNombre ? 'active' : ''}>
                  Segundo Nombre
                </label>
              </div>

              {/* Apellido Paterno */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>badge</i>
                <input
                  id="aPaterno"
                  name="aPaterno"
                  type="text"
                  value={formData.aPaterno}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="aPaterno" className={formData.aPaterno ? 'active' : ''}>
                  Apellido Paterno *
                </label>
              </div>

              {/* Apellido Materno */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>badge</i>
                <input
                  id="aMaterno"
                  name="aMaterno"
                  type="text"
                  value={formData.aMaterno}
                  onChange={handleInputChange}
                />
                <label htmlFor="aMaterno" className={formData.aMaterno ? 'active' : ''}>
                  Apellido Materno
                </label>
              </div>

              {/* RUT */}
              <div className="input-field col s12 m4">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>fingerprint</i>
                <input
                  id="rut"
                  name="rut"
                  type="text"
                  value={formData.rut}
                  onChange={handleInputChange}
                />
                <label htmlFor="rut" className={formData.rut ? 'active' : ''}>
                  RUT
                </label>
              </div>

              {/* DV */}
              <div className="input-field col s12 m2">
                <input
                  id="dv"
                  name="dv"
                  type="text"
                  maxLength="1"
                  value={formData.dv}
                  onChange={handleInputChange}
                />
                <label htmlFor="dv" className={formData.dv ? 'active' : ''}>
                  DV
                </label>
              </div>

              {/* Fecha Nacimiento */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>cake</i>
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                />
                <label htmlFor="fechaNacimiento" className="active">
                  Fecha de Nacimiento
                </label>
              </div>

              {/* Email */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>email</i>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="email" className={formData.email ? 'active' : ''}>
                  Email *
                </label>
              </div>

              {/* Teléfono */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>phone</i>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
                <label htmlFor="telefono" className={formData.telefono ? 'active' : ''}>
                  Teléfono
                </label>
              </div>

              {/* Región */}
              <div className="input-field col s12 m6">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>location_on</i>
                <input
                  id="idRegion"
                  name="idRegion"
                  type="number"
                  value={formData.idRegion}
                  onChange={handleInputChange}
                />
                <label htmlFor="idRegion" className={formData.idRegion ? 'active' : ''}>
                  ID Región
                </label>
              </div>

              {/* Dirección */}
              <div className="input-field col s12">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>home</i>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
                <label htmlFor="direccion" className={formData.direccion ? 'active' : ''}>
                  Dirección
                </label>
              </div>

              {/* Password */}
              <div className="input-field col s12">
                <i className="material-icons prefix" style={{ color: '#2E8B57' }}>lock</i>
                <input
                  id="passwordHashed"
                  name="passwordHashed"
                  type="password"
                  value={formData.passwordHashed}
                  onChange={handleInputChange}
                  placeholder={editingUser ? "Dejar vacío para no cambiar" : ""}
                  required={!editingUser}
                />
                <label htmlFor="passwordHashed" className={formData.passwordHashed ? 'active' : ''}>
                  Contraseña {editingUser ? '(opcional)' : '*'}
                </label>
                <span className="helper-text">
                  {editingUser ? 'Solo completa este campo si deseas cambiar la contraseña' : 'La contraseña es obligatoria para crear el usuario'}
                </span>
              </div>
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
            {editingUser ? 'Actualizar' : 'Crear'} Usuario
          </button>
        </div>
      </div>
    </div>
  );
}
