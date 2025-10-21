import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Nosotros } from './Nosotros';

// Mock de componentes hijos para aislar el componente
vi.mock('./Header', () => ({
    Header: () => <div data-testid="header">Header Mock</div>
}));

vi.mock('./Footer', () => ({
    Footer: () => <div data-testid="footer">Footer Mock</div>
}));

// Helper para renderizar con Router
const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Componente Nosotros', () => {

    it('debe renderizar sin errores y mostrar Header y Footer', () => {
        renderWithRouter(<Nosotros />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('debe mostrar el título principal "¿Quiénes somos?"', () => {
        renderWithRouter(<Nosotros />);
        const titulo = screen.getByRole('heading', { level: 1, name: /¿Quiénes somos\?/i }); //level para indicar h1
        expect(titulo).toBeInTheDocument();
    });

    it('debe contener la sección "nosotros" con dos columnas', () => {
        renderWithRouter(<Nosotros />);
        const section = screen.getByTestId('nosotros-section');
        expect(section).toBeInTheDocument();

        const cols = screen.getByTestId('nosotros-columns').querySelectorAll('.col');
        expect(cols.length).toBeGreaterThanOrEqual(2);
    });

    it('debe renderizar la imagen de "Nosotros" con alt correcto y clases responsivas', () => {
        renderWithRouter(<Nosotros />);
        const img = screen.getByAltText('Imagen Nosotros');
        expect(img).toBeInTheDocument();
        expect(img).toHaveClass('responsive-img');
        expect(img).toHaveClass('z-depth-2'); // buscar clase de sombra
    });

    it('debe mostrar los subtítulos "Sobre Nosotros", "Nuestra Misión" y "Nuestra Visión"', () => {
        renderWithRouter(<Nosotros />);
        expect(screen.getByRole('heading', { level: 2, name: /Sobre Nosotros/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: /Nuestra Misión/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: /Nuestra Visión/i })).toBeInTheDocument();
    });

    it('debe contener párrafos con la clase "section-about-us"', () => {
        renderWithRouter(<Nosotros />);
        const paragraphs = document.querySelectorAll('.section-about-us');
        expect(paragraphs.length).toBeGreaterThanOrEqual(3);
    });
});
