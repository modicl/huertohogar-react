import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from './NotFound';

describe('NotFound Component', () => {
  it('debe renderizar sin errores', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('debe mostrar el codigo 404', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    const heading404 = screen.getByText('404');
    expect(heading404).toBeInTheDocument();
    expect(heading404).toHaveClass('not-found-404');
  });

  it('debe mostrar el mensaje de pagina no encontrada', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Página No Encontrada')).toBeInTheDocument();
  });

  it('debe mostrar la descripcion del error', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Lo sentimos, la página que estás buscando no existe/i)).toBeInTheDocument();
  });

  it('debe tener un boton para volver al inicio', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    const homeLink = screen.getByRole('link', { name: /Volver al Inicio/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('debe tener el icono de home en el boton', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    expect(screen.getByText('home')).toBeInTheDocument();
  });

  it('debe tener las clases CSS correctas', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    expect(container.querySelector('.not-found-main')).toBeInTheDocument();
    expect(container.querySelector('.not-found-container')).toBeInTheDocument();
    expect(container.querySelector('.not-found-content')).toBeInTheDocument();
  });

  it('el boton debe tener las clases de Materialize', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    
    const homeLink = screen.getByRole('link', { name: /Volver al Inicio/i });
    expect(homeLink).toHaveClass('btn');
    expect(homeLink).toHaveClass('waves-effect');
    expect(homeLink).toHaveClass('waves-light');
    expect(homeLink).toHaveClass('not-found-button');
  });
});
