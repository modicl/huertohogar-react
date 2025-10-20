import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './AdminLayout.css';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Inicializar el sidenav de Materialize
  useEffect(() => {
    const elems = document.querySelectorAll('.sidenav');
    if (window.M) {
      window.M.Sidenav.init(elems);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };
  
  // Función para verificar si la ruta está activa
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <div className="admin-layout" data-testid="admin-layout">
      {/* Sidebar */}
      <ul id="slide-out" className="sidenav sidenav-fixed">
        {/* User View */}
        <li>
          <div className="user-view">
            <a href="#!">
              <img className="circle" src="/images/anonymous-user.webp" alt="Admin" />
            </a>
            <a href="#!">
              <span className="black-text name">Admin</span>
            </a>
            <a href="#!">
              <span className="black-text email">hola@huertohogar.com</span>
            </a>
          </div>
        </li>
        
        {/* Gestión Operativa */}
        <li><a className="subheader">Gestión Operativa</a></li>
        
        <li className={isActive('/admin')}>
          <Link to="/admin">
            <i className="material-icons">dashboard</i>Dashboard
          </Link>
        </li>
        
        <li className={isActive('/admin/productos')}>
          <Link to="/admin/productos">
            <i className="material-icons">local_grocery_store</i>Productos
          </Link>
        </li>
        
        <li className={isActive('/admin/pedidos')}>
          <Link to="/admin/pedidos">
            <i className="material-icons">receipt</i>Pedidos
          </Link>
        </li>
        
        <li className={isActive('/admin/usuarios')}>
          <Link to="/admin/usuarios">
            <i className="material-icons">people</i>Usuarios
          </Link>
        </li>
        
        <li className={isActive('/admin/configuracion')}>
          <Link to="/admin/configuracion">
            <i className="material-icons">settings</i>Configuración
          </Link>
        </li>
        
        {/* Divider */}
        <li><div className="divider"></div></li>
        
        {/* Gestión de Contenido */}
        <li><a className="subheader">Gestión de Contenido</a></li>
        
        <li className={isActive('/admin/blog')}>
          <Link to="/admin/blog" className="waves-effect">
            <i className="material-icons">article</i>Blog
          </Link>
        </li>
        
        <li className={isActive('/admin/paginas')}>
          <Link to="/admin/paginas" className="waves-effect">
            <i className="material-icons">pages</i>Páginas
          </Link>
        </li>
        
        <li className={isActive('/admin/comentarios')}>
          <Link to="/admin/comentarios" className="waves-effect">
            <i className="material-icons">comment</i>Comentarios
          </Link>
        </li>
        
        {/* Divider */}
        <li><div className="divider"></div></li>
        
        {/* Logout */}
        <li>
          <a data-testid="logout" onClick={handleLogout} className="waves-effect" style={{ cursor: 'pointer' }}>
            <i className="material-icons">exit_to_app</i>Cerrar Sesión
          </a>
        </li>
      </ul>
      
      {/* Botón hamburguesa para móvil */}
      <a href="#" data-target="slide-out" className="sidenav-trigger btn-floating btn-large waves-effect waves-light green hide-on-large-only">
        <i className="material-icons">menu</i>
      </a>
      
      {/* Contenido principal */}
      <main className="main-content">
        <Outlet /> {/* Aquí se renderizan Dashboard, Productos, etc. */}
      </main>
    </div>
  );
}
