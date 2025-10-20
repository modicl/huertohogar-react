import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PaginasPage } from './PaginasPage';

vi.mock('../components/Paginas', () => ({
  Paginas: () => <div>Paginas Component</div>
}));

describe('PaginasPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe renderizar sin errores', () => {
    render(
      <MemoryRouter>
        <PaginasPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Paginas Component')).toBeInTheDocument();
  });

  it('debe cambiar el titulo del documento', () => {
    render(
      <MemoryRouter>
        <PaginasPage />
      </MemoryRouter>
    );
    
    expect(document.title).toBe('Páginas - Admin | HuertoHogar');
  });

  it('debe renderizar el componente Paginas dentro de un container', () => {
    const { container } = render(
      <MemoryRouter>
        <PaginasPage />
      </MemoryRouter>
    );
    
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(screen.getByText('Paginas Component')).toBeInTheDocument();
  });
});
