import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  // Mostrar loading mientras se carga el contexto
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="preloader-wrapper big active">
          <div className="spinner-layer spinner-green-only">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Verificar si el usuario está autenticado y es ADMIN
  if (!user || user.rol !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Si está autenticado y es ADMIN, mostrar el contenido
  return children;
}
