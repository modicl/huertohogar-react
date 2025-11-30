import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Checkout } from './Checkout';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

// Mock de axios
vi.mock('axios');

// Mock de AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        token: 'mock-token',
        user: { 
            idUsuario: 1, 
            email: 'test@test.com',
            nombre: 'Test User',
            aPaterno: 'Apellido',
            telefono: '912345678',
            direccion: 'Calle Test 123',
            idRegion: 1,
            rol: 'USER' 
        },
        isAuthenticated: () => true,
        logout: vi.fn()
    })
}));

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
        vi.clearAllMocks();
        // Mock de axios.post exitoso
        axios.post.mockResolvedValue({ status: 201, data: { idOrden: 123 } });
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

    it('debe mostrar la información del usuario desde su perfil', () => {
        renderCheckoutConProductos();

        // El checkout ahora muestra los datos del usuario desde su perfil (no campos de formulario)
        expect(screen.getByText(/Información de Envío/i)).toBeInTheDocument();
        expect(screen.getByText(/Nombre:/i)).toBeInTheDocument();
        expect(screen.getByText(/Email:/i)).toBeInTheDocument();
        expect(screen.getByText(/Teléfono:/i)).toBeInTheDocument();
        expect(screen.getByText(/Dirección:/i)).toBeInTheDocument();
    });

    it('debe procesar compra exitosamente', async () => {
        const user = userEvent.setup();
        renderCheckoutConProductos();

        // Ya no hay campos de formulario para llenar, los datos vienen del perfil del usuario
        // Simplemente verificamos que el botón de finalizar compra existe
        const botonCompra = screen.getByTestId('btn-finalizar-compra');
        expect(botonCompra).toBeInTheDocument();

        // Verificar que los métodos de pago están disponibles
        expect(screen.getByText(/Método de Pago/i)).toBeInTheDocument();

        // Hacer click en finalizar compra
        await user.click(botonCompra);

        // Esperar a que la compra se procese y el carrito se vacíe
        await waitFor(() => {
            expect(mockSetCartHuerto).toHaveBeenCalledWith([]);
        });
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