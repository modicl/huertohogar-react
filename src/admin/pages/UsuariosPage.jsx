import { useEffect } from 'react';
import { Usuarios } from '../components/Usuarios';

export function UsuariosPage() {
  useEffect(() => {
    document.title = 'Usuarios - Admin | HuertoHogar';
  }, []);

  return (
    <div className="container">
      <Usuarios />
    </div>
  );
}
