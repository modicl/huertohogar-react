import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { AdminLogin } from './AdminLogin';
import { AuthProvider } from '../../context/AuthContext';
import { API_URLS } from '../../config/api.js';

// Mock de axios
vi.mock('axios');

// Mock de react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Helper para renderizar con contexto completo
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AdminLogin Component - Mensaje de Logueo Exitoso y Validaciones', () => {
  beforeEach(() => {
    // Limpiar navigate mock
    mockNavigate.mockClear();
    
    // Mock de localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true
    });

    // Limpiar los mocks de axios
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Renderizado Inicial', () => {
    it('debe renderizar el componente AdminLogin sin errores', () => {
      // Arrange & Act
      renderWithProviders(<AdminLogin />);

      // Assert
      expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
      expect(screen.getByText('HuertoHogar')).toBeInTheDocument();
    });

    it('debe mostrar el logo de HuertoHogar', () => {
      // Arrange & Act
      renderWithProviders(<AdminLogin />);

      // Assert
      const logo = screen.getByAltText('HuertoHogar');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/images/logo_navbar.png');
    });

    it('debe tener campos de email y password', () => {
      // Arrange & Act
      renderWithProviders(<AdminLogin />);

      // Assert
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('debe tener un botón de iniciar sesión', () => {
      // Arrange & Act
      renderWithProviders(<AdminLogin />);

      // Assert
      const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
      expect(loginButton).toBeInTheDocument();
    });

    it('debe tener un enlace para volver al sitio', () => {
      // Arrange & Act
      renderWithProviders(<AdminLogin />);

      // Assert
      const backLink = screen.getByText('Volver al sitio');
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('debe tener campos vacíos inicialmente', () => {
      // Arrange & Act
      renderWithProviders(<AdminLogin />);

      // Assert
      expect(screen.getByLabelText('Email')).toHaveValue('');
      expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    });

    it('debe tener campos requeridos', () => {
      // Arrange & Act
      renderWithProviders(<AdminLogin />);

      // Assert
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    it('no debe mostrar error inicialmente', () => {
      // Arrange & Act
      renderWithProviders(<AdminLogin />);

      // Assert
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Login Exitoso - Usuario ADMIN', () => {
    it('debe iniciar sesión exitosamente con credenciales de ADMIN y navegar al panel', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockResponse = {
        status: 200,
        data: {
          idUsuario: 1,
          nombre: 'Juan',
          sNombre: 'Carlos',
          aPaterno: 'Pérez',
          aMaterno: 'González',
          rut: '12345678',
          dv: '9',
          fechaNacimiento: '1990-01-01',
          idRegion: 13,
          direccion: 'Calle 123',
          email: 'admin@test.com',
          telefono: '+56912345678',
          rol: 'ADMIN',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
        }
      };

      axios.post.mockResolvedValue(mockResponse);
      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'admin@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'admin123');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          API_URLS.usuarios.authenticate,
          {
            email: 'admin@test.com',
            password: 'admin123'
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('user', expect.any(String));
        expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.data.token);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin');
      }, { timeout: 3000 });
    });

    it('debe almacenar correctamente los datos del usuario en localStorage', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockResponse = {
        status: 200,
        data: {
          idUsuario: 1,
          nombre: 'María',
          aPaterno: 'López',
          email: 'maria@admin.com',
          rol: 'ADMIN',
          token: 'valid-admin-token-123'
        }
      };

      axios.post.mockResolvedValue(mockResponse);
      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'maria@admin.com');
      await user.type(screen.getByLabelText('Contraseña'), 'password123');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'valid-admin-token-123');
      });

      await waitFor(() => {
        const userCall = localStorage.setItem.mock.calls.find(call => call[0] === 'user');
        expect(userCall).toBeDefined();
        const userData = JSON.parse(userCall[1]);
        expect(userData.email).toBe('maria@admin.com');
        expect(userData.rol).toBe('ADMIN');
      });
    });

    it('debe mostrar el botón con estado de carga durante el login', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockResponse = {
        status: 200,
        data: {
          idUsuario: 1,
          nombre: 'Test',
          aPaterno: 'User',
          email: 'test@admin.com',
          rol: 'ADMIN',
          token: 'token123'
        }
      };

      // Simular una petición con delay
      axios.post.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
      );

      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'test@admin.com');
      await user.type(screen.getByLabelText('Contraseña'), 'password');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert - verificar estado de carga
      expect(screen.getByText('Iniciando...')).toBeInTheDocument();

      // Esperar a que termine
      await waitFor(() => {
        expect(screen.queryByText('Iniciando...')).not.toBeInTheDocument();
      });
    });

    it('debe deshabilitar el botón durante el proceso de login', async () => {
      // Arrange
      const user = userEvent.setup();
      axios.post.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          status: 200,
          data: { rol: 'ADMIN', token: 'token', email: 'test@test.com' }
        }), 100))
      );

      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'test@admin.com');
      await user.type(screen.getByLabelText('Contraseña'), 'password');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      // Assert
      expect(submitButton).toBeDisabled();

      // Esperar a que termine y se habilite nuevamente
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Validación de Rol ADMIN', () => {
    it('debe rechazar login de usuario con rol USER y mostrar mensaje de error', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockResponse = {
        status: 200,
        data: {
          idUsuario: 2,
          nombre: 'Usuario',
          email: 'user@test.com',
          rol: 'USER',
          token: 'user-token'
        }
      };

      axios.post.mockResolvedValue(mockResponse);
      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'user@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'password123');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert - Debe mostrar mensaje de error (esto es lo más importante)
      await waitFor(() => {
        expect(screen.getByText(/acceso denegado.*no tienes permisos de administrador/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // No debe guardar el token del usuario USER
      const setItemCalls = localStorage.setItem.mock.calls;
      const tokenCall = setItemCalls.find(call => call[0] === 'token' && call[1] === 'user-token');
      expect(tokenCall).toBeUndefined();
    });

    it('debe permitir login solo a usuarios con rol ADMIN', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockAdminResponse = {
        status: 200,
        data: {
          email: 'admin@test.com',
          rol: 'ADMIN',
          token: 'admin-token'
        }
      };

      axios.post.mockResolvedValue(mockAdminResponse);
      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'admin@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'admin123');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin');
      });

      expect(screen.queryByText(/acceso denegado/i)).not.toBeInTheDocument();
    });
  });

  describe('Mensajes de Error - Estructura AAA', () => {
    it('debe mostrar mensaje de error para credenciales incorrectas (401)', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Email o contraseña incorrectos.'
          }
        }
      };

      axios.post.mockRejectedValue(mockError);
      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'wrong@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/email o contraseña incorrectos/i)).toBeInTheDocument();
      });
    });

    it('debe mostrar mensaje de error para acceso denegado (403)', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockError = {
        response: {
          status: 403,
          data: {
            message: 'Acceso denegado. No tienes permisos de administrador.'
          }
        }
      };

      axios.post.mockRejectedValue(mockError);
      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'user@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'password');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/acceso denegado.*no tienes permisos de administrador/i)).toBeInTheDocument();
      });
    });

    it('debe mostrar mensaje de error de conexión', async () => {
      // Arrange
      const user = userEvent.setup();
      axios.post.mockRejectedValue({
        request: {},
        message: 'Network Error'
      });

      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'admin@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'password');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/no se pudo conectar con el servidor.*verifica tu conexión/i)).toBeInTheDocument();
      });
    });

    it('debe limpiar mensaje de error al intentar login nuevamente', async () => {
      // Arrange
      const user = userEvent.setup();
      
      // Primer intento - error
      axios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Email o contraseña incorrectos.' }
        }
      });

      renderWithProviders(<AdminLogin />);

      await user.type(screen.getByLabelText('Email'), 'wrong@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'wrong');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      await waitFor(() => {
        expect(screen.getByText(/email o contraseña incorrectos/i)).toBeInTheDocument();
      });

      // Act - Segundo intento exitoso
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { rol: 'ADMIN', token: 'token', email: 'admin@test.com' }
      });

      await user.clear(screen.getByLabelText('Email'));
      await user.clear(screen.getByLabelText('Contraseña'));
      await user.type(screen.getByLabelText('Email'), 'admin@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'correct');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert
      await waitFor(() => {
        expect(screen.queryByText(/email o contraseña incorrectos/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Interacción del Formulario', () => {
    it('debe permitir escribir en el campo de email', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<AdminLogin />);

      // Act
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'test@example.com');

      // Assert
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('debe permitir escribir en el campo de password', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<AdminLogin />);

      // Act
      const passwordInput = screen.getByLabelText('Contraseña');
      await user.type(passwordInput, 'password123');

      // Assert
      expect(passwordInput).toHaveValue('password123');
    });

    it('debe enviar formulario al presionar Enter', async () => {
      // Arrange
      const user = userEvent.setup();
      axios.post.mockResolvedValue({
        status: 200,
        data: { rol: 'ADMIN', token: 'token', email: 'admin@test.com' }
      });

      renderWithProviders(<AdminLogin />);

      // Act
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'admin@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'password{Enter}');

      // Assert
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });
  });

  describe('Integración con AuthContext', () => {
    it('debe incluir campos de compatibilidad (pnombre, apaterno)', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockResponse = {
        status: 200,
        data: {
          idUsuario: 1,
          nombre: 'Juan',
          aPaterno: 'Pérez',
          email: 'juan@test.com',
          rol: 'ADMIN',
          token: 'token'
        }
      };

      axios.post.mockResolvedValue(mockResponse);
      renderWithProviders(<AdminLogin />);

      // Act
      await user.type(screen.getByLabelText('Email'), 'juan@test.com');
      await user.type(screen.getByLabelText('Contraseña'), 'password');
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Assert
      await waitFor(() => {
        const userCall = localStorage.setItem.mock.calls.find(call => call[0] === 'user');
        const userData = JSON.parse(userCall[1]);
        expect(userData).toHaveProperty('pnombre', 'Juan');
        expect(userData).toHaveProperty('apaterno', 'Pérez');
      });
    });
  });
});
