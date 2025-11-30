import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import userEvent from '@testing-library/user-event';

// Mock de AuthContext con función logout que limpia localStorage
const mockLogout = vi.fn(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
});

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        token: 'mock-token',
        user: { email: 'admin@test.com', rol: 'ADMIN' },
        isAuthenticated: () => true,
        logout: mockLogout
    })
}));

const renderAdminLayout = () => {
    render(
        <BrowserRouter>
            <AdminLayout />
        </BrowserRouter>
    )
}

describe('Componente AdminLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Creamos el token falso para adminToken (usado en algunos casos)
        localStorage.setItem('adminToken', 'token-falso');
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('debe renderizar el componente AdminLayout sin errores', () => {
        renderAdminLayout();
        expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    });


    it('boton cerrar sesion debe funcionar y devuelve a pagina login', async () => {
        renderAdminLayout();
        const user = userEvent.setup();
        // Obtenemos boton y lo clikeamos
        const logoutButton = screen.getByTestId('logout');
        expect(logoutButton).toBeInTheDocument();
        await user.click(logoutButton);

        // Verificar que se llamó a logout
        expect(mockLogout).toHaveBeenCalled();

        // Revisamos que el token adminToken desaparezca del localStorage
        await waitFor(() => {
            expect(localStorage.getItem('adminToken')).toBeNull();
        });

        // Nos encontramos en la pagina '/admin/login'
        await waitFor(() => {
            expect(window.location.pathname).toBe('/admin/login');
        });

    });



});



