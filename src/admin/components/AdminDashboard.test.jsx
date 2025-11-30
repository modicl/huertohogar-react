import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import axios from 'axios';

// Mock de axios
vi.mock('axios');

// Mock de la configuración de API
vi.mock('../../config/api.js', () => ({
  API_URLS: {
    ordenes: 'http://test-api/ordenes'
  }
}));

// Mock de AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    token: 'mock-token',
    user: { email: 'admin@test.com', rol: 'ADMIN' },
    isAuthenticated: () => true
  })
}));

// Helper para renderizar con Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Mock de datos de prueba de la API
const mockOrdenesAPI = [
  {
    idOrden: 1,
    idUsuario: 12345,
    fechaOrden: '2025-10-15T10:00:00.000Z',
    estado: 'Completado',
    totalOrden: 15000,
    direccionEnvio: 'Calle Test 123'
  },
  {
    idOrden: 2,
    idUsuario: 67890,
    fechaOrden: '2025-10-18T14:30:00.000Z',
    estado: 'Pendiente',
    totalOrden: 8500,
    direccionEnvio: 'Avenida Principal 456'
  },
  {
    idOrden: 3,
    idUsuario: 11111,
    fechaOrden: '2025-10-19T09:15:00.000Z',
    estado: 'Cancelado',
    totalOrden: 5000,
    direccionEnvio: 'Calle Cancelada 789'
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
    localStorage.setItem('productos', JSON.stringify(mockProductos));
    localStorage.setItem('token', 'mock-token');
    
    // Mock de axios.get para retornar órdenes
    axios.get.mockResolvedValue({ data: mockOrdenesAPI });
  });

  afterEach(() => {
    // Limpiar después de cada test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe renderizar el dashboard sin errores', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
      expect(screen.getByText('Resumen general del sistema')).toBeInTheDocument();
    });
  });

  it('debe mostrar las 4 tarjetas de estadísticas principales', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      // Verificar que existen las 4 tarjetas estadísticas
      expect(screen.getByText('Ventas Totales')).toBeInTheDocument();
      expect(screen.getByText('Total Pedidos')).toBeInTheDocument();
      expect(screen.getByText('Pedidos Pendientes')).toBeInTheDocument();
      expect(screen.getByText('Stock Bajo')).toBeInTheDocument();
    });
  });

  it('debe calcular correctamente las ventas totales (excluyendo cancelados)', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      // Ventas totales = 15000 (Completado) + 8500 (Pendiente) = 23500
      // No debe incluir el pedido cancelado de 5000
      expect(screen.getByText('$23.500')).toBeInTheDocument();
    });
  });

  it('debe mostrar el total de pedidos correctamente', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      // Total de órdenes = 3
      const totalPedidosCard = screen.getByText('Total Pedidos').closest('.stat-card');
      expect(within(totalPedidosCard).getByText('3')).toBeInTheDocument();
    });
  });

  it('debe contar correctamente los pedidos pendientes', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      // Solo 1 pedido pendiente
      const pendientesCard = screen.getByText('Pedidos Pendientes').closest('.stat-card');
      expect(within(pendientesCard).getByText('1')).toBeInTheDocument();
    });
  });

  it('debe mostrar la cantidad de productos con stock bajo', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      // 2 productos con stock bajo (5 y 3)
      const stockBajoCard = screen.getByText('Stock Bajo').closest('.stat-card');
      expect(within(stockBajoCard).getByText('2')).toBeInTheDocument();
    });
  });

  it('debe mostrar la tabla de pedidos recientes', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Pedidos Recientes/i)).toBeInTheDocument();
      
      // Verificar que la tabla tiene los encabezados correctos
      expect(screen.getByText('ID Pedido')).toBeInTheDocument();
      expect(screen.getByText('ID Usuario')).toBeInTheDocument();
      expect(screen.getByText('Fecha')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('Estado')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });
  });

  it('debe mostrar los totales de cada pedido con formato correcto', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      // Verificar que los totales están formateados correctamente
      expect(screen.getByText('$15.000')).toBeInTheDocument();
      expect(screen.getByText('$8.500')).toBeInTheDocument();
      expect(screen.getByText('$5.000')).toBeInTheDocument();
    });
  });

  it('debe mostrar badges con los estados correctos', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Completado')).toBeInTheDocument();
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('Cancelado')).toBeInTheDocument();
    });
  });

  it('debe aplicar las clases CSS correctas según el estado del pedido', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      const completadoBadge = screen.getByText('Completado');
      const pendienteBadge = screen.getByText('Pendiente');
      const canceladoBadge = screen.getByText('Cancelado');
      
      expect(completadoBadge).toHaveClass('badge-success');
      expect(pendienteBadge).toHaveClass('badge-warning');
      expect(canceladoBadge).toHaveClass('badge-danger');
    });
  });

  it('debe tener un botón "Ver todos" que navega a pedidos', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      const verTodosButton = screen.getByRole('button', { name: /ver todos/i });
      expect(verTodosButton).toBeInTheDocument();
    });
  });

  it('debe tener botones de acción (visibility) para cada pedido', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      // Verificar que hay botones de visibilidad
      const visibilityButtons = screen.getAllByText('visibility');
      expect(visibilityButtons.length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar mensaje cuando no hay pedidos registrados', async () => {
    // Configurar mock para retornar lista vacía
    axios.get.mockResolvedValue({ data: [] });
    
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No hay pedidos registrados')).toBeInTheDocument();
    });
  });

  it('debe cargar datos desde la API', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('debe renderizar los iconos de Material Icons correctamente', async () => {
    renderWithRouter(<AdminDashboard />);
    
    await waitFor(() => {
      // Verificar algunos iconos principales
      expect(screen.getByText('attach_money')).toBeInTheDocument();
      expect(screen.getByText('shopping_cart')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByText('warning')).toBeInTheDocument();
    });
  });
});
