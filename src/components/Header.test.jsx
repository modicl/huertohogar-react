import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

// Mock de AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: null,
        token: null,
        isAuthenticated: () => false,
        logout: vi.fn()
    })
}));

// Metodo helper que renderiza el header

const renderHeader = () => {
    render(
        <BrowserRouter>
            <Header />
        </BrowserRouter>
    )
}


describe("Componente Header", () => {

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
    });

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
        
        // El link de registro existe dos veces (desktop + mobile)
        // En desktop tiene texto dividido "Registro /" + "Iniciar sesión", en mobile "Registro/Iniciar Sesión"
        let registroLinks = screen.getAllByRole('link', { name: /registro/i });
        expect(registroLinks.length).toBeGreaterThanOrEqual(2);
        
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

    it('debe inicializar el sidenav si window.M existe', () => {
        const mockInit = vi.fn();
        window.M = {
            Sidenav: {
                init: mockInit
            }
        };

        renderHeader();

        expect(mockInit).toHaveBeenCalled();
    });

    it('debe mostrar el contador del carrito cuando hay items', () => {
        localStorage.setItem('cartHuerto', JSON.stringify([
            { id: 1, nombre: 'Producto 1', quantity: 2 },
            { id: 2, nombre: 'Producto 2', quantity: 3 }
        ]));

        renderHeader();

        const badges = screen.getAllByText('5');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('debe mostrar 99+ cuando hay mas de 99 items en el carrito', () => {
        localStorage.setItem('cartHuerto', JSON.stringify([
            { id: 1, nombre: 'Producto 1', quantity: 100 }
        ]));

        renderHeader();

        const badges = screen.getAllByText('99+');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('no debe mostrar badge cuando el carrito esta vacio', () => {
        localStorage.setItem('cartHuerto', JSON.stringify([]));

        renderHeader();

        const badge = screen.queryByText('0');
        expect(badge).not.toBeInTheDocument();
    });

    it('debe tener dos formularios de busqueda', () => {
        renderHeader();

        const searchForms = screen.getAllByRole('search');
        expect(searchForms).toHaveLength(2);
    });

    it('debe tener inputs de busqueda con placeholder correcto', () => {
        renderHeader();

        const searchInputs = screen.getAllByPlaceholderText('Buscar...');
        expect(searchInputs).toHaveLength(2);
    });

    it('debe tener botones de busqueda con icono search', () => {
        renderHeader();

        const searchIcons = screen.getAllByText('search');
        expect(searchIcons.length).toBeGreaterThan(0);
    });

    it('debe tener el logo con alt text correcto', () => {
        renderHeader();

        const logo = screen.getByAltText('Logo HuertoHogar');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src');
    });

    it('debe tener icono de menu hamburguesa', () => {
        renderHeader();

        const menuIcon = screen.getByText('menu');
        expect(menuIcon).toBeInTheDocument();
    });
});