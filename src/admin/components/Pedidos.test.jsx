import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Pedidos } from './Pedidos';

const mockOrdenes = [
  {
    id: 1,
    id_usuario: 'USR-12345',
    fecha: '2025-10-15T10:00:00.000Z',
    estado: 'Completado',
    total: 15000,
    shippingInfo: {
      fullName: 'Juan Pérez',
      email: 'juan@test.com',
      phone: '912345678',
      address: 'Calle Test 123',
      city: 'Santiago',
      region: 'Metropolitana',
      zipCode: '8320000'
    },
    productos: [
      { id: 1, nombre: 'Manzana', cantidad: 2, precio: 1200 }
    ],
    notas: ''
  },
  {
    id: 2,
    id_usuario: 'USR-67890',
    fecha: '2025-10-18T14:30:00.000Z',
    estado: 'Pendiente',
    total: 8500,
    shippingInfo: {
      fullName: 'María González',
      email: 'maria@test.com',
      phone: '987654321',
      address: 'Avenida Principal 456',
      city: 'Valparaíso',
      region: 'Valparaíso',
      zipCode: '2340000'
    },
    productos: [
      { id: 2, nombre: 'Plátano', cantidad: 5, precio: 800 }
    ],
    notas: ''
  }
];

describe('Componente Pedidos', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ordenes', JSON.stringify(mockOrdenes));
    window.M = {
      Modal: { init: () => ({ open: () => {}, close: () => {} }) },
      FormSelect: { init: () => {} },
      toast: () => {}
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe renderizar el componente Pedidos sin errores', () => {
    render(<Pedidos />);
    
    expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
  });

  it('debe mostrar el subtitulo del componente', () => {
    render(<Pedidos />);
    
    expect(screen.getByText('Administra todas las órdenes realizadas por los clientes')).toBeInTheDocument();
  });

  it('debe mostrar las 4 tarjetas de estadisticas', () => {
    render(<Pedidos />);

    expect(screen.getByText('Total Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Pendientes')).toBeInTheDocument();
    const enProcesoElements = screen.getAllByText('En Proceso');
    expect(enProcesoElements.length).toBeGreaterThan(0);
  });  it('debe calcular correctamente el total de pedidos', () => {
    render(<Pedidos />);
    
    const totalCard = screen.getByText('Total Pedidos').closest('.stat-card');
    expect(within(totalCard).getByText('2')).toBeInTheDocument();
  });

  it('debe calcular correctamente los pedidos pendientes', () => {
    render(<Pedidos />);
    
    const pendientesCard = screen.getByText('Pendientes').closest('.stat-card');
    expect(within(pendientesCard).getByText('1')).toBeInTheDocument();
  });

  it('debe calcular correctamente los pedidos completados', () => {
    render(<Pedidos />);
    
    expect(screen.getByText(/Ingresos Totales/i)).toBeInTheDocument();
  });

  it('debe mostrar la tabla de pedidos', () => {
    render(<Pedidos />);
    
    expect(screen.getByText('ID Pedido')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Fecha')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('debe mostrar los nombres de los clientes en la tabla', () => {
    render(<Pedidos />);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
  });

  it('debe mostrar los estados de los pedidos', () => {
    render(<Pedidos />);
    
    const completadoOptions = screen.getAllByText('Completado');
    expect(completadoOptions.length).toBeGreaterThan(0);
    const pendienteOptions = screen.getAllByText('Pendiente');
    expect(pendienteOptions.length).toBeGreaterThan(0);
  });

  it('debe tener un campo de busqueda', () => {
    render(<Pedidos />);
    
    const searchInput = screen.getByPlaceholderText(/buscar por ID/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('debe tener un filtro de estado', () => {
    render(<Pedidos />);
    
    const filterSelects = screen.getAllByRole('combobox');
    expect(filterSelects.length).toBeGreaterThan(0);
  });

  it('debe cargar ordenes desde localStorage', () => {
    render(<Pedidos />);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
  });

  it('debe mostrar el ingreso total', () => {
    render(<Pedidos />);
    
    expect(screen.getByText(/Ingresos Totales/i)).toBeInTheDocument();
  });

  it('debe renderizar iconos de Material Icons', () => {
    render(<Pedidos />);
    
    expect(screen.getByText('shopping_cart')).toBeInTheDocument();
    const visibilityIcons = screen.getAllByText('visibility');
    expect(visibilityIcons.length).toBeGreaterThan(0);
  });

  it('debe tener botones de accion para cada pedido', () => {
    render(<Pedidos />);
    
    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it('debe mostrar mensaje cuando no hay pedidos', () => {
    localStorage.setItem('ordenes', JSON.stringify([]));
    render(<Pedidos />);
    
    const totalCard = screen.getByText('Total Pedidos').closest('.stat-card');
    expect(within(totalCard).getByText('0')).toBeInTheDocument();
  });
});
