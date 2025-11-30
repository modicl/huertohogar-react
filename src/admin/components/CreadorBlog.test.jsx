import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CreadorBlog } from './CreadorBlog';

describe('Componente CreadorBlog', () => {
  it('debe renderizar el componente CreadorBlog sin errores', () => {
    render(<CreadorBlog />);
    
    // Verificar que se renderiza el componente EnConstruccion
    expect(screen.getByText('Sección en Construcción')).toBeInTheDocument();
  });

  it('debe mostrar el título "Página en Construcción"', () => {
    render(<CreadorBlog />);
    
    expect(screen.getByText(/Página en Construcción/i)).toBeInTheDocument();
  });

  it('debe mostrar el mensaje de que estará disponible en próximos Sprint Reviews', () => {
    render(<CreadorBlog />);
    
    expect(screen.getByText(/Esta funcionalidad estará disponible en proximos Sprint Reviews/i)).toBeInTheDocument();
  });

  it('debe mostrar el icono de construcción', () => {
    render(<CreadorBlog />);
    
    const constructionIcon = screen.getByText('construction');
    expect(constructionIcon).toBeInTheDocument();
  });

  it('debe mostrar la sección "Próximamente disponible"', () => {
    render(<CreadorBlog />);
    
    expect(screen.getByText(/Próximamente disponible:/i)).toBeInTheDocument();
  });

  it('debe tener la clase dashboard-wrapper', () => {
    const { container } = render(<CreadorBlog />);
    
    const dashboardWrapper = container.querySelector('.dashboard-wrapper');
    expect(dashboardWrapper).toBeInTheDocument();
  });

  it('debe renderizar el título principal en el header', () => {
    render(<CreadorBlog />);
    
    const header = screen.getByText('Sección en Construcción');
    expect(header).toHaveClass('dashboard-title');
  });
});
