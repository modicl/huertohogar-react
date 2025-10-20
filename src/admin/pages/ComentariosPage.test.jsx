import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ComentariosPage } from './ComentariosPage';

vi.mock('../components/Comentarios', () => ({
  Comentarios: () => <div>Comentarios Component</div>
}));

describe('ComentariosPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe renderizar sin errores', () => {
    render(
      <MemoryRouter>
        <ComentariosPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Comentarios Component')).toBeInTheDocument();
  });

  it('debe cambiar el titulo del documento', () => {
    render(
      <MemoryRouter>
        <ComentariosPage />
      </MemoryRouter>
    );
    
    expect(document.title).toBe('Comentarios - Admin | HuertoHogar');
  });

  it('debe renderizar el componente Comentarios dentro de un container', () => {
    const { container } = render(
      <MemoryRouter>
        <ComentariosPage />
      </MemoryRouter>
    );
    
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(screen.getByText('Comentarios Component')).toBeInTheDocument();
  });
});
