import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UsuariosPage } from './UsuariosPage';

vi.mock('../components/Usuarios', () => ({
  Usuarios: () => <div>Usuarios Component</div>
}));

describe('UsuariosPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe renderizar sin errores', () => {
    render(
      <MemoryRouter>
        <UsuariosPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Usuarios Component')).toBeInTheDocument();
  });

  it('debe cambiar el titulo del documento', () => {
    render(
      <MemoryRouter>
        <UsuariosPage />
      </MemoryRouter>
    );
    
    expect(document.title).toBe('Usuarios - Admin | HuertoHogar');
  });

  it('debe renderizar el componente Usuarios dentro de un container', () => {
    const { container } = render(
      <MemoryRouter>
        <UsuariosPage />
      </MemoryRouter>
    );
    
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(screen.getByText('Usuarios Component')).toBeInTheDocument();
  });
});
