import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

describe('Componente ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe redirigir a login si no hay token de autenticacion', () => {
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <div data-testid="protected-content">Dashboard</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('debe mostrar el contenido si existe token de autenticacion', () => {
    localStorage.setItem('adminToken', 'fake-token-123');

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <div data-testid="protected-content">Dashboard</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('debe renderizar correctamente children cuando esta autenticado', () => {
    localStorage.setItem('adminToken', 'fake-token-123');

    render(
      <MemoryRouter initialEntries={['/admin/productos']}>
        <Routes>
          <Route path="/admin/productos" element={
            <ProtectedRoute>
              <div data-testid="productos-content">
                <h1>Gestión de Productos</h1>
                <p>Lista de productos</p>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('productos-content')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
    expect(screen.getByText('Lista de productos')).toBeInTheDocument();
  });

  it('debe verificar el token en localStorage al renderizar', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <div>Protected</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(getItemSpy).toHaveBeenCalledWith('adminToken');
    getItemSpy.mockRestore();
  });

  it('debe redirigir con replace para evitar bucles de navegacion', () => {
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <div>Protected</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
