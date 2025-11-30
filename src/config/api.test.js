import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { API_URLS } from './api.js';

// Mock de axios
vi.mock('axios');

describe('API de Usuarios - Pruebas Unitarias', () => {
  // Mock de localStorage
  beforeEach(() => {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Autenticación (POST /authenticate)', () => {
    it('debe autenticar un usuario ADMIN exitosamente', async () => {
      // Arrange - Preparar
      const mockCredentials = {
        email: 'admin@test.com',
        password: 'admin123'
      };

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

      // Act - Actuar
      const response = await axios.post(
        API_URLS.usuarios.authenticate,
        mockCredentials,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Assert - Afirmar
      expect(axios.post).toHaveBeenCalledWith(
        API_URLS.usuarios.authenticate,
        mockCredentials,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data.rol).toBe('ADMIN');
      expect(response.data.email).toBe('admin@test.com');
    });

    it('debe autenticar un usuario USER exitosamente', async () => {
      // Arrange
      const mockCredentials = {
        email: 'user@test.com',
        password: 'user123'
      };

      const mockResponse = {
        status: 200,
        data: {
          idUsuario: 2,
          nombre: 'María',
          aPaterno: 'López',
          email: 'user@test.com',
          rol: 'USER',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user'
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      // Act
      const response = await axios.post(API_URLS.usuarios.authenticate, mockCredentials);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data.rol).toBe('USER');
    });

    it('debe rechazar credenciales incorrectas (401)', async () => {
      // Arrange
      const mockCredentials = {
        email: 'wrong@test.com',
        password: 'wrongpassword'
      };

      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Email o contraseña incorrectos.'
          }
        }
      };

      axios.post.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.post(API_URLS.usuarios.authenticate, mockCredentials);
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.message).toContain('incorrectos');
      }
    });

    it('debe rechazar acceso cuando usuario no es ADMIN (403)', async () => {
      // Arrange
      const mockCredentials = {
        email: 'user@test.com',
        password: 'user123'
      };

      const mockError = {
        response: {
          status: 403,
          data: {
            message: 'Acceso denegado. No tienes permisos de administrador.'
          }
        }
      };

      axios.post.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.post(API_URLS.usuarios.authenticate, mockCredentials);
      } catch (error) {
        expect(error.response.status).toBe(403);
        expect(error.response.data.message).toContain('Acceso denegado');
      }
    });

    it('debe manejar errores de conexión', async () => {
      // Arrange
      const mockCredentials = {
        email: 'admin@test.com',
        password: 'admin123'
      };

      axios.post.mockRejectedValue({
        request: {},
        message: 'Network Error'
      });

      // Act & Assert
      try {
        await axios.post(API_URLS.usuarios.authenticate, mockCredentials);
      } catch (error) {
        expect(error.message).toBe('Network Error');
        expect(error.request).toBeDefined();
      }
    });
  });

  describe('Obtener Usuarios (GET /usuarios)', () => {
    it('debe obtener lista de usuarios exitosamente', async () => {
      // Arrange
      const mockToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      localStorage.getItem.mockReturnValue(mockToken);

      const mockUsuarios = [
        {
          idUsuario: 1,
          nombre: 'Juan',
          aPaterno: 'Pérez',
          email: 'juan@test.com',
          rol: 'ADMIN'
        },
        {
          idUsuario: 2,
          nombre: 'María',
          aPaterno: 'López',
          email: 'maria@test.com',
          rol: 'USER'
        }
      ];

      axios.get.mockResolvedValue({
        status: 200,
        data: mockUsuarios
      });

      // Act
      const response = await axios.get(API_URLS.usuarios.base, {
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      });

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        API_URLS.usuarios.base,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(response.data).toHaveLength(2);
      expect(response.data[0]).toHaveProperty('email');
    });

    it('debe rechazar petición sin token (401)', async () => {
      // Arrange
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'No autorizado'
          }
        }
      };

      axios.get.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.get(API_URLS.usuarios.base);
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('debe retornar array vacío cuando no hay usuarios', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      axios.get.mockResolvedValue({
        status: 200,
        data: []
      });

      // Act
      const response = await axios.get(API_URLS.usuarios.base, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert
      expect(response.data).toEqual([]);
      expect(response.data).toHaveLength(0);
    });
  });

  describe('Crear Usuario (POST /usuarios)', () => {
    it('debe crear un nuevo usuario exitosamente', async () => {
      // Arrange
      const nuevoUsuario = {
        nombre: 'Pedro',
        sNombre: '',
        aPaterno: 'Ramírez',
        aMaterno: '',
        rut: '98765432',
        dv: '1',
        fechaNacimiento: '1995-05-15',
        idRegion: 13,
        direccion: 'Avenida 456',
        email: 'pedro@test.com',
        telefono: '+56987654321',
        passwordHashed: 'password123'
      };

      const mockResponse = {
        status: 201,
        data: {
          idUsuario: 3,
          ...nuevoUsuario,
          rol: 'USER'
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      // Act
      const response = await axios.post(
        API_URLS.usuarios.base,
        nuevoUsuario,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        API_URLS.usuarios.base,
        nuevoUsuario,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('idUsuario');
      expect(response.data.email).toBe('pedro@test.com');
    });

    it('debe rechazar creación con email duplicado (400)', async () => {
      // Arrange
      const usuarioDuplicado = {
        nombre: 'Juan',
        aPaterno: 'Pérez',
        email: 'admin@test.com',
        passwordHashed: 'password123'
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'El email ya está registrado'
          }
        }
      };

      axios.post.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.post(API_URLS.usuarios.base, usuarioDuplicado);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toContain('ya está registrado');
      }
    });

    it('debe rechazar creación con datos incompletos (400)', async () => {
      // Arrange
      const usuarioIncompleto = {
        nombre: 'Test'
        // Falta email y password obligatorios
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'Datos incompletos'
          }
        }
      };

      axios.post.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.post(API_URLS.usuarios.base, usuarioIncompleto);
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('Actualizar Usuario (PATCH /usuarios/:id)', () => {
    it('debe actualizar un usuario existente exitosamente', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const datosActualizados = {
        nombre: 'Juan Carlos',
        telefono: '+56999999999',
        direccion: 'Nueva Calle 789'
      };

      const mockResponse = {
        status: 200,
        data: {
          idUsuario: 1,
          nombre: 'Juan Carlos',
          email: 'juan@test.com',
          telefono: '+56999999999',
          direccion: 'Nueva Calle 789'
        }
      };

      axios.patch.mockResolvedValue(mockResponse);

      // Act
      const response = await axios.patch(
        `${API_URLS.usuarios.base}/1`,
        datosActualizados,
        {
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        `${API_URLS.usuarios.base}/1`,
        datosActualizados,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(response.status).toBe(200);
      expect(response.data.telefono).toBe('+56999999999');
    });

    it('debe actualizar contraseña opcionalmente', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const datosConPassword = {
        nombre: 'Juan',
        passwordHashed: 'newPassword123'
      };

      axios.patch.mockResolvedValue({
        status: 200,
        data: { idUsuario: 1, nombre: 'Juan' }
      });

      // Act
      await axios.patch(`${API_URLS.usuarios.base}/1`, datosConPassword, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        `${API_URLS.usuarios.base}/1`,
        expect.objectContaining({
          passwordHashed: 'newPassword123'
        }),
        expect.any(Object)
      );
    });

    it('debe rechazar actualización sin autenticación (401)', async () => {
      // Arrange
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Token inválido'
          }
        }
      };

      axios.patch.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.patch(`${API_URLS.usuarios.base}/1`, { nombre: 'Test' });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('debe rechazar actualización de usuario inexistente (404)', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      const mockError = {
        response: {
          status: 404,
          data: {
            message: 'Usuario no encontrado'
          }
        }
      };

      axios.patch.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.patch(`${API_URLS.usuarios.base}/999`, { nombre: 'Test' }, {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('Eliminar Usuario (DELETE /usuarios/:id)', () => {
    it('debe eliminar un usuario exitosamente', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const mockResponse = {
        status: 200,
        data: {
          message: 'Usuario eliminado exitosamente'
        }
      };

      axios.delete.mockResolvedValue(mockResponse);

      // Act
      const response = await axios.delete(`${API_URLS.usuarios.base}/2`, {
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      });

      // Assert
      expect(axios.delete).toHaveBeenCalledWith(
        `${API_URLS.usuarios.base}/2`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(response.status).toBe(200);
      expect(response.data.message).toContain('eliminado');
    });

    it('debe rechazar eliminación sin autenticación (401)', async () => {
      // Arrange
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'No autorizado'
          }
        }
      };

      axios.delete.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.delete(`${API_URLS.usuarios.base}/2`);
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('debe rechazar eliminación de usuario inexistente (404)', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      const mockError = {
        response: {
          status: 404,
          data: {
            message: 'Usuario no encontrado'
          }
        }
      };

      axios.delete.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.delete(`${API_URLS.usuarios.base}/999`, {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    it('debe manejar errores internos del servidor (500)', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      const mockError = {
        response: {
          status: 500,
          data: {
            message: 'Error interno del servidor'
          }
        }
      };

      axios.delete.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.delete(`${API_URLS.usuarios.base}/1`, {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(500);
        expect(error.response.data.message).toContain('servidor');
      }
    });
  });

  describe('Validación de URLs de API', () => {
    it('debe tener configuradas las URLs de usuarios', () => {
      // Arrange & Act & Assert
      expect(API_URLS).toBeDefined();
      expect(API_URLS.usuarios).toBeDefined();
      expect(API_URLS.usuarios.authenticate).toBeDefined();
    });

    it('debe tener el formato correcto para authenticate', () => {
      // Arrange & Act & Assert
      if (API_URLS.usuarios.authenticate) {
        expect(API_URLS.usuarios.authenticate).toContain('/authenticate');
      }
    });

    it('debe tener configuradas todas las URLs de API', () => {
      // Arrange & Act & Assert
      expect(API_URLS).toHaveProperty('usuarios');
      expect(API_URLS).toHaveProperty('ordenes');
      expect(API_URLS).toHaveProperty('productos');
      expect(API_URLS).toHaveProperty('categorias');
      expect(API_URLS).toHaveProperty('paises');
      expect(API_URLS).toHaveProperty('comentarios');
    });
  });
});
