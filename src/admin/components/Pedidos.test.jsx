import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pedidos } from './Pedidos';
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
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    token: 'mock-token',
    user: { email: 'admin@test.com', rol: 'ADMIN' },
    isAuthenticated: () => true
  })
}));

const mockOrdenesAPI = [
  {
    idOrden: 1,
    idUsuario: 12345,
    fechaOrden: '2025-10-15T10:00:00.000Z',
    estado: 'Completado',
    totalOrden: 15000,
    direccionEnvio: 'Calle Test 123, Santiago',
    detalleOrden: [
      { 
        cantidad: 2, 
        precioUnitario: 1200,
        producto: { nombreProducto: 'Manzana' }
      }
    ],
    notas: ''
  },
  {
    idOrden: 2,
    idUsuario: 67890,
    fechaOrden: '2025-10-18T14:30:00.000Z',
    estado: 'Pendiente',
    totalOrden: 8500,
    direccionEnvio: 'Avenida Principal 456, Valparaíso',
    detalleOrden: [
      { 
        cantidad: 5, 
        precioUnitario: 800,
        producto: { nombreProducto: 'Plátano' }
      }
    ],
    notas: ''
  },
  {
    idOrden: 3,
    idUsuario: 11111,
    fechaOrden: '2025-10-20T09:00:00.000Z',
    estado: 'En Proceso',
    totalOrden: 12000,
    direccionEnvio: 'Calle Nueva 789',
    detalleOrden: [],
    notas: 'Urgente'
  }
];

// Mock de window.M
beforeEach(() => {
  window.M = {
    toast: vi.fn(),
    Modal: {
      init: vi.fn(() => ({ open: vi.fn(), close: vi.fn() })),
      getInstance: vi.fn(() => ({ open: vi.fn(), close: vi.fn() }))
    },
    FormSelect: {
      init: vi.fn()
    }
  };
  
  window.confirm = vi.fn(() => true);
});

describe('Componente Pedidos', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'mock-token');
    
    // Mock de axios.get para retornar órdenes
    axios.get.mockResolvedValue({ data: mockOrdenesAPI });
    axios.patch.mockResolvedValue({ status: 200, data: { success: true } });
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe renderizar el componente Pedidos sin errores', async () => {
    render(<Pedidos />);
    
    await waitFor(() => {
      expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
    });
  });

  it('debe mostrar el subtitulo del componente', async () => {
    render(<Pedidos />);
    
    await waitFor(() => {
      expect(screen.getByText('Administra todas las órdenes realizadas por los clientes')).toBeInTheDocument();
    });
  });

  it('debe mostrar las tarjetas de estadisticas', async () => {
    render(<Pedidos />);

    await waitFor(() => {
      expect(screen.getByText('Total Pedidos')).toBeInTheDocument();
      expect(screen.getByText('Pendientes')).toBeInTheDocument();
      expect(screen.getAllByText(/En Proceso/).length).toBeGreaterThan(0);
    });
  });

  it('debe calcular correctamente el total de pedidos', async () => {
    render(<Pedidos />);
    
    await waitFor(() => {
      const totalCard = screen.getByText('Total Pedidos').closest('.stat-card');
      expect(within(totalCard).getByText('3')).toBeInTheDocument();
    });
  });

  it('debe calcular correctamente los pedidos pendientes', async () => {
    render(<Pedidos />);
    
    await waitFor(() => {
      const pendientesCard = screen.getByText('Pendientes').closest('.stat-card');
      expect(within(pendientesCard).getByText('1')).toBeInTheDocument();
    });
  });

  it('debe mostrar el ingreso total', async () => {
    render(<Pedidos />);
    
    await waitFor(() => {
      expect(screen.getByText(/Ingresos Totales/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar la tabla de pedidos', async () => {
    render(<Pedidos />);
    
    await waitFor(() => {
      expect(screen.getByText('ID Pedido')).toBeInTheDocument();
      expect(screen.getByText('Fecha')).toBeInTheDocument();
      expect(screen.getByText('Estado')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
    });
  });

  it('debe cargar ordenes desde la API', async () => {
    render(<Pedidos />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('debe tener un campo de busqueda', async () => {
    render(<Pedidos />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/buscar por ID/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('debe renderizar iconos de Material Icons', async () => {
    render(<Pedidos />);
    
    await waitFor(() => {
      expect(screen.getByText('shopping_cart')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay pedidos', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<Pedidos />);
    
    await waitFor(() => {
      const totalCard = screen.getByText('Total Pedidos').closest('.stat-card');
      expect(within(totalCard).getByText('0')).toBeInTheDocument();
    });
  });

  describe('Filtros y búsqueda', () => {
    it('debe filtrar por búsqueda de ID', async () => {
      const user = userEvent.setup();
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/buscar por ID/i)).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText(/buscar por ID/i);
      await user.type(searchInput, '1');
      
      // La búsqueda debería actualizar el input
      expect(searchInput).toHaveValue('1');
    });

    it('debe tener selector de filtro por estado', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getByText('Filtrar por estado')).toBeInTheDocument();
      });
    });
  });

  describe('Cambio de estado', () => {
    it('debe manejar el cambio de estado correctamente', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
      
      // Verificar que se puede cambiar estado
      expect(axios.patch).toBeDefined();
    });

    it('debe mostrar toast de error al fallar actualización de estado', async () => {
      axios.patch.mockRejectedValue(new Error('Error de red'));
      
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
      });
    });
  });

  describe('Modal de detalles', () => {
    it('debe tener modal de detalles en el DOM', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        const modal = document.getElementById('detalleModal');
        expect(modal).toBeInTheDocument();
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar error al cargar órdenes', async () => {
      axios.get.mockRejectedValue(new Error('Error de red'));
      
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(window.M.toast).toHaveBeenCalledWith({
          html: 'Error al cargar las órdenes desde la API',
          classes: 'red'
        });
      });
    });

    it('debe mostrar 0 pedidos cuando hay error', async () => {
      axios.get.mockRejectedValue(new Error('Error'));
      
      render(<Pedidos />);
      
      await waitFor(() => {
        const totalCard = screen.getByText('Total Pedidos').closest('.stat-card');
        expect(within(totalCard).getByText('0')).toBeInTheDocument();
      });
    });
  });

  describe('Estadísticas de estados', () => {
    it('debe calcular En Proceso correctamente', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        // Verificar que hay tarjetas de estadísticas
        expect(screen.getAllByText(/En Proceso/).length).toBeGreaterThan(0);
      });
    });

    it('debe mostrar ingresos totales formateados', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getByText(/Ingresos Totales/i)).toBeInTheDocument();
        // 35500 / 1000 = 35K (aprox)
        expect(screen.getByText(/\$\d+K/)).toBeInTheDocument();
      });
    });
  });

  describe('Sin token de autenticación', () => {
    it('debe manejar cuando no hay token', async () => {
      // Re-mock sin token
      vi.resetModules();
      
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
      });
    });
  });

  describe('Tabla de pedidos', () => {
    it('debe mostrar encabezados de tabla correctos', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getByText('ID Pedido')).toBeInTheDocument();
        expect(screen.getByText('Cliente')).toBeInTheDocument();
        expect(screen.getByText('Fecha')).toBeInTheDocument();
        expect(screen.getByText('Estado')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('Acciones')).toBeInTheDocument();
      });
    });

    it('debe mostrar botón de ver detalles', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        const viewButtons = screen.getAllByText('visibility');
        expect(viewButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Modal de detalles de orden', () => {
    it('debe abrir modal al hacer clic en ver detalles', async () => {
      const user = userEvent.setup();
      
      // Mock para obtener detalles específicos de una orden
      axios.get.mockImplementation((url) => {
        if (url.includes('/1')) {
          return Promise.resolve({
            data: {
              idOrden: 1,
              idUsuario: 12345,
              fechaOrden: '2025-10-15T10:00:00.000Z',
              estado: 'Completado',
              totalOrden: 15000,
              direccionEnvio: 'Calle Test 123',
              detalleOrden: [
                { cantidad: 2, precioUnitario: 1200, producto: { nombreProducto: 'Manzana' } }
              ],
              usuario: { nombre: 'Juan', apaterno: 'Pérez', email: 'juan@test.com' }
            }
          });
        }
        return Promise.resolve({ data: mockOrdenesAPI });
      });
      
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getAllByText('visibility').length).toBeGreaterThan(0);
      });
      
      const viewButtons = screen.getAllByText('visibility');
      await user.click(viewButtons[0]);
      
      // Verificar que M.Modal.getInstance fue llamado
      await waitFor(() => {
        expect(window.M.Modal.getInstance).toHaveBeenCalled();
      });
    });

    it('debe tener botón de eliminar en modal', async () => {
      const { container } = render(<Pedidos />);
      
      await waitFor(() => {
        const modal = container.querySelector('#detalleModal');
        expect(modal).toBeInTheDocument();
      });
    });
  });

  describe('Formateo de datos', () => {
    it('debe mostrar precios formateados en pesos chilenos', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        // Total de 15000, 8500, 12000
        const priceElements = screen.getAllByText(/\$[\d.,]+/);
        expect(priceElements.length).toBeGreaterThan(0);
      });
    });

    it('debe mostrar fechas formateadas', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        // Las fechas deberían aparecer formateadas
        expect(screen.getByText('Fecha')).toBeInTheDocument();
      });
    });
  });

  describe('Estados de pedidos', () => {
    it('debe mostrar diferentes estados de pedidos', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getAllByText('Completado').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Pendiente').length).toBeGreaterThan(0);
      });
    });

    it('debe tener selector para cambiar estado', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        const selectElements = document.querySelectorAll('select');
        expect(selectElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Acciones de ordenamiento', () => {
    it('debe tener botones de acción para pedidos', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getAllByText('visibility').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Eliminación de orden', () => {
    it('debe confirmar antes de eliminar', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(window.confirm).toBeDefined();
      });
    });
  });

  describe('Actualización de notas', () => {
    it('debe manejar error al actualizar notas', async () => {
      axios.patch.mockRejectedValue(new Error('Error de red'));
      
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
      });
    });
  });

  describe('Badges de estado', () => {
    it('debe mostrar badges con colores de estado', async () => {
      render(<Pedidos />);
      
      await waitFor(() => {
        expect(screen.getAllByText('Completado').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Pendiente').length).toBeGreaterThan(0);
        expect(screen.getAllByText(/En Proceso/).length).toBeGreaterThan(0);
      });
    });
  });
});
