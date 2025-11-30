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

    it('debe mostrar el título principal con el eslogan de la empresa', () => {
        renderWithRouter(<Nosotros />);
        // El nuevo diseño tiene "Del Campo a tu Mesa" como título
        expect(screen.getByText(/Del Campo a tu Mesa/i)).toBeInTheDocument();
    });

    it('debe contener la sección principal con estructura bento grid', () => {
        const { container } = renderWithRouter(<Nosotros />);
        const bentoGrid = container.querySelector('.bento-grid');
        expect(bentoGrid).toBeInTheDocument();
    });

    it('debe renderizar la imagen del jardín con alt correcto', () => {
        renderWithRouter(<Nosotros />);
        const img = screen.getByAltText('Huerto Hogar Jardín');
        expect(img).toBeInTheDocument();
    });

    it('debe mostrar secciones importantes como Nuestra Historia y Nuestros Valores', () => {
        renderWithRouter(<Nosotros />);
        expect(screen.getByText(/Nuestra Historia/i)).toBeInTheDocument();
        expect(screen.getByText(/Nuestros Valores/i)).toBeInTheDocument();
    });

    it('debe mostrar estadísticas y la sección del equipo', () => {
        renderWithRouter(<Nosotros />);
        expect(screen.getByText(/Años de Experiencia/i)).toBeInTheDocument();
        expect(screen.getByText(/El Equipo/i)).toBeInTheDocument();
    });
});
