import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  // Verificar si el usuario está autenticado
  const isAuthenticated = localStorage.getItem('adminToken');
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Si está autenticado, mostrar el contenido
  return children;
}
