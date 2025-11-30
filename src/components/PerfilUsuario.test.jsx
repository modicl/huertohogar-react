import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PerfilUsuario } from './PerfilUsuario';
import axios from 'axios';

// Mock de axios
vi.mock('axios');

// Mock de API_URLS
vi.mock('../config/api.js', () => ({
  API_URLS: {
    ordenes: 'http://test-api/ordenes',
    productos: 'http://test-api/productos'
  }
}));

// Mock de Header y Footer
vi.mock('./Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('./Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Footer</div>
}));

// Variable para controlar el mock de useAuth
let mockAuthValue = {
  user: {
    idUsuario: 1,
    nombre: 'Juan',
    pnombre: 'Juan',
    sNombre: 'Carlos',
    aPaterno: 'Pérez',
    apaterno: 'Pérez',
    aMaterno: 'López',
    amaterno: 'López',
    email: 'juan@test.com',
    rut: '12345678',
    dv: '9',
    fechaNacimiento: '1990-05-15',
    telefono: '+56912345678',
    idRegion: 13,
    direccion: 'Av. Providencia 1234',
    rol: 'USER'
  },
  token: 'fake-token-123',
  logout: vi.fn()
};

// Mock de AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthValue
}));

// Mock de window.M (Materialize)
beforeEach(() => {
  vi.clearAllMocks();
  
  // Reset auth mock
  mockAuthValue = {
    user: {
      idUsuario: 1,
      nombre: 'Juan',
      pnombre: 'Juan',
      sNombre: 'Carlos',
      aPaterno: 'Pérez',
      apaterno: 'Pérez',
      aMaterno: 'López',
      amaterno: 'López',
      email: 'juan@test.com',
      rut: '12345678',
      dv: '9',
      fechaNacimiento: '1990-05-15',
      telefono: '+56912345678',
      idRegion: 13,
      direccion: 'Av. Providencia 1234',
      rol: 'USER'
    },
    token: 'fake-token-123',
    logout: vi.fn()
  };

  // Mock default de axios
  axios.get.mockResolvedValue({ data: [] });

  // Mock de window.M
  window.M = {
    toast: vi.fn(),
    Modal: {
      init: vi.fn()
    },
    FormSelect: {
      init: vi.fn()
    }
  };

  // Mock de window.location
  delete window.location;
  window.location = { href: '' };
});

afterEach(() => {
  vi.clearAllMocks();
});

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <PerfilUsuario />
    </MemoryRouter>
  );
};

describe('PerfilUsuario Component', () => {
  describe('Renderizado básico', () => {
    it('debe renderizar el componente correctamente', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
      });
    });

    it('debe mostrar el menú lateral con opciones', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('Mi Cuenta')).toBeInTheDocument();
        expect(screen.getAllByText(/Resumen/).length).toBeGreaterThan(0);
        expect(screen.getByText(/Mis Órdenes/)).toBeInTheDocument();
        expect(screen.getByText(/Cerrar Sesión/)).toBeInTheDocument();
      });
    });

    it('debe mostrar la vista de resumen por defecto', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText(/Bienvenido, Juan!/)).toBeInTheDocument();
      });
    });
  });

  describe('Vista de Resumen', () => {
    it('debe mostrar información personal del usuario', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('Información Personal')).toBeInTheDocument();
        expect(screen.getByText('Nombre Completo:')).toBeInTheDocument();
        expect(screen.getByText('Email:')).toBeInTheDocument();
        expect(screen.getByText('juan@test.com')).toBeInTheDocument();
      });
    });

    it('debe mostrar el RUT del usuario', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('RUT:')).toBeInTheDocument();
        expect(screen.getByText('12345678-9')).toBeInTheDocument();
      });
    });

    it('debe mostrar la fecha de nacimiento formateada', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('Fecha de Nacimiento:')).toBeInTheDocument();
      });
    });

    it('debe mostrar teléfono y región', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('Teléfono:')).toBeInTheDocument();
        expect(screen.getByText('+56912345678')).toBeInTheDocument();
        expect(screen.getByText('Región:')).toBeInTheDocument();
      });
    });

    it('debe mostrar la dirección del usuario', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('Dirección:')).toBeInTheDocument();
        expect(screen.getByText('Av. Providencia 1234')).toBeInTheDocument();
      });
    });

    it('debe mostrar el rol del usuario', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('Rol:')).toBeInTheDocument();
        expect(screen.getByText('USER')).toBeInTheDocument();
      });
    });

    it('debe mostrar el resumen de actividad', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('Resumen de actividad')).toBeInTheDocument();
        expect(screen.getByText('Órdenes totales')).toBeInTheDocument();
        expect(screen.getByText('Total gastado')).toBeInTheDocument();
        expect(screen.getByText('Entregadas')).toBeInTheDocument();
      });
    });

    it('debe mostrar estadísticas correctas con órdenes', async () => {
      const mockOrdenes = [
        { idOrden: 1, totalOrden: 10000, estado: 'Entregado', fechaOrden: '2025-01-01' },
        { idOrden: 2, totalOrden: 15000, estado: 'Pendiente', fechaOrden: '2025-01-02' }
      ];
      axios.get.mockResolvedValue({ data: mockOrdenes });
      
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument(); // Total órdenes
        expect(screen.getByText('1')).toBeInTheDocument(); // Entregadas
      });
    });
  });

  describe('Vista de Órdenes', () => {
    it('debe cambiar a vista de órdenes al hacer click', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const ordenesLink = screen.getByText(/Mis Órdenes/);
      await user.click(ordenesLink);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Mis Órdenes/i })).toBeInTheDocument();
      });
    });

    it('debe mostrar mensaje cuando no hay órdenes', async () => {
      const user = userEvent.setup();
      axios.get.mockResolvedValue({ data: [] });
      
      renderComponent();
      
      const ordenesLink = screen.getByText(/Mis Órdenes/);
      await user.click(ordenesLink);
      
      await waitFor(() => {
        expect(screen.getByText('No tienes órdenes registradas aún.')).toBeInTheDocument();
      });
    });

    it('debe mostrar las órdenes del usuario', async () => {
      const user = userEvent.setup();
      const mockOrdenes = [
        {
          idOrden: 123,
          fechaOrden: '2025-01-15T10:00:00Z',
          estado: 'Entregado',
          totalOrden: 25000,
          detalleOrden: [
            { producto: { nombreProducto: 'Tomate Orgánico' }, cantidad: 2, precioUnitario: 5000 }
          ]
        }
      ];
      axios.get.mockResolvedValue({ data: mockOrdenes });
      
      renderComponent();
      
      const ordenesLink = screen.getByText(/Mis Órdenes/);
      await user.click(ordenesLink);
      
      await waitFor(() => {
        expect(screen.getByText('Orden #123')).toBeInTheDocument();
        expect(screen.getByText('Entregado')).toBeInTheDocument();
      });
    });

    it('debe mostrar detalles de productos en la orden', async () => {
      const user = userEvent.setup();
      const mockOrdenes = [
        {
          idOrden: 1,
          fechaOrden: '2025-01-15',
          estado: 'Pendiente',
          totalOrden: 15000,
          detalleOrden: [
            { producto: { nombreProducto: 'Manzana Verde', idProducto: 1 }, cantidad: 3, precioUnitario: 2500 },
            { producto: { nombreProducto: 'Zanahoria', idProducto: 2 }, cantidad: 2, precioUnitario: 1500 }
          ]
        }
      ];
      axios.get.mockResolvedValue({ data: mockOrdenes });
      
      renderComponent();
      
      const ordenesLink = screen.getByText(/Mis Órdenes/);
      await user.click(ordenesLink);
      
      await waitFor(() => {
        expect(screen.getByText(/Manzana Verde/)).toBeInTheDocument();
        expect(screen.getByText(/Zanahoria/)).toBeInTheDocument();
      });
    });

    it('debe mostrar mensaje cuando no hay detalles de orden', async () => {
      const user = userEvent.setup();
      const mockOrdenes = [
        {
          idOrden: 1,
          fechaOrden: '2025-01-15',
          estado: 'Pendiente',
          totalOrden: 0,
          detalleOrden: []
        }
      ];
      axios.get.mockResolvedValue({ data: mockOrdenes });
      
      renderComponent();
      
      const ordenesLink = screen.getByText(/Mis Órdenes/);
      await user.click(ordenesLink);
      
      await waitFor(() => {
        expect(screen.getByText('No hay detalles disponibles')).toBeInTheDocument();
      });
    });
  });

  describe('Navegación entre vistas', () => {
    it('debe volver a resumen desde órdenes', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      // Ir a órdenes
      await user.click(screen.getByText(/Mis Órdenes/));
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Mis Órdenes/i })).toBeInTheDocument();
      });
      
      // Volver a resumen
      await user.click(screen.getByText(/Resumen/));
      await waitFor(() => {
        expect(screen.getByText(/Bienvenido, Juan!/)).toBeInTheDocument();
      });
    });
  });

  describe('Cerrar sesión', () => {
    it('debe llamar a logout y redirigir al hacer click en cerrar sesión', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const logoutLink = screen.getByText(/Cerrar Sesión/);
      await user.click(logoutLink);
      
      expect(mockAuthValue.logout).toHaveBeenCalled();
      expect(window.location.href).toBe('/registro');
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar error al cargar órdenes', async () => {
      axios.get.mockRejectedValue(new Error('Error de red'));
      
      renderComponent();
      
      await waitFor(() => {
        expect(window.M.toast).toHaveBeenCalledWith({
          html: 'Error al cargar tus órdenes',
          classes: 'red'
        });
      });
    });

    it('debe manejar error 500 al cargar órdenes', async () => {
      axios.get.mockRejectedValue({ 
        response: { status: 500, data: 'Internal Server Error' }
      });
      
      renderComponent();
      
      await waitFor(() => {
        expect(window.M.toast).toHaveBeenCalled();
      });
    });
  });

  describe('Sin token', () => {
    it('no debe cargar órdenes si no hay token', async () => {
      mockAuthValue.token = null;
      
      renderComponent();
      
      await waitFor(() => {
        expect(axios.get).not.toHaveBeenCalled();
      });
    });
  });

  describe('Usuario con rol ADMIN', () => {
    it('debe mostrar badge verde para rol ADMIN', async () => {
      mockAuthValue.user.rol = 'ADMIN';
      
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('ADMIN')).toBeInTheDocument();
      });
    });
  });

  describe('Datos opcionales', () => {
    it('debe mostrar "No disponible" para campos vacíos', async () => {
      mockAuthValue.user.telefono = null;
      mockAuthValue.user.direccion = null;
      mockAuthValue.user.fechaNacimiento = null;
      
      renderComponent();
      
      await waitFor(() => {
        const noDisponibleElements = screen.getAllByText('No disponible');
        expect(noDisponibleElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Estado de carga de órdenes', () => {
    it('debe mostrar mensaje cuando no hay órdenes', async () => {
      const user = userEvent.setup();
      
      // Simular sin órdenes
      axios.get.mockResolvedValue({ data: [] });
      
      renderComponent();
      
      const ordenesLink = screen.getByText(/Mis Órdenes/);
      await user.click(ordenesLink);
      
      await waitFor(() => {
        expect(screen.getByText('No tienes órdenes registradas aún.')).toBeInTheDocument();
      });
    });
  });
});
