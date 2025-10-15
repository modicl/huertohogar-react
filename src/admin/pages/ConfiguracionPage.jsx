import { useEffect } from 'react';
import { Configuracion } from '../components/Configuracion';

export function ConfiguracionPage() {
  useEffect(() => {
    document.title = 'Configuración - Admin | HuertoHogar';
  }, []);

  return (
    <div className="container">
      <Configuracion />
    </div>
  );
}
