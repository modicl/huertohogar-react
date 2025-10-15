import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación simple (en producción, esto sería contra una API)
    if (credentials.email === 'admin@huertohogar.com' && credentials.password === 'admin123') {
      // Guardar token de autenticación
      localStorage.setItem('adminToken', 'token-admin-123');
      localStorage.setItem('adminEmail', credentials.email);
      
      // Redirigir al dashboard
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas');
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

          <button type="submit" className="btn waves-effect waves-light btn-large" style={{ backgroundColor: '#2E8B57', width: '100%' }}>
            <i className="material-icons left">login</i>
            Iniciar Sesión
          </button>

          <div className="admin-login-footer">
            <p>
              <a href="/" style={{ color: '#2E8B57' }}>
                <i className="material-icons tiny">arrow_back</i> Volver al sitio
              </a>
            </p>
            <p className="grey-text text-lighten-1">
              <small>Credenciales de prueba:<br />
              Email: admin@huertohogar.com<br />
              Password: admin123</small>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
