import { useEffect } from 'react';
import { Pedidos } from '../components/Pedidos';

export function PedidosPage() {
  useEffect(() => {
    document.title = 'Pedidos - Admin | HuertoHogar';
  }, []);

  return (
    <div className="container">
      <Pedidos />
    </div>
  );
}
