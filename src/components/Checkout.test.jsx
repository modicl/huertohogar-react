import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Checkout } from './Checkout';
import userEvent from '@testing-library/user-event';

// Mock de un producto de prueba
const mockProducto = {
    id: 1,
    nombre: 'Manzana Roja',
    precio: 1200,
    imagen: '/images/manzana.jpg',
    descripcion: 'Manzanas frescas',
    categoria: 'Frutas',
    stock: 50,
    quantity: 2
};

// ✅ Mock del setter del carrito
const mockSetCartHuerto = vi.fn();

// Helper que renderiza el checkout CON productos en el carrito
const renderCheckoutConProductos = (productos = [mockProducto]) => {
    // Pre-poblar el localStorage con productos
    localStorage.setItem('cartHuerto', JSON.stringify(productos));

    return render(
        <BrowserRouter>
            <Checkout
                cartHuerto={productos}
                setCartHuerto={mockSetCartHuerto}
            />
        </BrowserRouter>
    );
};

// Helper que renderiza el checkout SIN productos en el carrito
const renderCheckoutSinProductos = () => {
    // Limpiar localStorage antes de renderizar
    localStorage.removeItem('cartHuerto');

    return render(
        <BrowserRouter>
            <Checkout
                cartHuerto={[]}
                setCartHuerto={mockSetCartHuerto}
            />
        </BrowserRouter>
    );
}


describe('Componente Checkout', () => {

    beforeEach(() => {
        // Limpiar localStorage antes de cada test
        localStorage.clear();
        // ✅ Limpiar el mock antes de cada test
        mockSetCartHuerto.mockClear();
    });

    it('debe renderizar el componente Checkout sin errores si no hay productos en el carrito', () => {
        renderCheckoutSinProductos();

        expect(screen.getByTestId("carro-sinitems")).toBeInTheDocument();
        expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
    });

    it('debe renderizar el componente Checkout sin errores si hay productos en el carrito', () => {
        renderCheckoutConProductos();

        expect(screen.getByText('Manzana Roja')).toBeInTheDocument();
    });

    it('debe mostrar el botón "Finalizar Compra" cuando hay productos en el carrito', () => {
        renderCheckoutConProductos();

        const botonCompra = screen.getByTestId('btn-finalizar-compra');
        expect(botonCompra).toBeInTheDocument();
    });

    it('debe mostrar el subtotal y total correcto del carrito', () => {
        renderCheckoutConProductos();

        // ✅ OPCIÓN 1: Buscar TODOS los elementos y verificar que al menos uno existe
        const elementosConPrecio = screen.getAllByText(/\$2\.400/);
        expect(elementosConPrecio.length).toBeGreaterThan(0);

        // ✅ Para el total
        const elementosConTotal = screen.getAllByText(/\$5\.400/);
        expect(elementosConTotal.length).toBeGreaterThan(0);
    });

    it('debe tener el formulario de datos del cliente', () => {
        renderCheckoutConProductos();

        // Usar los labels exactos de tu formulario
        expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/dirección completa/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/código postal/i)).toBeInTheDocument();
    });

    it('debe procesar compra exitosamente with datos válidos', async () => {
        const user = userEvent.setup();
        renderCheckoutConProductos();

        // Llenar TODOS los campos obligatorios
        await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
        await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
        await user.type(screen.getByLabelText(/teléfono/i), '912345678');
        await user.type(screen.getByLabelText(/dirección completa/i), 'Calle Falsa 123');
        await user.type(screen.getByLabelText(/ciudad/i), 'Santiago');
        await user.type(screen.getByLabelText(/código postal/i), '8320000');

        // Seleccionar región (select)
        const selectRegion = screen.getByRole('combobox');
        await user.selectOptions(selectRegion, 'Región Metropolitana de Santiago');

        // Finalizar compra
        const botonCompra = screen.getByTestId('btn-finalizar-compra');
        await user.click(botonCompra);

        // Verificar que setCartHuerto fue llamado con array vacío
        expect(mockSetCartHuerto).toHaveBeenCalledWith([]);
    });


    it('debe decrementar la cantidad de un producto', async () => {
        const user = userEvent.setup();
        renderCheckoutConProductos();

        // ✅ Limpiar las llamadas previas antes de la acción
        mockSetCartHuerto.mockClear();

        // Buscar el botón "-"
        const botonMenos = screen.getByRole('button', { name: '-' });
        await user.click(botonMenos);

        // Verificar que setCartHuerto fue llamado
        expect(mockSetCartHuerto).toHaveBeenCalled();

        // ✅ Ahora la primera llamada ES la del click
        const llamada = mockSetCartHuerto.mock.calls[0][0];
        expect(llamada[0].quantity).toBe(1);
    });

    it('debe incrementar la cantidad de un producto', async () => {
        const user = userEvent.setup();
        renderCheckoutConProductos();

        // ✅ Limpiar las llamadas previas
        mockSetCartHuerto.mockClear();

        // Buscar el botón "+"
        const botonMas = screen.getByRole('button', { name: '+' });
        await user.click(botonMas);

        expect(mockSetCartHuerto).toHaveBeenCalled();

        // ✅ Ahora la primera llamada ES la del click
        const llamada = mockSetCartHuerto.mock.calls[0][0];
        expect(llamada[0].quantity).toBe(3);
    });


});