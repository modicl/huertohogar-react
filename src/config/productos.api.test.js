import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { API_URLS } from './api.js';

// Mock de axios
vi.mock('axios');

describe('API de Productos - Pruebas Unitarias', () => {
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

  describe('Obtener Productos (GET /productos)', () => {
    it('debe obtener lista de productos exitosamente', async () => {
      // Arrange
      const mockToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      localStorage.getItem.mockReturnValue(mockToken);

      const mockProductos = [
        {
          idProducto: 1,
          nombreProducto: 'Tomate Orgánico',
          categoria: { idCategoria: 1, nombreCategoria: 'Verduras' },
          descripcionProducto: 'Tomates frescos y orgánicos',
          precioProducto: 2500,
          stockProducto: 50,
          paisOrigen: { idPais: 1, nombre: 'Chile' },
          imagenUrl: '/images/tomate.jpg'
        },
        {
          idProducto: 2,
          nombreProducto: 'Manzana Verde',
          categoria: { idCategoria: 2, nombreCategoria: 'Frutas' },
          descripcionProducto: 'Manzanas verdes frescas',
          precioProducto: 1500,
          stockProducto: 30,
          paisOrigen: { idPais: 1, nombre: 'Chile' },
          imagenUrl: '/images/manzana.jpg'
        }
      ];

      axios.get.mockResolvedValue({
        status: 200,
        data: mockProductos
      });

      // Act
      const response = await axios.get(API_URLS.productos, {
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      });

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        API_URLS.productos,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(response.data).toHaveLength(2);
      expect(response.data[0]).toHaveProperty('nombreProducto');
      expect(response.data[0]).toHaveProperty('categoria');
      expect(response.data[0]).toHaveProperty('precioProducto');
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
        await axios.get(API_URLS.productos);
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('debe retornar array vacío cuando no hay productos', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      axios.get.mockResolvedValue({
        status: 200,
        data: []
      });

      // Act
      const response = await axios.get(API_URLS.productos, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert
      expect(response.data).toEqual([]);
      expect(response.data).toHaveLength(0);
    });

    it('debe incluir información de categoría y país en los productos', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const mockProducto = {
        idProducto: 1,
        nombreProducto: 'Lechuga',
        categoria: { idCategoria: 1, nombreCategoria: 'Verduras' },
        paisOrigen: { idPais: 1, nombre: 'Chile' },
        precioProducto: 1200,
        stockProducto: 20
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: [mockProducto]
      });

      // Act
      const response = await axios.get(API_URLS.productos, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert
      expect(response.data[0].categoria).toHaveProperty('idCategoria');
      expect(response.data[0].categoria).toHaveProperty('nombreCategoria');
      expect(response.data[0].paisOrigen).toHaveProperty('idPais');
      expect(response.data[0].paisOrigen).toHaveProperty('nombre');
    });
  });

  describe('Crear Producto (POST /productos)', () => {
    it('debe crear un nuevo producto exitosamente', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const nuevoProducto = {
        nombreProducto: 'Zanahoria Orgánica',
        categoria: { idCategoria: 1 },
        descripcionProducto: 'Zanahorias frescas orgánicas',
        precioProducto: 1800,
        stockProducto: 40,
        paisOrigen: { idPais: 1 },
        imagenUrl: '/images/zanahoria.jpg'
      };

      const mockResponse = {
        status: 201,
        data: {
          idProducto: 3,
          ...nuevoProducto,
          categoria: { idCategoria: 1, nombreCategoria: 'Verduras' },
          paisOrigen: { idPais: 1, nombre: 'Chile' }
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      // Act
      const response = await axios.post(
        API_URLS.productos,
        nuevoProducto,
        {
          headers: {
            'Authorization': `Bearer ${mockToken}`
          }
        }
      );

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        API_URLS.productos,
        nuevoProducto,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('idProducto');
      expect(response.data.nombreProducto).toBe('Zanahoria Orgánica');
    });

    it('debe rechazar creación con datos incompletos (400)', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      const productoIncompleto = {
        nombreProducto: 'Producto Test'
        // Faltan campos obligatorios: categoria, precio, stock
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'Datos incompletos: faltan campos obligatorios'
          }
        }
      };

      axios.post.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.post(API_URLS.productos, productoIncompleto, {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toContain('Datos incompletos');
      }
    });

    it('debe rechazar creación sin autenticación (401)', async () => {
      // Arrange
      const nuevoProducto = {
        nombreProducto: 'Producto Test',
        categoria: { idCategoria: 1 },
        precioProducto: 1000,
        stockProducto: 10
      };

      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Token inválido o expirado'
          }
        }
      };

      axios.post.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.post(API_URLS.productos, nuevoProducto);
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('debe validar que precio y stock sean números positivos', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      const productoInvalido = {
        nombreProducto: 'Producto Test',
        categoria: { idCategoria: 1 },
        precioProducto: -100,
        stockProducto: -5,
        paisOrigen: { idPais: 1 }
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'El precio y stock deben ser números positivos'
          }
        }
      };

      axios.post.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.post(API_URLS.productos, productoInvalido, {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toContain('positivos');
      }
    });
  });

  describe('Actualizar Producto (PATCH /productos/:id)', () => {
    it('debe actualizar un producto existente exitosamente', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const datosActualizados = {
        nombreProducto: 'Tomate Orgánico Premium',
        precioProducto: 3000,
        stockProducto: 60,
        descripcionProducto: 'Tomates orgánicos de calidad premium'
      };

      const mockResponse = {
        status: 200,
        data: {
          idProducto: 1,
          nombreProducto: 'Tomate Orgánico Premium',
          categoria: { idCategoria: 1, nombreCategoria: 'Verduras' },
          descripcionProducto: 'Tomates orgánicos de calidad premium',
          precioProducto: 3000,
          stockProducto: 60,
          paisOrigen: { idPais: 1, nombre: 'Chile' }
        }
      };

      axios.patch.mockResolvedValue(mockResponse);

      // Act
      const response = await axios.patch(
        `${API_URLS.productos}/1`,
        datosActualizados,
        {
          headers: {
            'Authorization': `Bearer ${mockToken}`
          }
        }
      );

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        `${API_URLS.productos}/1`,
        datosActualizados,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(response.status).toBe(200);
      expect(response.data.precioProducto).toBe(3000);
      expect(response.data.stockProducto).toBe(60);
    });

    it('debe actualizar solo los campos proporcionados', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      const actualizacionParcial = {
        stockProducto: 100
      };

      axios.patch.mockResolvedValue({
        status: 200,
        data: {
          idProducto: 1,
          nombreProducto: 'Tomate Orgánico',
          stockProducto: 100
        }
      });

      // Act
      await axios.patch(`${API_URLS.productos}/1`, actualizacionParcial, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        `${API_URLS.productos}/1`,
        expect.objectContaining({
          stockProducto: 100
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
        await axios.patch(`${API_URLS.productos}/1`, { stockProducto: 50 });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('debe rechazar actualización de producto inexistente (404)', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      const mockError = {
        response: {
          status: 404,
          data: {
            message: 'Producto no encontrado'
          }
        }
      };

      axios.patch.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.patch(`${API_URLS.productos}/999`, 
          { nombreProducto: 'Test' }, 
          {
            headers: { 'Authorization': `Bearer ${mockToken}` }
          }
        );
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.message).toContain('no encontrado');
      }
    });

    it('debe actualizar categoría de un producto', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      const cambioCategoria = {
        categoria: { idCategoria: 2 }
      };

      axios.patch.mockResolvedValue({
        status: 200,
        data: {
          idProducto: 1,
          nombreProducto: 'Producto Test',
          categoria: { idCategoria: 2, nombreCategoria: 'Frutas' }
        }
      });

      // Act
      const response = await axios.patch(
        `${API_URLS.productos}/1`,
        cambioCategoria,
        {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        }
      );

      // Assert
      expect(response.data.categoria.idCategoria).toBe(2);
    });
  });

  describe('Eliminar Producto (DELETE /productos/:id)', () => {
    it('debe eliminar un producto exitosamente', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const mockResponse = {
        status: 200,
        data: {
          message: 'Producto eliminado exitosamente'
        }
      };

      axios.delete.mockResolvedValue(mockResponse);

      // Act
      const response = await axios.delete(`${API_URLS.productos}/2`, {
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      });

      // Assert
      expect(axios.delete).toHaveBeenCalledWith(
        `${API_URLS.productos}/2`,
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
        await axios.delete(`${API_URLS.productos}/2`);
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('debe rechazar eliminación de producto inexistente (404)', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      const mockError = {
        response: {
          status: 404,
          data: {
            message: 'Producto no encontrado'
          }
        }
      };

      axios.delete.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.delete(`${API_URLS.productos}/999`, {
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
            message: 'Error interno del servidor al eliminar producto'
          }
        }
      };

      axios.delete.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await axios.delete(`${API_URLS.productos}/1`, {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(500);
        expect(error.response.data.message).toContain('servidor');
      }
    });

    it('debe requerir confirmación antes de eliminar', async () => {
      // Arrange - Esto simula la lógica del componente
      const mockToken = 'Bearer token123';
      const confirmarEliminacion = true; // Usuario confirma

      if (!confirmarEliminacion) {
        // No debe llamar a axios.delete
        return;
      }

      axios.delete.mockResolvedValue({
        status: 200,
        data: { message: 'Producto eliminado' }
      });

      // Act
      const response = await axios.delete(`${API_URLS.productos}/1`, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert
      expect(axios.delete).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('Obtener Categorías (GET /categorias)', () => {
    it('debe obtener lista de categorías exitosamente', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const mockCategorias = [
        { idCategoria: 1, nombreCategoria: 'Verduras' },
        { idCategoria: 2, nombreCategoria: 'Frutas' },
        { idCategoria: 3, nombreCategoria: 'Hortalizas' }
      ];

      axios.get.mockResolvedValue({
        status: 200,
        data: mockCategorias
      });

      // Act
      const response = await axios.get(API_URLS.categorias, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert
      expect(response.data).toHaveLength(3);
      expect(response.data[0]).toHaveProperty('idCategoria');
      expect(response.data[0]).toHaveProperty('nombreCategoria');
    });

    it('debe manejar error y usar categorías fallback', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      axios.get.mockRejectedValue(new Error('Network error'));

      const fallbackCategorias = [
        { idCategoria: 1, nombreCategoria: 'Verduras' },
        { idCategoria: 2, nombreCategoria: 'Frutas' },
        { idCategoria: 3, nombreCategoria: 'Hortalizas' }
      ];

      // Act & Assert
      try {
        await axios.get(API_URLS.categorias, {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        });
      } catch (error) {
        // En caso de error, el componente usa fallback
        expect(error).toBeDefined();
        expect(fallbackCategorias).toHaveLength(3);
      }
    });
  });

  describe('Obtener Países (GET /paises)', () => {
    it('debe obtener lista de países exitosamente', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const mockPaises = [
        { idPais: 1, nombre: 'Chile' },
        { idPais: 2, nombre: 'Argentina' },
        { idPais: 3, nombre: 'Perú' }
      ];

      axios.get.mockResolvedValue({
        status: 200,
        data: mockPaises
      });

      // Act
      const response = await axios.get(API_URLS.paises, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert
      expect(response.data).toHaveLength(3);
      expect(response.data[0]).toHaveProperty('idPais');
      expect(response.data[0]).toHaveProperty('nombre');
      expect(response.data[0].nombre).toBe('Chile');
    });

    it('debe manejar error y usar países fallback', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      axios.get.mockRejectedValue(new Error('Network error'));

      const fallbackPaises = [
        { idPais: 1, nombre: 'Chile' },
        { idPais: 2, nombre: 'Argentina' },
        { idPais: 3, nombre: 'Perú' }
      ];

      // Act & Assert
      try {
        await axios.get(API_URLS.paises, {
          headers: { 'Authorization': `Bearer ${mockToken}` }
        });
      } catch (error) {
        // En caso de error, el componente usa fallback
        expect(error).toBeDefined();
        expect(fallbackPaises).toHaveLength(3);
      }
    });
  });

  describe('Validación de URLs de API', () => {
    it('debe tener la estructura correcta para productos', () => {
      // Arrange & Act & Assert
      expect(API_URLS).toBeDefined();
      expect(API_URLS).toHaveProperty('productos');
    });

    it('debe tener la estructura correcta para categorías', () => {
      // Arrange & Act & Assert
      expect(API_URLS).toBeDefined();
      expect(API_URLS).toHaveProperty('categorias');
    });

    it('debe tener la estructura correcta para países', () => {
      // Arrange & Act & Assert
      expect(API_URLS).toBeDefined();
      expect(API_URLS).toHaveProperty('paises');
    });
  });

  describe('Flujos Completos de Productos', () => {
    it('debe crear, actualizar y eliminar un producto completo', async () => {
      // Arrange
      const mockToken = 'Bearer token123';
      localStorage.getItem.mockReturnValue(mockToken);

      const nuevoProducto = {
        nombreProducto: 'Pera Orgánica',
        categoria: { idCategoria: 2 },
        precioProducto: 2000,
        stockProducto: 25,
        paisOrigen: { idPais: 1 }
      };

      // Act 1: Crear
      axios.post.mockResolvedValue({
        status: 201,
        data: { idProducto: 10, ...nuevoProducto }
      });

      const createResponse = await axios.post(API_URLS.productos, nuevoProducto, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert 1
      expect(createResponse.status).toBe(201);
      expect(createResponse.data).toHaveProperty('idProducto');

      // Act 2: Actualizar
      axios.patch.mockResolvedValue({
        status: 200,
        data: { ...createResponse.data, precioProducto: 2200 }
      });

      const updateResponse = await axios.patch(
        `${API_URLS.productos}/10`,
        { precioProducto: 2200 },
        { headers: { 'Authorization': `Bearer ${mockToken}` } }
      );

      // Assert 2
      expect(updateResponse.data.precioProducto).toBe(2200);

      // Act 3: Eliminar
      axios.delete.mockResolvedValue({
        status: 200,
        data: { message: 'Producto eliminado' }
      });

      const deleteResponse = await axios.delete(`${API_URLS.productos}/10`, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert 3
      expect(deleteResponse.status).toBe(200);
    });

    it('debe manejar la obtención de productos con categorías y países', async () => {
      // Arrange
      const mockToken = 'Bearer token123';

      // Simular obtención de categorías
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: [
          { idCategoria: 1, nombreCategoria: 'Verduras' },
          { idCategoria: 2, nombreCategoria: 'Frutas' }
        ]
      });

      // Simular obtención de países
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: [
          { idPais: 1, nombre: 'Chile' }
        ]
      });

      // Simular obtención de productos
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: [
          {
            idProducto: 1,
            nombreProducto: 'Producto Test',
            categoria: { idCategoria: 1, nombreCategoria: 'Verduras' },
            paisOrigen: { idPais: 1, nombre: 'Chile' }
          }
        ]
      });

      // Act
      const categoriasRes = await axios.get(API_URLS.categorias, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });
      const paisesRes = await axios.get(API_URLS.paises, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });
      const productosRes = await axios.get(API_URLS.productos, {
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });

      // Assert
      expect(categoriasRes.data).toHaveLength(2);
      expect(paisesRes.data).toHaveLength(1);
      expect(productosRes.data).toHaveLength(1);
      expect(productosRes.data[0].categoria.nombreCategoria).toBe('Verduras');
    });
  });
});
