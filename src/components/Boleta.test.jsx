import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Boleta } from './Boleta';
import userEvent from '@testing-library/user-event';

// Mock de un carrito de prueba y el shipping info
const cartItems = [{

    id: 1,
    nombre: 'Manzana Roja',
    precio: 1200,
    imagen: '/images/manzana.jpg',
    descripcion: 'Manzanas frescas',
    categoria: 'Frutas',
    stock: 50,
    quantity: 2
},
{
    id: 2,
    nombre: 'Lechuga Orgánica',
    precio: 900,
    imagen: '/images/lechuga_organica.png',
    descripcion: 'Lechuga cultivada sin pesticidas',
    categoria: 'Verduras',
    stock: 30,
    quantity: 1
}];

const shippingInfo = {
    fullName: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '912345678',
    address: 'Calle Falsa 123',
    city: 'Santiago',
    region: 'Región Metropolitana de Santiago',
    zipCode: '8320000'
}

// Mock del setter del carrito (recibimos el carrito desde el location.state)
const mockSetCartHuerto = vi.fn();

// Helper que renderiza el checkout CON productos en el carrito
const renderCheckoutConProductos = () => {
    // Le damos los objetos a localStorage
    localStorage.setItem('cartHuerto', JSON.stringify(cartItems));
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));

    return render(

        <MemoryRouter // Memory Router permite traernos los datos del state simulados
            initialEntries={[
                {
                    pathname: '/boleta',
                    state: {  // ← Esto simula el location.state
                        cartItems: cartItems,
                        shippingInfo: shippingInfo
                    }
                }
            ]}
        >
            <Boleta />
        </MemoryRouter>
    )
};

describe('Componente Boleta', () => {
    beforeEach(() => {
        // Limpiar localStorage antes de cada test
        localStorage.clear();
        // ✅ Limpiar el mock antes de cada test
        mockSetCartHuerto.mockClear();
    });

    // Casos

    it('renderiza los productos que estan en el carrito enviado desde el local checkout', () => {
        renderCheckoutConProductos();

        // Nombre productos
        expect(screen.getByText(/Manzana Roja/i)).toBeInTheDocument();
        expect(screen.getByText(/Lechuga Orgánica/i)).toBeInTheDocument();

        // Cantidad productos
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();


        // Precio unitario productos
        expect(screen.getByText('$1.200')).toBeInTheDocument();


        // Precio total productos
        expect(screen.getByText('$2.400')).toBeInTheDocument();
        const novecientos = screen.getAllByText('$900');
        expect(novecientos).toHaveLength(2); // Se repite dos veces!

    });

    it('renderiza la shipping info del cliente', () => {
        renderCheckoutConProductos();

        // Nombre y email
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
        expect(screen.getByText('juan@example.com')).toBeInTheDocument();

        // Telefono
        expect(screen.getByText('912345678')).toBeInTheDocument();

        // Direccion
        expect(screen.getByText(/Calle Falsa 123.*Santiago.*Región Metropolitana de Santiago/i))
            .toBeInTheDocument();
    });

    it('renderiza el total de la compra', () => {
        renderCheckoutConProductos();

        // Neto
        expect(screen.getByText('$2.673')).toBeInTheDocument();

        // IVA
        expect(screen.getByText("$627")).toBeInTheDocument();

        // Subtotal
        expect(screen.getByText("$3.300")).toBeInTheDocument();

        // Envío
        expect(screen.getByText("$3.000")).toBeInTheDocument();

        // Total
        expect(screen.getByText("$6.300")).toBeInTheDocument();
    });

    it('boton cerrar cierra la pagina', async () => {
        const user = userEvent.setup();
        renderCheckoutConProductos();

        // Buscar el botón cerrar
        const botonCerrar = screen.getByRole('button', { name: /cerrar/i });
        await user.click(botonCerrar);

        // Se cierra la pagina
        expect(window.location.pathname).toBe('/');
    });

    it('boton imprimir imprime la boleta', async () => {
        const user = userEvent.setup();
        renderCheckoutConProductos();
        // Mock window.print
        const mockPrint = vi.fn();
        window.print = mockPrint; // Es como si le dijese que eso es lo que esta haciendo , pero solo la llama no ejecuta!!

        // Buscar el botón imprimir
        const botonImprimir = screen.getByRole('button', { name: /imprimir/i });
        await user.click(botonImprimir);

        // Se imprime la boleta
        expect(mockPrint).toHaveBeenCalled();
    });

    

});