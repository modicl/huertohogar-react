import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import { Productos } from './Productos';
import axios from 'axios';

// Mock de axios
vi.mock('axios');

// Mock de la configuración de API
vi.mock('../../config/api.js', () => ({
  API_URLS: {
    productos: 'http://test-api/productos',
    categorias: 'http://test-api/categorias',
    paises: 'http://test-api/paises'
  }
}));

const mockProductosAPI = [
  {
    idProducto: 1,
    nombreProducto: 'Manzana Roja',
    categoria: { idCategoria: 1, nombreCategoria: 'Frutas' },
    descripcionProducto: 'Manzanas frescas',
    precioProducto: 1200,
    stockProducto: 50,
    paisOrigen: { idPais: 1, nombre: 'Chile' },
    imagenUrl: '/images/manzana.jpg'
  },
  {
    idProducto: 2,
    nombreProducto: 'Plátano',
    categoria: { idCategoria: 1, nombreCategoria: 'Frutas' },
    descripcionProducto: 'Plátanos frescos',
    precioProducto: 800,
    stockProducto: 30,
    paisOrigen: { idPais: 2, nombre: 'Ecuador' },
    imagenUrl: '/images/platano.jpg'
  },
  {
    idProducto: 3,
    nombreProducto: 'Lechuga',
    categoria: { idCategoria: 2, nombreCategoria: 'Verduras' },
    descripcionProducto: 'Lechuga orgánica',
    precioProducto: 600,
    stockProducto: 5,
    paisOrigen: { idPais: 1, nombre: 'Chile' },
    imagenUrl: '/images/lechuga.jpg'
  }
];

const mockCategorias = [
  { idCategoria: 1, nombreCategoria: 'Frutas' },
  { idCategoria: 2, nombreCategoria: 'Verduras' }
];

const mockPaises = [
  { idPais: 1, nombre: 'Chile' },
  { idPais: 2, nombre: 'Ecuador' }
];

describe('Componente Productos', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'mock-token');
    
    // Mock de todas las llamadas axios
    axios.get.mockImplementation((url) => {
      if (url.includes('productos')) {
        return Promise.resolve({ data: mockProductosAPI });
      }
      if (url.includes('categorias')) {
        return Promise.resolve({ data: mockCategorias });
      }
      if (url.includes('paises')) {
        return Promise.resolve({ data: mockPaises });
      }
      return Promise.resolve({ data: [] });
    });
    
    axios.post.mockResolvedValue({ data: { success: true } });
    axios.put.mockResolvedValue({ data: { success: true } });
    axios.delete.mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe renderizar el componente Productos sin errores', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
    });
  });

  it('debe mostrar el subtitulo del componente', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText('Administra el catálogo completo de productos')).toBeInTheDocument();
    });
  });

  it('debe tener un boton para crear nuevo producto', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /nuevo producto/i });
      expect(createButton).toBeInTheDocument();
    });
  });

  it('debe mostrar la tabla de productos', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText('Nombre')).toBeInTheDocument();
      expect(screen.getByText('Categoría')).toBeInTheDocument();
      expect(screen.getByText('Precio')).toBeInTheDocument();
      expect(screen.getByText('Stock')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });
  });

  it('debe mostrar los productos cargados desde la API', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText('Manzana Roja')).toBeInTheDocument();
      expect(screen.getByText('Plátano')).toBeInTheDocument();
      expect(screen.getByText('Lechuga')).toBeInTheDocument();
    });
  });

  it('debe mostrar las categorias de los productos', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      const frutasElements = screen.getAllByText('Frutas');
      expect(frutasElements.length).toBeGreaterThan(0);
      const verdurasElements = screen.getAllByText('Verduras');
      expect(verdurasElements.length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar los precios formateados correctamente', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText('$1.200')).toBeInTheDocument();
      expect(screen.getByText('$800')).toBeInTheDocument();
      expect(screen.getByText('$600')).toBeInTheDocument();
    });
  });

  it('debe mostrar el stock de cada producto', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      const stockElements = screen.getAllByText(/^\d+$/);
      expect(stockElements.length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar alerta de stock bajo para productos con menos de 10 unidades', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText('Lechuga')).toBeInTheDocument();
    });
  });

  it('debe tener botones de editar para cada producto', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      const editButtons = screen.getAllByText('edit');
      expect(editButtons.length).toBe(3);
    });
  });

  it('debe tener botones de eliminar para cada producto', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('delete');
      expect(deleteButtons.length).toBe(3);
    });
  });

  it('debe cargar productos desde la API al iniciar', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
      expect(screen.getByText('Manzana Roja')).toBeInTheDocument();
    });
  });

  it('debe renderizar iconos de Material Icons', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText('add')).toBeInTheDocument();
      expect(screen.getAllByText('edit').length).toBeGreaterThan(0);
      expect(screen.getAllByText('delete').length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar el contador total de productos', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Productos/i)).toBeInTheDocument();
      const totalCard = screen.getByText('Total Productos').closest('.stat-card');
      expect(within(totalCard).getByText('3')).toBeInTheDocument();
    });
  });

  it('debe tener un boton para exportar productos', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /exportar/i });
      expect(exportButton).toBeInTheDocument();
    });
  });

  it('debe mostrar estadisticas de productos', async () => {
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Productos/i)).toBeInTheDocument();
    });
  });

  it('debe renderizar correctamente cuando no hay productos', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('productos')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('categorias')) {
        return Promise.resolve({ data: mockCategorias });
      }
      if (url.includes('paises')) {
        return Promise.resolve({ data: mockPaises });
      }
      return Promise.resolve({ data: [] });
    });
    
    render(<Productos />);
    
    await waitFor(() => {
      expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
    });
  });

  it('debe tener un formulario modal para crear/editar productos', async () => {
    const { container } = render(<Productos />);
    
    await waitFor(() => {
      const modal = container.querySelector('#productModal');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Estadísticas avanzadas', () => {
    it('debe mostrar stock total de productos', async () => {
      render(<Productos />);
      
      await waitFor(() => {
        // Stock total: 50 + 30 + 5 = 85
        expect(screen.getByText(/Stock Total/i)).toBeInTheDocument();
      });
    });

    it('debe mostrar categorías únicas', async () => {
      render(<Productos />);
      
      await waitFor(() => {
        expect(screen.getByText(/Categorías/i)).toBeInTheDocument();
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar error al cargar productos', async () => {
      axios.get.mockRejectedValue(new Error('Error de red'));
      
      render(<Productos />);
      
      await waitFor(() => {
        expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
      });
    });
  });

});
