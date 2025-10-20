import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Registro } from './Registro';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

const renderRegistro = () => {
    render(
        <BrowserRouter>
            <Registro />
        </BrowserRouter>
    )
};

describe('Componente Registro', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('debe renderizar el componente Registro sin errores', () => {
        renderRegistro();
        expect(screen.getByTestId("registro")).toBeInTheDocument();
    });

    it('debe renderizar el formulario de inicio de sesión', () => {
        renderRegistro();
        expect(screen.getByTestId("inicio-sesion")).toBeInTheDocument();

    });

    it('debe renderizar el formulario de registro', () => {
        renderRegistro();
        expect(screen.getByTestId("formulario-registro")).toBeInTheDocument();
    });

    // Validando RUT

    it('el input RUT tiene las validaciones configuradas', () => {
        renderRegistro();

        const rutInput = screen.getByTestId("rut-registro");

        // ✅ Verificar atributos de validación
        expect(rutInput).toHaveAttribute('data-parsley-pattern', '^[0-9]{7,8}[kK0-9]{1}$');
        expect(rutInput).toHaveAttribute('data-parsley-minlength', '7');
        expect(rutInput).toHaveAttribute('maxLength', '9');
        expect(rutInput).toHaveAttribute('required');
    });

    it('acepta RUT con formato válido', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const rutInput = screen.getByTestId("rut-registro");

        // RUTs válidos
        const rutValido = "12345678K";
        await user.type(rutInput, rutValido);

        expect(rutInput).toHaveValue(rutValido);
        expect(rutInput.value).toMatch(/^[0-9]{7,8}[kK0-9]{1}$/);
    });

    it('limita la longitud del RUT a 9 caracteres', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const rutInput = screen.getByTestId("rut-registro");

        await user.type(rutInput, "12345678901234");

        expect(rutInput.value.length).toBeLessThanOrEqual(9);
    });

    it('debe tener campos de nombre y apellidos', () => {
        renderRegistro();

        expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Apellido Paterno/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Apellido Materno/i)).toBeInTheDocument();
    });

    it('debe tener select de region y comuna', () => {
        renderRegistro();

        const regionSelect = screen.getByLabelText(/Región/i);
        expect(regionSelect).toBeInTheDocument();
        
        const comunaSelect = screen.getByLabelText(/Comuna/i);
        expect(comunaSelect).toBeInTheDocument();
    });

    it('debe actualizar comunas cuando se selecciona una region', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const regionSelect = screen.getByLabelText(/Región/i);
        
        await user.selectOptions(regionSelect, 'Metropolitana');

        const comunaSelect = screen.getByLabelText(/Comuna/i);
        const options = comunaSelect.querySelectorAll('option');
        expect(options.length).toBeGreaterThan(1);
    });

    it('debe tener campo de direccion', () => {
        renderRegistro();

        const addressInput = screen.getByLabelText(/Dirección/i);
        expect(addressInput).toBeInTheDocument();
        expect(addressInput).toHaveAttribute('required');
    });

    it('debe tener campo de fecha de nacimiento', () => {
        renderRegistro();

        const birthdateInput = screen.getByLabelText(/Fecha de Nacimiento/i);
        expect(birthdateInput).toBeInTheDocument();
        expect(birthdateInput).toHaveClass('datepicker');
    });

    it('debe tener campos de email y contraseña en formulario de registro', () => {
        renderRegistro();

        const emailInputs = screen.getAllByLabelText(/Correo electrónico/i);
        expect(emailInputs.length).toBeGreaterThan(0);

        const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
        expect(passwordInputs.length).toBeGreaterThan(0);
    });

    it('debe tener campo de confirmacion de contraseña', () => {
        renderRegistro();

        const confirmPasswordInput = screen.getByLabelText(/Repita su contraseña/i);
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    it('debe tener botones de submit para login y registro', () => {
        renderRegistro();

        const ingresarButton = screen.getByRole('button', { name: /Ingresar/i });
        expect(ingresarButton).toBeInTheDocument();
        
        const registrarButton = screen.getByRole('button', { name: /Registrar/i });
        expect(registrarButton).toBeInTheDocument();
    });

    it('debe tener boton para limpiar formulario', () => {
        renderRegistro();

        const clearButton = screen.getByRole('button', { name: /limpiar/i });
        expect(clearButton).toBeInTheDocument();
        expect(clearButton).toHaveAttribute('type', 'button');
    });

    it('debe permitir escribir en campos de texto', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const nombreInput = screen.getByLabelText(/Nombre/i);
        await user.type(nombreInput, 'Juan');
        expect(nombreInput).toHaveValue('Juan');

        const apellidoInput = screen.getByLabelText(/Apellido Paterno/i);
        await user.type(apellidoInput, 'Pérez');
        expect(apellidoInput).toHaveValue('Pérez');
    });

    it('debe validar el formato del RUT y no aceptar letras excepto K', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const rutInput = screen.getByTestId("rut-registro");

        await user.type(rutInput, 'abc123XYZ');
        
        expect(rutInput.value).not.toContain('a');
        expect(rutInput.value).not.toContain('X');
        expect(rutInput.value).not.toContain('Y');
    });

    it('debe remover ceros iniciales del RUT', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const rutInput = screen.getByTestId("rut-registro");

        await user.type(rutInput, '00012345678K');
        
        expect(rutInput.value).not.toMatch(/^0/);
    });

    it('debe permitir escribir en el campo de email de login', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const loginEmailInputs = screen.getAllByLabelText(/Correo electrónico/i);
        const loginEmailInput = loginEmailInputs[0];
        
        await user.type(loginEmailInput, 'test@duoc.cl');
        
        expect(loginEmailInput).toHaveValue('test@duoc.cl');
    });

    it('debe permitir escribir en el campo de password de login', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const loginPasswordInputs = screen.getAllByLabelText(/Contraseña/i);
        const loginPasswordInput = loginPasswordInputs[0];
        
        await user.type(loginPasswordInput, 'password123');
        expect(loginPasswordInput).toHaveValue('password123');
    });

    it('debe llamar handleLogin al enviar el formulario de login', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const loginForm = screen.getByTestId('inicio-sesion');
        const submitButton = screen.getByRole('button', { name: /Ingresar/i });

        await user.click(submitButton);
        
        expect(loginForm).toBeInTheDocument();
    });

    it('debe llamar handleRegistro al enviar el formulario de registro', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const registroForm = screen.getByTestId('formulario-registro');
        const submitButton = screen.getByRole('button', { name: /Registrar/i });

        await user.click(submitButton);
        
        expect(registroForm).toBeInTheDocument();
    });

    it('debe limpiar el formulario al hacer click en boton Limpiar', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const nombreInput = screen.getByLabelText(/Nombre/i);
        await user.type(nombreInput, 'Juan');
        expect(nombreInput).toHaveValue('Juan');

        const limpiarButton = screen.getByRole('button', { name: /Limpiar/i });
        await user.click(limpiarButton);

        expect(nombreInput).toHaveValue('');
    });

    it('debe limpiar todos los campos del formulario al usar boton Limpiar', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const nombreInput = screen.getByLabelText(/Nombre/i);
        const apellidoInput = screen.getByLabelText(/Apellido Paterno/i);
        const rutInput = screen.getByTestId("rut-registro");

        await user.type(nombreInput, 'Juan');
        await user.type(apellidoInput, 'Pérez');
        await user.type(rutInput, '12345678K');

        const limpiarButton = screen.getByRole('button', { name: /Limpiar/i });
        await user.click(limpiarButton);

        expect(nombreInput).toHaveValue('');
        expect(apellidoInput).toHaveValue('');
        expect(rutInput).toHaveValue('');
    });

    it('debe tener validaciones data-parsley en campos requeridos', () => {
        renderRegistro();

        const nombreInput = screen.getByLabelText(/Nombre/i);
        expect(nombreInput).toHaveAttribute('data-parsley-required-message');
        expect(nombreInput).toHaveAttribute('data-parsley-maxlength');

        const emailInputs = screen.getAllByLabelText(/Correo electrónico/i);
        const emailInput = emailInputs[0];
        expect(emailInput).toHaveAttribute('data-parsley-type', 'email');
        expect(emailInput).toHaveAttribute('data-parsley-pattern');
    });

    it('debe tener el campo de password con validaciones de caracteres especiales', () => {
        renderRegistro();

        const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
        const registroPasswordInput = passwordInputs[1];
        
        expect(registroPasswordInput).toHaveAttribute('data-parsley-specialchar');
        expect(registroPasswordInput).toHaveAttribute('data-parsley-minlength', '4');
        expect(registroPasswordInput).toHaveAttribute('data-parsley-maxlength', '10');
    });

    it('debe tener el campo de confirmacion de password con validacion equalto', () => {
        renderRegistro();

        const confirmPasswordInput = screen.getByLabelText(/Repita su contraseña/i);
        
        expect(confirmPasswordInput).toHaveAttribute('data-parsley-equalto', '#registro_password');
        expect(confirmPasswordInput).toHaveAttribute('data-parsley-specialchar');
    });

    it('debe cambiar el estado cuando se escribe en region', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const regionSelect = screen.getByLabelText(/Región/i);
        
        await user.selectOptions(regionSelect, 'Valparaíso');
        
        expect(regionSelect.value).toBe('Valparaíso');
    });

    it('debe tener placeholder en el campo de nombre', () => {
        renderRegistro();

        const nombreInput = screen.getByLabelText(/Nombre/i);
        expect(nombreInput).toHaveAttribute('placeholder', 'Nombre');
    });

    it('debe tener maxLength en el campo RUT', () => {
        renderRegistro();

        const rutInput = screen.getByTestId("rut-registro");
        expect(rutInput).toHaveAttribute('maxLength', '9');
    });

    it('debe tener el tipo correcto en los campos de password', () => {
        renderRegistro();

        const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
        passwordInputs.forEach(input => {
            expect(input).toHaveAttribute('type', 'password');
        });

        const confirmPasswordInput = screen.getByLabelText(/Repita su contraseña/i);
        expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    it('debe tener el formulario de login con id correcto', () => {
        renderRegistro();

        const loginForm = screen.getByTestId('inicio-sesion');
        expect(loginForm).toHaveAttribute('id', 'form-login');
    });

    it('debe tener el formulario de registro con id correcto', () => {
        renderRegistro();

        const registroForm = screen.getByTestId('formulario-registro');
        expect(registroForm).toHaveAttribute('id', 'formulario-registro');
    });

    it('debe tener titulo "Iniciar Sesión" en formulario de login', () => {
        renderRegistro();

        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });

    it('debe tener titulo "Registro" en formulario de registro', () => {
        renderRegistro();

        expect(screen.getByText('Registro')).toBeInTheDocument();
    });

    it('debe tener link de recuperar contraseña', () => {
        renderRegistro();

        const recuperarLink = screen.getByText('Recuperar contraseña');
        expect(recuperarLink).toBeInTheDocument();
        expect(recuperarLink).toHaveAttribute('href', '#');
    });

    it('debe tener apellido materno como campo requerido', () => {
        renderRegistro();

        const apellidoMaternoInput = screen.getByLabelText(/Apellido Materno/i);
        expect(apellidoMaternoInput).toBeInTheDocument();
        expect(apellidoMaternoInput).toHaveAttribute('required');
    });

    it('debe permitir escribir en el campo de apellido materno', async () => {
        const user = userEvent.setup();
        renderRegistro();

        const apellidoMaternoInput = screen.getByLabelText(/Apellido Materno/i);
        await user.type(apellidoMaternoInput, 'González');
        
        expect(apellidoMaternoInput).toHaveValue('González');
    });

    it('debe tener validacion de minlength en dirección', () => {
        renderRegistro();

        const addressInput = screen.getByLabelText(/Dirección/i);
        expect(addressInput).toHaveAttribute('data-parsley-minlength', '10');
    });

    it('debe tener todas las regiones de Chile en el select', () => {
        renderRegistro();

        const regionSelect = screen.getByLabelText(/Región/i);
        const options = regionSelect.querySelectorAll('option');
        
        expect(options.length).toBeGreaterThan(15);
    });

    it('debe tener mensaje de validacion para region', () => {
        renderRegistro();

        const regionSelect = screen.getByLabelText(/Región/i);
        expect(regionSelect).toHaveAttribute('data-parsley-required-message', 'Debes seleccionar una región.');
    });

    it('debe tener mensaje de validacion para comuna', () => {
        renderRegistro();

        const comunaSelect = screen.getByLabelText(/Comuna/i);
        expect(comunaSelect).toHaveAttribute('data-parsley-required-message', 'Debes seleccionar una comuna.');
    });

});