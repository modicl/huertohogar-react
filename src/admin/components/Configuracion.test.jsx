import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Configuracion } from './Configuracion';

describe('Componente Configuracion', () => {
  it('debe renderizar el componente Configuracion sin errores', () => {
    render(<Configuracion />);
    
    // Verificar que se renderiza el componente EnConstruccion
    expect(screen.getByText('Sección en Construcción')).toBeInTheDocument();
  });

  it('debe mostrar el título "Página en Construcción"', () => {
    render(<Configuracion />);
    
    expect(screen.getByText(/Página en Construcción/i)).toBeInTheDocument();
  });

  it('debe mostrar el mensaje de que estará disponible en la Entrega N°3', () => {
    render(<Configuracion />);
    
    expect(screen.getByText(/Esta funcionalidad estará disponible en la Entrega N°3/i)).toBeInTheDocument();
  });

  it('debe mostrar el icono de construcción', () => {
    render(<Configuracion />);
    
    const constructionIcon = screen.getByText('construction');
    expect(constructionIcon).toBeInTheDocument();
  });

  it('debe mostrar la sección "Próximamente disponible"', () => {
    render(<Configuracion />);
    
    expect(screen.getByText(/Próximamente disponible:/i)).toBeInTheDocument();
  });

  it('debe tener la clase dashboard-wrapper', () => {
    const { container } = render(<Configuracion />);
    
    const dashboardWrapper = container.querySelector('.dashboard-wrapper');
    expect(dashboardWrapper).toBeInTheDocument();
  });

  it('debe renderizar el título principal en el header', () => {
    render(<Configuracion />);
    
    const header = screen.getByText('Sección en Construcción');
    expect(header).toHaveClass('dashboard-title');
  });
});
