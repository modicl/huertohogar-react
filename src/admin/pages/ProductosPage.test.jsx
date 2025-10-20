import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductosPage } from './ProductosPage';

vi.mock('../components/Productos', () => ({
  Productos: () => <div>Productos Component</div>
}));

describe('ProductosPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe renderizar sin errores', () => {
    render(
      <MemoryRouter>
        <ProductosPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Productos Component')).toBeInTheDocument();
  });

  it('debe cambiar el titulo del documento', () => {
    render(
      <MemoryRouter>
        <ProductosPage />
      </MemoryRouter>
    );
    
    expect(document.title).toBe('Productos - Admin | HuertoHogar');
  });

  it('debe renderizar el componente Productos dentro de un container', () => {
    const { container } = render(
      <MemoryRouter>
        <ProductosPage />
      </MemoryRouter>
    );
    
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(screen.getByText('Productos Component')).toBeInTheDocument();
  });
});
