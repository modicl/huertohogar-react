import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConfiguracionPage } from './ConfiguracionPage';

vi.mock('../components/Configuracion', () => ({
  Configuracion: () => <div>Configuracion Component</div>
}));

describe('ConfiguracionPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe renderizar sin errores', () => {
    render(
      <MemoryRouter>
        <ConfiguracionPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Configuracion Component')).toBeInTheDocument();
  });

  it('debe cambiar el titulo del documento', () => {
    render(
      <MemoryRouter>
        <ConfiguracionPage />
      </MemoryRouter>
    );
    
    expect(document.title).toBe('Configuración - Admin | HuertoHogar');
  });

  it('debe renderizar el componente Configuracion dentro de un container', () => {
    const { container } = render(
      <MemoryRouter>
        <ConfiguracionPage />
      </MemoryRouter>
    );
    
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(screen.getByText('Configuracion Component')).toBeInTheDocument();
  });
});
