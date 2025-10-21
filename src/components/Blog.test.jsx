import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Blog } from './Blog';

// Mock de los componentes Header y Footer
vi.mock('./Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('./Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Footer</div>
}));

// Mock de window.M (Materialize)
beforeEach(() => {
  window.M = {
    Sidenav: { init: vi.fn() },
    Modal: { init: vi.fn() },
    Dropdown: { init: vi.fn() }
  };
});

describe('Blog Component', () => {
  const renderBlog = () => {
    return render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );
  };

  it('debe renderizar el componente correctamente', () => {
    renderBlog();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('debe mostrar el título "Blog"', () => {
    renderBlog();
    expect(screen.getByRole('heading', { name: /blog/i })).toBeInTheDocument();
  });

  it('debe mostrar la primera noticia sobre jugos verdes', () => {
    renderBlog();
    expect(screen.getByText(/¿Qué pasa si tomo jugo verde todos los días?/i)).toBeInTheDocument();
  });

  it('debe mostrar la descripción de la primera noticia', () => {
    renderBlog();
    expect(screen.getByText(/Descubre los beneficios y posibles efectos/i)).toBeInTheDocument();
  });

  it('debe tener un enlace a la primera noticia externa', () => {
    renderBlog();
    const links = screen.getAllByText(/leer noticia completa/i);
    expect(links[0]).toHaveAttribute('href', 'https://www.vogue.mx/articulo/que-pasa-si-tomo-jugo-verde-todos-los-dias');
    expect(links[0]).toHaveAttribute('target', '_blank');
  });

  it('debe mostrar la segunda noticia sobre abejas y miel orgánica', () => {
    renderBlog();
    expect(screen.getByText(/Proyecto pionero promueve el bienestar de las abejas/i)).toBeInTheDocument();
  });

  it('debe mostrar la descripción de la segunda noticia', () => {
    renderBlog();
    expect(screen.getByText(/Conoce cómo esta iniciativa busca proteger a las abejas/i)).toBeInTheDocument();
  });

  it('debe tener un enlace a la segunda noticia externa', () => {
    renderBlog();
    const links = screen.getAllByText(/leer noticia completa/i);
    expect(links[1]).toHaveAttribute('href', 'https://www.diarioconcepcion.cl/ciencia-y-sociedad/2025/07/13/proyecto-pionero-promueve-el-bienestar-de-las-abejas-y-miel-organica-en-nuble.html');
    expect(links[1]).toHaveAttribute('target', '_blank');
  });

  it('debe renderizar dos tarjetas de noticias', () => {
    renderBlog();
    const cards = screen.getAllByText(/leer noticia completa/i);
    expect(cards).toHaveLength(2);
  });

  it('debe aplicar la clase "hoverable" a las tarjetas', () => {
    const { container } = renderBlog();
    const cards = container.querySelectorAll('.card.hoverable');
    expect(cards).toHaveLength(2);
  });

  it('debe usar la fuente Playfair Display en los títulos', () => {
    const { container } = renderBlog();
    const titles = container.querySelectorAll('.card-title');
    titles.forEach(title => {
      expect(title).toHaveStyle({ fontFamily: "'Playfair Display', serif" });
    });
  });

  it('debe usar la fuente Montserrat en las descripciones', () => {
    const { container } = renderBlog();
    const descriptions = container.querySelectorAll('p');
    descriptions.forEach(desc => {
      if (desc.textContent.includes('Descubre') || desc.textContent.includes('Conoce')) {
        expect(desc).toHaveStyle({ fontFamily: "'Montserrat', sans-serif" });
      }
    });
  });

  it('debe tener la estructura de grid de Materialize', () => {
    const { container } = renderBlog();
    const row = container.querySelector('.row');
    expect(row).toBeInTheDocument();
    const cols = container.querySelectorAll('.col.s12.m6');
    expect(cols).toHaveLength(2);
  });

  it('debe aplicar estilos verdes a los enlaces', () => {
    renderBlog();
    const links = screen.getAllByText(/leer noticia completa/i);
    links.forEach(link => {
      expect(link).toHaveStyle({ color: '#2E8B57', fontWeight: 'bold' });
    });
  });

  it('debe tener el contenedor principal con clase "container"', () => {
    const { container } = renderBlog();
    const main = container.querySelector('main.container');
    expect(main).toBeInTheDocument();
  });

  it('debe aplicar margen al título principal', () => {
    renderBlog();
    const title = screen.getByRole('heading', { name: /blog/i });
    expect(title).toHaveStyle({ margin: '30px 0' });
  });
});
