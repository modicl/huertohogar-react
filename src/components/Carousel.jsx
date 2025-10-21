import { useEffect } from 'react';

// Importar todas las imágenes del carousel
import naranjas2 from '../assets/images/naranjas2.jpg';
import miel from '../assets/images/miel.jpg';
import cajon from '../assets/images/cajon.jpg';
import manzanas from '../assets/images/manzanas.jpg';
import vegetales from '../assets/images/vegetales.jpg';

export function Carousel() {
  useEffect(() => {
    // Inicializar carousel cuando el componente se monta
    if (window.M) {
      window.M.Carousel.init(document.querySelectorAll('.carousel'), {
        fullWidth: true,
        indicators: true,
        duration: 200
      });
    }
  }, []);

  return (
    <div className="section no-pad-top" id="carousel">
      <div className="carousel carousel-slider" data-testid="carousel">
        <a className="carousel-item" data-testid="carousel-unit" href="#one!">
          <img src={naranjas2} alt="Naranjas" />
          <div className="text-overlay">
            <h3>Frutas y verduras de temporada seleccionadas para ti</h3>
          </div>
        </a>
        <a className="carousel-item" data-testid="carousel-unit" href="#two!">
          <img src={miel} alt="Miel" />
        </a>
        <a className="carousel-item" data-testid="carousel-unit" href="#three!">
          <img src={cajon} alt="Cajón de productos" />
          <div className="text-overlay">
            <h3>Disfruta de lo mejor en productos orgánicos cosechados en nuestra huerta</h3>
          </div>
        </a>
        <a className="carousel-item" data-testid="carousel-unit" href="#four!">
          <img src={manzanas} alt="Manzanas" />
        </a>
        <a className="carousel-item" data-testid="carousel-unit" href="#five!">
          <img src={vegetales} alt="Vegetales" />
          <div className="text-overlay">
            <h3>Productos frescos y de calidad directo a la puerta de tu hogar</h3>
          </div>
        </a>
      </div>
    </div>
  );
}
