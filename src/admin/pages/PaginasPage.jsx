import { useEffect } from 'react';
import { Paginas } from '../components/Paginas';

export function PaginasPage() {
  useEffect(() => {
    document.title = 'Páginas - Admin | HuertoHogar';
  }, []);

  return (
    <div className="container">
      <Paginas />
    </div>
  );
}
