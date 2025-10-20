import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BlogPage } from './BlogPage';

vi.mock('../components/CreadorBlog', () => ({
  CreadorBlog: () => <div>CreadorBlog Component</div>
}));

describe('BlogPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe renderizar sin errores', () => {
    render(
      <MemoryRouter>
        <BlogPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('CreadorBlog Component')).toBeInTheDocument();
  });

  it('debe cambiar el titulo del documento', () => {
    render(
      <MemoryRouter>
        <BlogPage />
      </MemoryRouter>
    );
    
    expect(document.title).toBe('Blog - Admin | HuertoHogar');
  });

  it('debe renderizar el componente CreadorBlog dentro de un container', () => {
    const { container } = render(
      <MemoryRouter>
        <BlogPage />
      </MemoryRouter>
    );
    
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(screen.getByText('CreadorBlog Component')).toBeInTheDocument();
  });
});
