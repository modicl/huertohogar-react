import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

// Head no necesita mocks, es muy "simple!"

// Metodo helper que renderiza el header

const renderHeader = () => {
    render(
        <BrowserRouter>
            <Header />
        </BrowserRouter>
    )
}


describe("Componente Header", () => {



    it('debe renderizar el componente Header sin errores', () => {
        renderHeader();
        // Debe tener el navbar para pantallas grandes y pequeñas
        expect(screen.getAllByTestId('navbar')).toHaveLength(2);

    });

    it('cada opcion del navbar debe existir dos veces (pantallas grandes y pequeñas)', () => {
        renderHeader();
        
        let inicios = screen.getAllByRole('link', { name: /inicio/i });
        expect(inicios).toHaveLength(2);
        
        let productos = screen.getAllByRole('link', { name: /productos/i });
        expect(productos).toHaveLength(2);
        
        let nosotros = screen.getAllByRole('link', { name: /nosotros/i });
        expect(nosotros).toHaveLength(2);
        
        let contacto = screen.getAllByRole('link', { name: /contacto/i });
        expect(contacto).toHaveLength(2);
        
        let blog = screen.getAllByRole('link', { name: /blog/i });
        expect(blog).toHaveLength(2);
        
        let registro = screen.getAllByRole('link', { name: /Registro\/Iniciar Sesión/i });
        expect(registro).toHaveLength(2);
        
        let carritos = screen.getAllByRole('link', { name: /carrito|tu carrito/i });
        expect(carritos).toHaveLength(2);

    });

    it('existen dos veces los textos de cada una de las opciones del menu',() => {
        renderHeader();
    
        let inicios = screen.getAllByText(/inicio/i);
        expect(inicios).toHaveLength(2);

        let productos = screen.getAllByText(/productos/i);
        expect(productos).toHaveLength(2);


        let nosotros = screen.getAllByText(/nosotros/i);
        expect(nosotros).toHaveLength(2);

        let contacto = screen.getAllByText(/contacto/i);
        expect(contacto).toHaveLength(2);
        
        let blog = screen.getAllByText(/blog/i);
        expect(blog).toHaveLength(2);

        let carritos = screen.getAllByText(/carrito|tu carrito/i);
        expect(carritos).toHaveLength(2);
    });

    it('existen un carrito en cada menu)',() => {
        renderHeader();
    
        let carritos = screen.getAllByTestId('carrito');
        expect(carritos).toHaveLength(2);
    });






});