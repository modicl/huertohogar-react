import { useEffect } from 'react';
import { Productos } from '../components/Productos';

export function ProductosPage() {
  useEffect(() => {
    document.title = 'Productos - Admin | HuertoHogar';
  }, []);

  return (
    <div className="container">
      <Productos />
    </div>
  );
}
