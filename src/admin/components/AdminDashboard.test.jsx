import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';

// Helper para renderizar con Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Mock de datos de prueba
const mockOrdenes = [
  {
    id: 1,
    id_usuario: 'USR-12345',
    fecha: '2025-10-15T10:00:00.000Z',
    estado: 'Completado',
    total: 15000,
    shippingInfo: {
      nombre: 'Juan Pérez'
    },
    productos: []
  },
  {
    id: 2,
    id_usuario: 'USR-67890',
    fecha: '2025-10-18T14:30:00.000Z',
    estado: 'Pendiente',
    total: 8500,
    shippingInfo: {
      nombre: 'María González'
    },
    productos: []
  },
  {
    id: 3,
    id_usuario: 'USR-11111',
    fecha: '2025-10-19T09:15:00.000Z',
    estado: 'Cancelado',
    total: 5000,
    shippingInfo: {
      nombre: 'Pedro López'
    },
    productos: []
  }
];

const mockProductos = [
  {
    id: 1,
    nombre: 'Manzana Roja',
    precio: 1200,
    stock: 50
  },
  {
    id: 2,
    nombre: 'Plátano',
    precio: 800,
    stock: 5  // Stock bajo
  },
  {
    id: 3,
    nombre: 'Naranja',
    precio: 1000,
    stock: 3  // Stock bajo
  }
];

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    // Configurar datos mock en localStorage
    localStorage.setItem('ordenes', JSON.stringify(mockOrdenes));
    localStorage.setItem('productos', JSON.stringify(mockProductos));
  });

  afterEach(() => {
    // Limpiar después de cada test
    localStorage.clear();
  });

  it('debe renderizar el dashboard sin errores', () => {
    renderWithRouter(<AdminDashboard />);
    
    expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    expect(screen.getByText('Resumen general del sistema')).toBeInTheDocument();
  });

  it('debe mostrar las 4 tarjetas de estadísticas principales', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Verificar que existen las 4 tarjetas estadísticas
    expect(screen.getByText('Ventas Totales')).toBeInTheDocument();
    expect(screen.getByText('Total Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Pedidos Pendientes')).toBeInTheDocument();
    expect(screen.getByText('Stock Bajo')).toBeInTheDocument();
  });

  it('debe calcular correctamente las ventas totales (excluyendo cancelados)', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Ventas totales = 15000 (Completado) + 8500 (Pendiente) = 23500
    // No debe incluir el pedido cancelado de 5000
    expect(screen.getByText('$23.500')).toBeInTheDocument();
  });

  it('debe mostrar el total de pedidos correctamente', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Total de órdenes = 3
    const totalPedidosCard = screen.getByText('Total Pedidos').closest('.stat-card');
    expect(within(totalPedidosCard).getByText('3')).toBeInTheDocument();
  });

  it('debe contar correctamente los pedidos pendientes', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Solo 1 pedido pendiente
    const pendientesCard = screen.getByText('Pedidos Pendientes').closest('.stat-card');
    expect(within(pendientesCard).getByText('1')).toBeInTheDocument();
  });

  it('debe mostrar la cantidad de productos con stock bajo (menos de 10)', () => {
    renderWithRouter(<AdminDashboard />);
    
    // 2 productos con stock bajo (5 y 3)
    const stockBajoCard = screen.getByText('Stock Bajo').closest('.stat-card');
    expect(within(stockBajoCard).getByText('2')).toBeInTheDocument();
  });

  it('debe mostrar la tabla de pedidos recientes', () => {
    renderWithRouter(<AdminDashboard />);
    
    expect(screen.getByText('Pedidos Recientes')).toBeInTheDocument();
    
    // Verificar que la tabla tiene los encabezados correctos
    expect(screen.getByText('ID Pedido')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Fecha')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it('debe mostrar hasta 5 pedidos recientes ordenados por fecha', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Verificar que se muestran los clientes en la tabla
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
    expect(screen.getByText('Pedro López')).toBeInTheDocument();
  });

  it('debe mostrar los ID de usuario en formato correcto', () => {
    renderWithRouter(<AdminDashboard />);
    
    expect(screen.getByText('#USR-12345')).toBeInTheDocument();
    expect(screen.getByText('#USR-67890')).toBeInTheDocument();
    expect(screen.getByText('#USR-11111')).toBeInTheDocument();
  });

  it('debe mostrar los totales de cada pedido con formato correcto', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Verificar que los totales están formateados correctamente
    expect(screen.getByText('$15.000')).toBeInTheDocument();
    expect(screen.getByText('$8.500')).toBeInTheDocument();
    expect(screen.getByText('$5.000')).toBeInTheDocument();
  });

  it('debe mostrar badges con los estados correctos', () => {
    renderWithRouter(<AdminDashboard />);
    
    expect(screen.getByText('Completado')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });

  it('debe aplicar las clases CSS correctas según el estado del pedido', () => {
    renderWithRouter(<AdminDashboard />);
    
    const completadoBadge = screen.getByText('Completado');
    const pendienteBadge = screen.getByText('Pendiente');
    const canceladoBadge = screen.getByText('Cancelado');
    
    expect(completadoBadge).toHaveClass('badge-success');
    expect(pendienteBadge).toHaveClass('badge-warning');
    expect(canceladoBadge).toHaveClass('badge-danger');
  });

  it('debe tener un botón "Ver todos" que navega a pedidos', () => {
    renderWithRouter(<AdminDashboard />);
    
    const verTodosButton = screen.getByRole('button', { name: /ver todos/i });
    expect(verTodosButton).toBeInTheDocument();
  });

  it('debe tener botones de acción (visibility) para cada pedido', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Verificar que hay 3 botones de visibilidad (uno por cada pedido)
    const visibilityButtons = screen.getAllByText('visibility');
    expect(visibilityButtons).toHaveLength(3);
  });

  it('debe mostrar mensaje cuando no hay pedidos registrados', () => {
    // Configurar localStorage sin órdenes
    localStorage.setItem('ordenes', JSON.stringify([]));
    
    renderWithRouter(<AdminDashboard />);
    
    expect(screen.getByText('No hay pedidos registrados')).toBeInTheDocument();
  });

  it('debe cargar datos desde localStorage si existen', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Verificar que se cargaron las órdenes desde localStorage
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    
    // Verificar que se calculó el stock bajo desde localStorage
    const stockBajoCard = screen.getByText('Stock Bajo').closest('.stat-card');
    expect(within(stockBajoCard).getByText('2')).toBeInTheDocument();
  });

  it('debe renderizar los iconos de Material Icons correctamente', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Verificar algunos iconos principales
    expect(screen.getByText('attach_money')).toBeInTheDocument();
    expect(screen.getByText('shopping_cart')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('warning')).toBeInTheDocument();
  });

  it('debe formatear las fechas en formato chileno (DD-MM-YYYY)', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Verificar que las fechas están en formato DD-MM-YYYY
    expect(screen.getByText('15-10-2025')).toBeInTheDocument();
    expect(screen.getByText('18-10-2025')).toBeInTheDocument();
    expect(screen.getByText('19-10-2025')).toBeInTheDocument();
  });
});
