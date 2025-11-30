import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import axios from 'axios';

// Mock de axios
vi.mock('axios');

// Mock de API_URLS
vi.mock('../config/api.js', () => ({
  API_URLS: {
    productos: 'http://test-api/productos'
  }
}));

// Mock de datos de productos de la API
const mockProductosAPI = [
  {
    idProducto: 1,
    nombreProducto: 'Quinoa Orgánica',
    precioProducto: 3000,
    imagenUrl: '/images/quinoa.jpg',
    categoria: { nombreCategoria: 'Cereales' },
    stockProducto: 50
  },
  {
    idProducto: 2,
    nombreProducto: 'Manzana Fuji',
    precioProducto: 1200,
    imagenUrl: '/images/manzana.jpg',
    categoria: { nombreCategoria: 'Frutas' },
    stockProducto: 100
  },
  {
    idProducto: 3,
    nombreProducto: 'Zanahorias Orgánicas',
    precioProducto: 800,
    imagenUrl: '/images/zanahorias.jpg',
    categoria: { nombreCategoria: 'Verduras' },
    stockProducto: 80
  },
  {
    idProducto: 4,
    nombreProducto: 'Pimientos Tricolores',
    precioProducto: 1500,
    imagenUrl: '/images/pimientos.jpg',
    categoria: { nombreCategoria: 'Verduras' },
    stockProducto: 60
  }
];

// Mock de los componentes hijos para aislar el test
vi.mock('./Carousel', () => ({
  Carousel: () => <div data-testid="carousel">Carousel Mock</div>
}));

vi.mock('./Header', () => ({
  Header: () => <div data-testid="header">Header Mock</div>
}));

vi.mock('./Footer', () => ({
  Footer: () => <div data-testid="footer">Footer Mock</div>
}));

// Wrapper con Router para que funcionen los Links
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage Component', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockProductosAPI });
  });

  // Test 1: Verificar que el componente se renderiza correctamente
  it('debe renderizar el componente HomePage sin errores', () => {
    renderWithRouter(<HomePage />);
    
    // Verificar que los componentes principales están presentes
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  // Test 2: Verificar que muestra el título de bienvenida y su descripción
  it('debe mostrar el título "¡BIENVENIDO!" y su descripción', async () => {
    renderWithRouter(<HomePage />);
    
    // Verificar que el título principal está presente
    await waitFor(() => {
      const titulo = screen.getByText('¡BIENVENIDO!');
      expect(titulo).toBeInTheDocument();
    });
    
    // Verificar descripción
    expect(screen.getByText(/Productos frescos y orgánicos/i)).toBeInTheDocument();
    
    // Verificar que el botón de acción está presente
    const botonTienda = screen.getByRole('link', { name: /Ir a la tienda/i });
    expect(botonTienda).toBeInTheDocument();
    expect(botonTienda).toHaveAttribute('href', '/productos');
  });

  // Test 3: Verificar que muestra productos del catálogo desde la API
  it('debe mostrar productos en la sección "Nuestros productos"', async () => {
    renderWithRouter(<HomePage />);
    
    // Esperar a que se carguen los productos desde la API
    await waitFor(() => {
      expect(screen.getByText('Quinoa Orgánica')).toBeInTheDocument();
    });
    
    // Verificar que se muestran otros productos
    expect(screen.getByText('Manzana Fuji')).toBeInTheDocument();
  });

  // BONUS Test 4: Verificar que muestra la sección de productos con título correcto
  it('debe mostrar la sección "Algunos de Nuestros Productos"', async () => {
    renderWithRouter(<HomePage />);
    
    // Verificar que el título de productos está presente
    await waitFor(() => {
      const tituloProductos = screen.getByText(/Algunos de Nuestros Productos/i);
      expect(tituloProductos).toBeInTheDocument();
    });
    
    // Verificar que hay productos renderizados con categoría
    expect(screen.getByText('Cereales')).toBeInTheDocument();
  });
});
