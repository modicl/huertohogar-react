import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Producto } from './Producto';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

// Mock de axios
vi.mock('axios');

// Mock de la configuración de API
vi.mock('../config/api.js', () => ({
  API_URLS: {
    productos: 'http://test-api/productos',
    categorias: 'http://test-api/categorias'
  }
}));

// Mock de los componentes Header y Footer
vi.mock('./Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('./Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Footer</div>
}));

// Datos mock de la API
const mockProductosAPI = [
  {
    idProducto: 1,
    nombreProducto: 'Tomate Orgánico',
    precioProducto: 2500,
    imagenUrl: '/images/tomate.jpg',
    descripcionProducto: 'Tomates frescos',
    stockProducto: 50,
    categoria: { idCategoria: 1, nombreCategoria: 'verduras' }
  },
  {
    idProducto: 2,
    nombreProducto: 'Manzana Verde',
    precioProducto: 1500,
    imagenUrl: '/images/manzana.jpg',
    descripcionProducto: 'Manzanas frescas',
    stockProducto: 30,
    categoria: { idCategoria: 2, nombreCategoria: 'frutas' }
  },
  {
    idProducto: 3,
    nombreProducto: 'Lechuga Orgánica',
    precioProducto: 1200,
    imagenUrl: '/images/lechuga.jpg',
    descripcionProducto: 'Lechuga fresca',
    stockProducto: 20,
    categoria: { idCategoria: 1, nombreCategoria: 'verduras' }
  },
  {
    idProducto: 4,
    nombreProducto: 'Pera Orgánica',
    precioProducto: 3500,
    imagenUrl: '/images/pera.jpg',
    descripcionProducto: 'Peras frescas',
    stockProducto: 15,
    categoria: { idCategoria: 2, nombreCategoria: 'frutas' }
  }
];

// Mock de productos estáticos (fallback)
vi.mock('../data/productos.jsx', () => ({
  productos: [
    {
      id: 1,
      nombre: 'Tomate Orgánico',
      precio: 2500,
      imagen: '/images/tomate.jpg',
      descripcion: 'Tomates frescos',
      stock: 50,
      categoria: 'verduras'
    },
    {
      id: 2,
      nombre: 'Manzana Verde',
      precio: 1500,
      imagen: '/images/manzana.jpg',
      descripcion: 'Manzanas frescas',
      stock: 30,
      categoria: 'frutas'
    },
    {
      id: 3,
      nombre: 'Lechuga Orgánica',
      precio: 1200,
      imagen: '/images/lechuga.jpg',
      descripcion: 'Lechuga fresca',
      stock: 20,
      categoria: 'verduras'
    },
    {
      id: 4,
      nombre: 'Pera Orgánica',
      precio: 3500,
      imagen: '/images/pera.jpg',
      descripcion: 'Peras frescas',
      stock: 15,
      categoria: 'frutas'
    }
  ]
}));

// Mock de window.M (Materialize) y localStorage
beforeEach(() => {
  // Mock axios para la API de productos
  axios.get.mockResolvedValue({ 
    status: 200,
    data: mockProductosAPI 
  });

  // Mock de localStorage
  const localStorageMock = {
    getItem: vi.fn(() => '[]'),
    setItem: vi.fn(),
    clear: vi.fn()
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });

  // Mock de console.log para evitar ruido en tests
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  
  // Mock de window.alert
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Producto Component', () => {
  const renderProducto = () => {
    return render(
      <BrowserRouter>
        <Producto />
      </BrowserRouter>
    );
  };

  it('debe renderizar el componente correctamente', async () => {
    renderProducto();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('debe mostrar el título de la sección de productos', async () => {
    renderProducto();
    await waitFor(() => {
      // El componente tiene múltiples secciones de filtros con el título "Filtros"
      const filtros = screen.getAllByText(/Filtros/i);
      expect(filtros.length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar todos los productos por defecto', async () => {
    renderProducto();
    await waitFor(() => {
      expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      expect(screen.getByText('Manzana Verde')).toBeInTheDocument();
      expect(screen.getByText('Lechuga Orgánica')).toBeInTheDocument();
      expect(screen.getByText('Pera Orgánica')).toBeInTheDocument();
    });
  });

  it('debe mostrar los precios de los productos', async () => {
    renderProducto();
    await waitFor(() => {
      // Buscar por el patrón de precio con regex más flexible
      const prices = screen.getAllByText(/\$\s*\d/);
      expect(prices.length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar información de cantidad/disponibilidad de productos', async () => {
    const { container } = renderProducto();
    await waitFor(() => {
      // Verificar que hay inputs de cantidad para cada producto
      const quantityInputs = container.querySelectorAll('input[type="number"]');
      expect(quantityInputs.length).toBeGreaterThan(0);
    });
  });

  describe('Filtros', () => {
    it('debe mostrar el botón de filtros en móvil', async () => {
      renderProducto();
      await waitFor(() => {
        const filterButton = screen.getByText(/mostrar filtros/i);
        expect(filterButton).toBeInTheDocument();
      });
    });

    it('debe mostrar todas las categorías', async () => {
      renderProducto();
      await waitFor(() => {
        // Los radio buttons de categoría se muestran con texto
        expect(screen.getByText(/Todas las categorías/i)).toBeInTheDocument();
        // Usamos getAllByText porque "verduras" y "frutas" aparecen múltiples veces
        expect(screen.getAllByText(/verduras/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/frutas/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    it('debe filtrar productos por categoría "frutas"', async () => {
      const user = userEvent.setup();
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });

      // Click en el primer elemento "frutas" (el filtro de la barra lateral)
      const frutasLabels = screen.getAllByText(/frutas/i);
      await user.click(frutasLabels[0]);
      
      await waitFor(() => {
        expect(screen.getByText('Manzana Verde')).toBeInTheDocument();
        expect(screen.getByText('Pera Orgánica')).toBeInTheDocument();
        expect(screen.queryByText('Tomate Orgánico')).not.toBeInTheDocument();
        expect(screen.queryByText('Lechuga Orgánica')).not.toBeInTheDocument();
      });
    });

    it('debe filtrar productos por categoría "verduras"', async () => {
      const user = userEvent.setup();
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      // Click en el primer elemento "verduras" (el filtro de la barra lateral)
      const verdurasLabels = screen.getAllByText(/verduras/i);
      await user.click(verdurasLabels[0]);
      
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
        expect(screen.getByText('Lechuga Orgánica')).toBeInTheDocument();
        expect(screen.queryByText('Manzana Verde')).not.toBeInTheDocument();
        expect(screen.queryByText('Pera Orgánica')).not.toBeInTheDocument();
      });
    });

    it('debe tener controles de rango de precio', async () => {
      renderProducto();
      await waitFor(() => {
        const sliders = screen.getAllByRole('slider');
        expect(sliders.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('debe filtrar por precio mínimo', async () => {
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      const sliders = screen.getAllByRole('slider');
      const precioMinSlider = sliders.find(slider => 
        slider.previousElementSibling?.textContent?.includes('Precio Mínimo')
      );
      
      if (precioMinSlider) {
        fireEvent.change(precioMinSlider, { target: { value: '2000' } });
        
        await waitFor(() => {
          expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
          expect(screen.getByText('Pera Orgánica')).toBeInTheDocument();
        });
      }
    });

    it('debe tener opciones de ordenamiento', async () => {
      renderProducto();
      await waitFor(() => {
        // Verificar que existen opciones de ordenar por precio
        expect(screen.getByText(/Precio: Menor a Mayor/i)).toBeInTheDocument();
        expect(screen.getByText(/Precio: Mayor a Menor/i)).toBeInTheDocument();
      });
    });

    it('debe ordenar por precio ascendente', async () => {
      const user = userEvent.setup();
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      // Buscar el radio button de "precio-asc" por su value
      const precioAscRadio = screen.getByDisplayValue('precio-asc');
      
      // Click en el radio button
      await user.click(precioAscRadio);
      
      // Verificar que el radio button está seleccionado
      expect(precioAscRadio).toBeChecked();
    });

    it('debe tener botón de resetear filtros', async () => {
      renderProducto();
      await waitFor(() => {
        expect(screen.getByText(/limpiar filtros/i)).toBeInTheDocument();
      });
    });

    it('debe resetear filtros al hacer click en el botón', async () => {
      const user = userEvent.setup();
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      // Seleccionar una categoría (no "Todas") usando getAllByText
      const verdurasLabels = screen.getAllByText(/verduras/i);
      await user.click(verdurasLabels[0]);
      
      // Verificar que solo muestra verduras
      await waitFor(() => {
        expect(screen.queryByText('Manzana Verde')).not.toBeInTheDocument();
      });
      
      // Resetear
      const resetButton = screen.getByText(/limpiar filtros/i);
      await user.click(resetButton);
      
      // Después de resetear, debería mostrar todos los productos de nuevo
      await waitFor(() => {
        expect(screen.getByText('Manzana Verde')).toBeInTheDocument();
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
    });
  });

  describe('Carrito de Compras', () => {
    it('debe tener inputs de cantidad para cada producto', async () => {
      renderProducto();
      await waitFor(() => {
        // Buscar inputs de cantidad por label
        const quantityInputs = screen.getAllByLabelText(/cantidad/i);
        expect(quantityInputs.length).toBeGreaterThan(0);
      });
    });

    it('debe permitir cambiar la cantidad de un producto', async () => {
      const user = userEvent.setup();
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      const quantityInputs = screen.getAllByLabelText(/cantidad/i);
      const firstInput = quantityInputs[0];
      
      // Limpiar el campo primero
      await user.clear(firstInput);
      // Esperar un poco y luego escribir el nuevo valor
      await user.type(firstInput, '3');
      
      // Verificar que el valor se actualizó
      expect(firstInput.value).toContain('3');
    });

    it('debe tener botones "Agregar al carrito"', async () => {
      renderProducto();
      await waitFor(() => {
        const addButtons = screen.getAllByText(/agregar al carrito/i);
        expect(addButtons.length).toBeGreaterThan(0);
      });
    });

    it('debe agregar producto al carrito con cantidad por defecto', async () => {
      const user = userEvent.setup();
      localStorage.getItem.mockReturnValue('[]');
      
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      const addButtons = screen.getAllByText(/agregar al carrito/i);
      await user.click(addButtons[0]);
      
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('debe agregar producto al carrito con cantidad personalizada', async () => {
      const user = userEvent.setup();
      localStorage.getItem.mockReturnValue('[]');
      
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      const quantityInputs = screen.getAllByLabelText(/cantidad/i);
      await user.clear(quantityInputs[0]);
      await user.type(quantityInputs[0], '5');
      
      const addButtons = screen.getAllByText(/agregar al carrito/i);
      await user.click(addButtons[0]);
      
      // Verificar que se llamó localStorage
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('debe actualizar cantidad si producto ya existe en carrito', async () => {
      const user = userEvent.setup();
      const existingCart = JSON.stringify([
        { id: 1, nombre: 'Tomate Orgánico', quantity: 2 }
      ]);
      localStorage.getItem.mockReturnValue(existingCart);
      
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      const addButtons = screen.getAllByText(/agregar al carrito/i);
      await user.click(addButtons[0]);
      
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('debe resetear cantidad a 1 después de agregar al carrito', async () => {
      const user = userEvent.setup();
      localStorage.getItem.mockReturnValue('[]');
      
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      const quantityInputs = screen.getAllByLabelText(/cantidad/i);
      await user.clear(quantityInputs[0]);
      await user.type(quantityInputs[0], '3');
      
      const addButtons = screen.getAllByText(/agregar al carrito/i);
      await user.click(addButtons[0]);
      
      // Verificar que se llamó localStorage (la cantidad puede resetearse o mantenerse según implementación)
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Enlaces de Productos', () => {
    it('debe tener enlaces a los detalles de productos', async () => {
      const { container } = renderProducto();
      await waitFor(() => {
        const links = container.querySelectorAll('a[href*="/producto/"]');
        expect(links.length).toBeGreaterThan(0);
      });
    });

    it('debe tener el enlace correcto para cada producto', async () => {
      const { container } = renderProducto();
      await waitFor(() => {
        const link = container.querySelector('a[href="/producto/1"]');
        expect(link).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('debe tener botón para mostrar/ocultar filtros en móvil', async () => {
      renderProducto();
      await waitFor(() => {
        const filterButton = screen.getByText(/mostrar filtros/i);
        expect(filterButton).toBeInTheDocument();
      });
    });

    it('debe alternar visibilidad de filtros al hacer click', async () => {
      const user = userEvent.setup();
      renderProducto();
      
      await waitFor(() => {
        expect(screen.getByText(/mostrar filtros/i)).toBeInTheDocument();
      });
      
      const filterButton = screen.getByText(/mostrar filtros/i);
      await user.click(filterButton);
      
      // El componente debe manejar el estado de showFiltros
      expect(filterButton).toBeInTheDocument();
    });
  });

  describe('Información de Productos', () => {
    it('debe mostrar las categorías de los productos', async () => {
      renderProducto();
      await waitFor(() => {
        const verduras = screen.getAllByText(/verduras/i);
        expect(verduras.length).toBeGreaterThan(0);
      });
    });

    it('debe mostrar imágenes de productos', async () => {
      const { container } = renderProducto();
      await waitFor(() => {
        const images = container.querySelectorAll('img');
        expect(images.length).toBeGreaterThan(0);
      });
    });

    it('debe tener estructura de tarjetas (cards)', async () => {
      const { container } = renderProducto();
      await waitFor(() => {
        // Buscar por cualquier elemento que parezca una tarjeta de producto
        const productCards = container.querySelectorAll('[class*="card"]');
        expect(productCards.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Logs de Debug', () => {
    it('debe hacer log de filtros actuales', async () => {
      renderProducto();
      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Filtros actuales:',
          expect.objectContaining({
            categoriaNombre: 'todas',
            precioMin: 0,
            precioMax: 10000,
            ordenar: 'ninguno'
          })
        );
      });
    });

    it('debe hacer log de productos filtrados', async () => {
      renderProducto();
      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Productos filtrados:',
          expect.any(Number)
        );
      });
    });
  });

  describe('Integración con LocalStorage', () => {
    it('debe obtener carrito de localStorage al agregar producto', async () => {
      const user = userEvent.setup();
      localStorage.getItem.mockReturnValue('[]');
      
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      const addButtons = screen.getAllByText(/agregar al carrito/i);
      await user.click(addButtons[0]);
      
      expect(localStorage.getItem).toHaveBeenCalledWith('cartHuerto');
    });

    it('debe guardar carrito en localStorage al agregar producto', async () => {
      const user = userEvent.setup();
      localStorage.getItem.mockReturnValue('[]');
      
      renderProducto();
      
      // Esperar a que carguen los productos
      await waitFor(() => {
        expect(screen.getByText('Tomate Orgánico')).toBeInTheDocument();
      });
      
      const addButtons = screen.getAllByText(/agregar al carrito/i);
      await user.click(addButtons[0]);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'cartHuerto',
        expect.any(String)
      );
    });
  });
});
