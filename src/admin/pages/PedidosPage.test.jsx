import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PedidosPage } from './PedidosPage';

vi.mock('../components/Pedidos', () => ({
  Pedidos: () => <div>Pedidos Component</div>
}));

describe('PedidosPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe renderizar sin errores', () => {
    render(
      <MemoryRouter>
        <PedidosPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Pedidos Component')).toBeInTheDocument();
  });

  it('debe cambiar el titulo del documento', () => {
    render(
      <MemoryRouter>
        <PedidosPage />
      </MemoryRouter>
    );
    
    expect(document.title).toBe('Pedidos - Admin | HuertoHogar');
  });

  it('debe renderizar el componente Pedidos dentro de un container', () => {
    const { container } = render(
      <MemoryRouter>
        <PedidosPage />
      </MemoryRouter>
    );
    
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(screen.getByText('Pedidos Component')).toBeInTheDocument();
  });
});
