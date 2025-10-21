import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Carousel } from './Carousel';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

const renderCarousel = () => {
    render(
        <BrowserRouter>
            <Carousel />
        </BrowserRouter>
    )
};

describe('Componente Carousel', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Limpiar el DOM después de cada prueba
        document.body.innerHTML = '';
    });

    it('debe renderizar el componente Carousel sin errores', () => {
        renderCarousel();
        expect(screen.getByRole('img', { name: /naranjas/i })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /miel/i })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /cajón de productos/i })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /manzanas/i })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /vegetales/i })).toBeInTheDocument();
    });

    it('debe mostrar los textos correctos en los overlays', () => {
        renderCarousel();
        expect(screen.getByText(/Frutas y verduras de temporada seleccionadas para ti/i)).toBeInTheDocument();
        expect(screen.getByText(/Disfruta de lo mejor en productos orgánicos cosechados en nuestra huerta/i)).toBeInTheDocument();
        expect(screen.getByText(/Productos frescos y de calidad directo a la puerta de tu hogar/i)).toBeInTheDocument();
    });

    it('debe permitir la navegación entre las imágenes del carousel', async () => {
        renderCarousel();
        const user = userEvent.setup();
        const firstImage = screen.getByRole('img', { name: /naranjas/i });
        const secondImage = screen.getByRole('img', { name: /miel/i });
        expect(firstImage).toBeVisible();

        // Simula navegación al segundo item usando el link con el texto "Miel"
        await user.click(screen.getByRole('link', { name: /miel/i }));
        expect(secondImage).toBeVisible();
    });

    it('debe tener la clase correcta para el carousel', () => {
        renderCarousel();
        const carouselElement = screen.getByTestId('carousel');
        expect(carouselElement).toHaveClass('carousel-slider');
    });

    it('debe tener 5 elementos con data-testid="carousel-unit"', () => {
        renderCarousel();
        const items = screen.getAllByTestId('carousel-unit');
        expect(items).toHaveLength(5);
    });

    it('cada carousel item debe tener un enlace correcto', () => {
        renderCarousel();
        const items = screen.getAllByRole('link');
        expect(items).toHaveLength(5);
    });

});
