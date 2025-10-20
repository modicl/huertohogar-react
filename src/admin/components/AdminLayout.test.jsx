import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import userEvent from '@testing-library/user-event';

const renderAdminLayout = () => {
    render(
        <BrowserRouter>
            <AdminLayout />
        </BrowserRouter>
    )
}

describe('Componente AdminLayout', () => {
    beforeEach(() => {
        renderAdminLayout();
        // Creamos el token falso para adminToken (usado en algunos casos)
        localStorage.setItem('adminToken', 'token-falso');
    });

    it('debe renderizar el componente AdminLayout sin errores', () => {
        expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    });


    it('boton cerrar sesion debe funcionar y devuelve a pagina login', async () => {
        const user = userEvent.setup();
        // Obtenemos boton y lo clikeamos
        const logoutButton = screen.getByTestId('logout');
        expect(logoutButton).toBeInTheDocument();
        await user.click(logoutButton);

        // Revisamos que el token adminToken desaparezca del localtStorage

        await waitFor(() => {
            expect(localStorage.getItem('adminToken')).toBeNull();
        });

        // Nos encontramos en la pagina '/admin/login'
        await waitFor(() => {
            expect(window.location.pathname).toBe('/admin/login');
        });

    });



});



