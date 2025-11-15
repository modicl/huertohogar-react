import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URLS } from '../../config/api.js';
import './AdminLogin.css';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Construir el body para la autenticación
      const body = {
        email: credentials.email,
        password: credentials.password
      };

      console.log('Intentando login de admin con:', { email: credentials.email });

      // Realizar la petición POST al endpoint de autenticación
      const response = await axios.post(
        API_URLS.usuarios.authenticate,
        body
      );

      // Verificar que la autenticación fue exitosa
      if (response.status === 200 && response.data) {
        // VALIDAR QUE EL ROL SEA ADMIN
        if (response.data.rol !== 'ADMIN') {
          setError('Acceso denegado. No tienes permisos de administrador.');
          setLoading(false);
          return;
        }

        // Si el rol es ADMIN, proceder con el login
        const userData = {
          idUsuario: response.data.idUsuario,
          email: response.data.email,
          rol: response.data.rol,
          apaterno: response.data.apaterno,
          pnombre: response.data.pnombre
        };

        // Guardar el usuario y token usando el contexto
        login(userData, response.data.token);

        // Pequeño delay para asegurar que el contexto se actualice antes de navegar
        setTimeout(() => {
          navigate('/admin');
        }, 100);
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      let mensajeError = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      
      if (error.response) {
        if (error.response.status === 401) {
          mensajeError = 'Email o contraseña incorrectos.';
        } else if (error.response.status === 403) {
          mensajeError = 'Acceso denegado. No tienes permisos de administrador.';
        } else {
          mensajeError = error.response.data?.message || error.response.data?.error || mensajeError;
        }
      } else if (error.request) {
        mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src="/images/logo_navbar.png" alt="HuertoHogar" className="admin-login-logo" />
          <h4>Panel de Administración</h4>
          <p>HuertoHogar</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="card-panel red lighten-4 red-text text-darken-4">
              <i className="material-icons left">error</i>
              {error}
            </div>
          )}

          <div className="input-field">
            <i className="material-icons prefix">email</i>
            <input
              id="email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-field">
            <i className="material-icons prefix">lock</i>
            <input
              id="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          <button 
            type="submit" 
            className="btn waves-effect waves-light btn-large" 
            style={{ backgroundColor: '#2E8B57', width: '100%' }}
            disabled={loading}
          >
            <i className="material-icons left">{loading ? 'hourglass_empty' : 'login'}</i>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>

          <div className="admin-login-footer">
            <p>
              <a href="/" style={{ color: '#2E8B57' }}>
                <i className="material-icons tiny">arrow_back</i> Volver al sitio
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
