import { useEffect } from 'react';
import { Comentarios } from '../components/Comentarios';

export function ComentariosPage() {
  useEffect(() => {
    document.title = 'Comentarios - Admin | HuertoHogar';
  }, []);

  return (
    <div className="container">
      <Comentarios />
    </div>
  );
}
