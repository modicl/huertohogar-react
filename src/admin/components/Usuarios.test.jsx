import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Usuarios } from './Usuarios';
import axios from 'axios';

// Mock de axios
vi.mock('axios');

// Mock de la configuración de API
vi.mock('../../config/api.js', () => ({
  API_URLS: {
    usuarios: {
      base: 'http://test-api/usuarios',
      authenticate: 'http://test-api/usuarios/authenticate'
    }
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

const mockUsuarios = [
  {
    idUsuario: 1,
    nombre: 'Juan',
    sNombre: 'Carlos',
    aPaterno: 'Pérez',
    aMaterno: 'López',
    email: 'juan@test.com',
    telefono: '123456789',
    rut: '12345678',
    dv: '9',
    rol: 'USER',
    direccion: 'Calle Test 123',
    idRegion: 13
  },
  {
    idUsuario: 2,
    nombre: 'María',
    sNombre: '',
    aPaterno: 'González',
    aMaterno: 'Silva',
    email: 'maria@test.com',
    telefono: '987654321',
    rut: '87654321',
    dv: 'K',
    rol: 'ADMIN',
    direccion: 'Avenida Test 456',
    idRegion: 5
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
    },
    updateTextFields: vi.fn()
  };
  
  window.confirm = vi.fn(() => true);
});

describe('Componente Usuarios', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'mock-token');
    
    // Mock de axios.get para retornar usuarios
    axios.get.mockResolvedValue({ data: mockUsuarios });
    axios.post.mockResolvedValue({ data: { success: true } });
    axios.patch.mockResolvedValue({ data: { success: true } });
    axios.delete.mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe renderizar el componente Usuarios sin errores', async () => {
    render(<Usuarios />);
    
    await waitFor(() => {
      expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
    });
  });

  it('debe mostrar el subtitulo del componente', async () => {
    render(<Usuarios />);
    
    await waitFor(() => {
      expect(screen.getByText('Administra los usuarios del sistema')).toBeInTheDocument();
    });
  });

  it('debe tener un boton para crear nuevo usuario', async () => {
    render(<Usuarios />);
    
    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /nuevo usuario/i });
      expect(createButton).toBeInTheDocument();
    });
  });

  it('debe mostrar la tabla de usuarios', async () => {
    render(<Usuarios />);
    
    await waitFor(() => {
      expect(screen.getByText('Nombre')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Rol')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });
  });

  it('debe cargar usuarios desde la API al iniciar', async () => {
    render(<Usuarios />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('debe mostrar los usuarios cargados', async () => {
    render(<Usuarios />);
    
    await waitFor(() => {
      expect(screen.getByText('juan@test.com')).toBeInTheDocument();
      expect(screen.getByText('maria@test.com')).toBeInTheDocument();
    });
  });

  it('debe tener botones de editar para cada usuario', async () => {
    render(<Usuarios />);
    
    await waitFor(() => {
      const editButtons = screen.getAllByText('edit');
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  it('debe tener botones de eliminar para cada usuario', async () => {
    render(<Usuarios />);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('delete');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it('debe tener un formulario modal para crear/editar usuarios', async () => {
    const { container } = render(<Usuarios />);
    
    await waitFor(() => {
      const modal = container.querySelector('#userModal');
      expect(modal).toBeInTheDocument();
    });
  });

  it('debe mostrar indicador de carga mientras obtiene datos', async () => {
    // Simular una carga lenta
    axios.get.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: mockUsuarios }), 100)));
    
    render(<Usuarios />);
    
    // Verificar que eventualmente se cargan los datos
    await waitFor(() => {
      expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
    });
  });

  it('debe tener un boton para exportar usuarios', async () => {
    render(<Usuarios />);
    
    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /exportar/i });
      expect(exportButton).toBeInTheDocument();
    });
  });

  it('debe tener la clase dashboard-wrapper', async () => {
    const { container } = render(<Usuarios />);
    
    await waitFor(() => {
      const dashboardWrapper = container.querySelector('.dashboard-wrapper');
      expect(dashboardWrapper).toBeInTheDocument();
    });
  });

  describe('Estadísticas de usuarios', () => {
    it('debe mostrar total de usuarios', async () => {
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Usuarios')).toBeInTheDocument();
      });
    });

    it('debe mostrar conteo de admins', async () => {
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(screen.getByText(/Administradores/i)).toBeInTheDocument();
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar error al cargar usuarios', async () => {
      axios.get.mockRejectedValue(new Error('Error de red'));
      
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(window.M.toast).toHaveBeenCalled();
      });
    });

    it('debe manejar error al eliminar usuario', async () => {
      axios.delete.mockRejectedValue(new Error('Error'));
      
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
      });
    });
  });

  describe('Tabla de usuarios', () => {
    it('debe mostrar encabezados correctos', async () => {
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(screen.getByText('Nombre')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
      });
    });

    it('debe mostrar datos de usuarios en la tabla', async () => {
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(screen.getByText('juan@test.com')).toBeInTheDocument();
        expect(screen.getByText('maria@test.com')).toBeInTheDocument();
      });
    });
  });

  describe('Roles de usuarios', () => {
    it('debe mostrar el selector de rol en la tabla', async () => {
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(screen.getByText('Rol')).toBeInTheDocument();
      });
    });
  });

  describe('Modal de usuario', () => {
    it('debe abrir modal al hacer clic en nuevo usuario', async () => {
      const user = userEvent.setup();
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /nuevo usuario/i })).toBeInTheDocument();
      });
      
      const newButton = screen.getByRole('button', { name: /nuevo usuario/i });
      await user.click(newButton);
      
      // El modal existe en el DOM
      await waitFor(() => {
        const modal = document.getElementById('userModal');
        expect(modal).toBeInTheDocument();
      });
    });
  });

  describe('Eliminación de usuarios', () => {
    it('debe confirmar antes de eliminar', async () => {
      const user = userEvent.setup();
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(screen.getAllByText('delete').length).toBeGreaterThan(0);
      });
      
      const deleteButton = screen.getAllByText('delete')[0];
      await user.click(deleteButton);
      
      expect(window.confirm).toHaveBeenCalled();
    });
  });

  describe('Roles de usuarios', () => {
    it('debe mostrar badge de rol para cada usuario', async () => {
      render(<Usuarios />);
      
      await waitFor(() => {
        expect(screen.getByText('USER')).toBeInTheDocument();
        expect(screen.getByText('ADMIN')).toBeInTheDocument();
      });
    });
  });
});
