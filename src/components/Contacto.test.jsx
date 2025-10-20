import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Contacto } from './Contacto';
import userEvent from '@testing-library/user-event';

// Mock de los componentes Header y Footer para aislar el test
vi.mock('./Header', () => ({
    Header: () => <div data-testid="header">Header Mock</div>
}));

vi.mock('./Footer', () => ({ 
    Footer: () => <div data-testid="footer">Footer Mock</div>
}));

// Wrapper con Router para el componente Contacto
const renderContacto = () => {
    render(
        <BrowserRouter>
            <Contacto />
        </BrowserRouter>
    );
}

describe('Componente Contacto', () => {

    // Test 1: Verificar que el componente se renderiza correctamente
    it('debe renderizar el componente Contacto sin errores', () => {
        renderContacto();
        expect(screen.getByText('Contáctanos')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    // Test 2: Verificar que el formulario tiene todos sus campos
    it('debe mostrar el formulario de contacto con todos sus campos', () => {
        renderContacto();

        expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/asunto/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });

    // Test 3: Verificar que muestra la información de contacto
    it('debe mostrar la información de contacto adicional', () => {
        renderContacto();

        expect(screen.getByText('Otras formas de contactarnos')).toBeInTheDocument();
        expect(screen.getByText('contacto@huertohogar.cl')).toBeInTheDocument();
        expect(screen.getByText('+56 2 2345 6789')).toBeInTheDocument();
        expect(screen.getByText('Lun - Dom: 9:00 - 18:00 hrs')).toBeInTheDocument();
    });

    // Test 4: Verificar que los enlaces a redes sociales están presentes
    it('debe mostrar los enlaces a redes sociales', () => {
        renderContacto();

        const socialLinks = screen.getAllByRole('link');
        const socialUrls = socialLinks.map(link => link.href);

        expect(socialUrls).toContain('https://x.com/');
        expect(socialUrls).toContain('https://instagram.com/');
        expect(socialUrls).toContain('https://facebook.com/');
        expect(socialUrls).toContain('https://wa.me/');
    });

    // Test 5: Verificar la funcionalidad de escritura en el formulario
    it('debe permitir escribir en los campos del formulario', async () => {
        const user = userEvent.setup();
        renderContacto();

        const nombreInput = screen.getByLabelText(/nombre completo/i);
        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const asuntoInput = screen.getByLabelText(/asunto/i);
        const mensajeInput = screen.getByLabelText(/mensaje/i);

        await user.type(nombreInput, 'Charlie Brown');
        await user.type(emailInput, 'charlie@example.com');
        await user.type(asuntoInput, 'Consulta');
        await user.type(mensajeInput, 'Este es un mensaje de prueba');

        expect(nombreInput).toHaveValue('Charlie Brown');
        expect(emailInput).toHaveValue('charlie@example.com');
        expect(asuntoInput).toHaveValue('Consulta');
        expect(mensajeInput).toHaveValue('Este es un mensaje de prueba');
    });

});