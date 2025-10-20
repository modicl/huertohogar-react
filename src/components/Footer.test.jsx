import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './Footer';
import userEvent from '@testing-library/user-event';

const renderFooter = () => {
    render(
        <BrowserRouter>
            <Footer />
        </BrowserRouter>
    )
}

describe('Componente Footer', () => {

    it('debe renderizar el componente Footer sin errores', () => {
        renderFooter();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it('debe contener 3 secciones', () => {
        renderFooter();

        let secciones = document.querySelectorAll('.col');
        expect(secciones).toHaveLength(3);
    })

    it('los titulos de cada seccion deben ser : Tiendas físicas y horarios, Contáctanos y Suscríbete', () => {
        renderFooter();

        let tiendas = screen.getByText(/Tiendas físicas y horarios/i);
        expect(tiendas).toBeInTheDocument();

        let contactanos = screen.getByText(/Contáctanos/i);
        expect(contactanos).toBeInTheDocument();

        let suscribete = screen.getByText(/Suscríbete/i);
        expect(suscribete).toBeInTheDocument();


    });

    it('se carga el mapa de google con la ubicacion de la sede central', () => {
        renderFooter();

        expect(screen.getByTestId("mapa-google")).toBeInTheDocument();
    });

    it('boton enviar genera mensaje exitoso con correo validot', async () => {
        userEvent.setup();
        renderFooter();
        // 1. Buscar el input de email
        const emailInput = screen.getByTestId('correo');

        // 2. Escribir un email válido
        await userEvent.type(emailInput, 'test@example.com');

        // 3. Buscar y hacer clic en el botón
        const botonEnviar = screen.getByRole('button', { name: /Enviar/i });
        await userEvent.click(botonEnviar);

        // 4. Verificar que aparece el mensaje de éxito
        const mensajeExito = screen.getByText(/¡Te has suscrito correctamente!/i);
        expect(mensajeExito).toBeInTheDocument();

        // 5. Verificar que el input se limpió
        expect(emailInput).toHaveValue('');

    });

    it('boton enviar genera mensaje de error con correo invalido', async () => {
        userEvent.setup();
        renderFooter();

        // 1. Obtenemos input del mail
        const emailInput = screen.getByTestId('correo');

        // 2. Escribimos un email invalido
        await userEvent.type(emailInput, 'holaprofe!');

        // 3. Obtenemos y clickeamos el boton enviar
        const botonEnviar = screen.getByRole('button', { name: /enviar/i })
        await userEvent.click(botonEnviar);

        // 4. Verificar que aparece el mensaje de error
        const mensajeError = screen.getByText(/Debes ingresar un correo válido./i);
        expect(mensajeError).toBeInTheDocument();
    });

    it('boton enviar genera mensaje de erorr con input vacio'), async () => {
        userEvent.setup();
        renderFooter();

        // 1. Obtenemos input del mail
        const emailInput = screen.getByTestId('correo');

        // 2. Escribimos un email invalido
        await userEvent.type(emailInput, '');

        // 3. Obtenemos y clickeamos el boton enviar
        const botonEnviar = screen.getByRole('button', { name: /enviar/i })
        await userEvent.click(botonEnviar);

        // 4. Verificar que aparece el mensaje de error
        const mensajeError = screen.getByText(/Debes ingresar tu correo electrónico/i);
        expect(mensajeError).toBeInTheDocument();

    }


});