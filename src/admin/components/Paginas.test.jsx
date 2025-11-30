import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Paginas } from './Paginas';

describe('Componente Paginas', () => {
  it('debe renderizar el componente Paginas sin errores', () => {
    render(<Paginas />);
    
    // Verificar que se renderiza el componente EnConstruccion
    expect(screen.getByText('Sección en Construcción')).toBeInTheDocument();
  });

  it('debe mostrar el título "Página en Construcción"', () => {
    render(<Paginas />);
    
    expect(screen.getByText(/Página en Construcción/i)).toBeInTheDocument();
  });

  it('debe mostrar el mensaje de que estará disponible en próximos Sprint Reviews', () => {
    render(<Paginas />);
    
    expect(screen.getByText(/Esta funcionalidad estará disponible en proximos Sprint Reviews/i)).toBeInTheDocument();
  });

  it('debe mostrar el icono de construcción', () => {
    render(<Paginas />);
    
    const constructionIcon = screen.getByText('construction');
    expect(constructionIcon).toBeInTheDocument();
  });

  it('debe mostrar la sección "Próximamente disponible"', () => {
    render(<Paginas />);
    
    expect(screen.getByText(/Próximamente disponible:/i)).toBeInTheDocument();
  });

  it('debe tener la clase dashboard-wrapper', () => {
    const { container } = render(<Paginas />);
    
    const dashboardWrapper = container.querySelector('.dashboard-wrapper');
    expect(dashboardWrapper).toBeInTheDocument();
  });

  it('debe renderizar el título principal en el header', () => {
    render(<Paginas />);
    
    const header = screen.getByText('Sección en Construcción');
    expect(header).toHaveClass('dashboard-title');
  });
});
