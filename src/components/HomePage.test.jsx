import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './HomePage';

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
  
  // Test 1: Verificar que el componente se renderiza correctamente
  it('debe renderizar el componente HomePage sin errores', () => {
    renderWithRouter(<HomePage />);
    
    // Verificar que los componentes principales están presentes
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  // Test 2: Verificar que muestra el título y descripción de la tienda online
  it('debe mostrar el título "TIENDA ONLINE" y su descripción', () => {
    renderWithRouter(<HomePage />);
    
    // Verificar que el título principal está presente
    const titulo = screen.getByText('TIENDA ONLINE');
    expect(titulo).toBeInTheDocument();
    
    // Verificar que la descripción está presente
    const descripcion = screen.getByText(/Accede a nuestro catálogo completo/i);
    expect(descripcion).toBeInTheDocument();
    
    // Verificar que el botón de acción está presente
    const botonTienda = screen.getByRole('link', { name: /Ir a la tienda/i });
    expect(botonTienda).toBeInTheDocument();
    expect(botonTienda).toHaveAttribute('href', '/productos');
  });

  // Test 3: Verificar que muestra los 6 productos del catálogo
  it('debe mostrar 6 productos en la sección "Nuestros productos"', () => {
    renderWithRouter(<HomePage />);
    
    // Verificar que el título de la sección está presente
    const tituloSeccion = screen.getByText('Nuestros productos');
    expect(tituloSeccion).toBeInTheDocument();
    
    // Verificar que están los 6 productos por nombre
    expect(screen.getByText('Quinoa Orgánica')).toBeInTheDocument();
    expect(screen.getByText('Leche Entera')).toBeInTheDocument();
    expect(screen.getByText('Manzana Fuji')).toBeInTheDocument();
    expect(screen.getByText('Naranja Valencia')).toBeInTheDocument();
    expect(screen.getByText('Zanahorias Orgánicas')).toBeInTheDocument();
    expect(screen.getByText('Pimientos Tricolores')).toBeInTheDocument();
    
    // Verificar que hay 6 botones de "Comprar"
    const botonesComprar = screen.getAllByRole('link', { name: /Comprar/i });
    expect(botonesComprar).toHaveLength(6);
    
    // Verificar que están los precios
    expect(screen.getByText('$3000 (500g)')).toBeInTheDocument();
    expect(screen.getByText('$1200 (1L)')).toBeInTheDocument();
    expect(screen.getByText('$1200 (1 kg)')).toBeInTheDocument();
  });

  // BONUS Test 4: Verificar que muestra la sección de testimonios
  it('debe mostrar la sección de testimonios con 3 testimonios', () => {
    renderWithRouter(<HomePage />);
    
    // Verificar que el título de testimonios está presente
    const tituloTestimonios = screen.getByText('Testimonios');
    expect(tituloTestimonios).toBeInTheDocument();
    
    // Verificar que están los 3 testimonios
    expect(screen.getByText(/Los productos de Huerto Hogar son frescos/i)).toBeInTheDocument();
    expect(screen.getByText(/El servicio al cliente es inmejorable/i)).toBeInTheDocument();
    expect(screen.getByText(/Me encanta la variedad de productos orgánicos/i)).toBeInTheDocument();
    
    // Verificar los autores de los testimonios
    expect(screen.getByText('- María G.')).toBeInTheDocument();
    expect(screen.getByText('- Darío Q.')).toBeInTheDocument();
    expect(screen.getByText('- Carla M.')).toBeInTheDocument();
  });
});
