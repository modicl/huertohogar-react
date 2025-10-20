import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AdminLogin } from './AdminLogin';

const renderAdminLogin = () => {
  return render(
    <MemoryRouter>
      <AdminLogin />
    </MemoryRouter>
  );
};

describe('Componente AdminLogin', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe renderizar el componente AdminLogin sin errores', () => {
    renderAdminLogin();
    
    expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
    expect(screen.getByText('HuertoHogar')).toBeInTheDocument();
  });

  it('debe mostrar el logo de HuertoHogar', () => {
    renderAdminLogin();
    
    const logo = screen.getByAltText('HuertoHogar');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/logo_navbar.png');
  });

  it('debe tener campos de email y password', () => {
    renderAdminLogin();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('debe tener un boton de iniciar sesion', () => {
    renderAdminLogin();
    
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('debe mostrar credenciales de prueba', () => {
    renderAdminLogin();
    
    expect(screen.getByText(/Credenciales de prueba:/i)).toBeInTheDocument();
    expect(screen.getByText(/Email: admin@huertohogar.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Password: admin123/i)).toBeInTheDocument();
  });

  it('debe tener un enlace para volver al sitio', () => {
    renderAdminLogin();
    
    const backLink = screen.getByRole('link', { name: /volver al sitio/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('debe permitir escribir en el campo de email', async () => {
    const user = userEvent.setup();
    renderAdminLogin();
    
    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('debe permitir escribir en el campo de password', async () => {
    const user = userEvent.setup();
    renderAdminLogin();
    
    const passwordInput = screen.getByLabelText('Contraseña');
    await user.type(passwordInput, 'password123');
    
    expect(passwordInput).toHaveValue('password123');
  });

  it('debe mostrar error con credenciales incorrectas', async () => {
    const user = userEvent.setup();
    renderAdminLogin();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    await user.type(emailInput, 'wrong@email.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });
  });

  it('debe guardar token con credenciales correctas', async () => {
    const user = userEvent.setup();
    renderAdminLogin();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    await user.type(emailInput, 'admin@huertohogar.com');
    await user.type(passwordInput, 'admin123');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(localStorage.getItem('adminToken')).toBe('token-admin-123');
      expect(localStorage.getItem('adminEmail')).toBe('admin@huertohogar.com');
    });
  });

  it('debe tener iconos de Material Icons en los campos', () => {
    renderAdminLogin();
    
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('lock')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  it('debe renderizar el icono de error cuando hay un error', async () => {
    const user = userEvent.setup();
    renderAdminLogin();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    await user.type(emailInput, 'wrong@email.com');
    await user.type(passwordInput, 'wrong');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('error')).toBeInTheDocument();
    });
  });

  it('debe tener campos requeridos', () => {
    renderAdminLogin();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('no debe mostrar error inicialmente', () => {
    renderAdminLogin();
    
    expect(screen.queryByText('Credenciales incorrectas')).not.toBeInTheDocument();
  });
});
