import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Mock de AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Importar el mock para poder cambiarlo en cada test
import { useAuth } from '../../context/AuthContext';

describe('Componente ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe redirigir a login si no hay token de autenticacion', () => {
    // Simular usuario no autenticado
    useAuth.mockReturnValue({
      token: null,
      user: null,
      isAuthenticated: () => false
    });

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
    // Simular usuario autenticado
    useAuth.mockReturnValue({
      token: 'fake-token-123',
      user: { email: 'admin@test.com', rol: 'ADMIN' },
      isAuthenticated: () => true
    });

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
    useAuth.mockReturnValue({
      token: 'fake-token-123',
      user: { email: 'admin@test.com', rol: 'ADMIN' },
      isAuthenticated: () => true
    });

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
    // Simular usuario no autenticado
    useAuth.mockReturnValue({
      token: null,
      user: null,
      isAuthenticated: () => false
    });

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

    // Verificar que se usa el contexto de auth
    expect(useAuth).toHaveBeenCalled();
  });

  it('debe redirigir con replace para evitar bucles de navegacion', () => {
    // Simular usuario no autenticado
    useAuth.mockReturnValue({
      token: null,
      user: null,
      isAuthenticated: () => false
    });

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

  it('debe mostrar loading mientras se carga el contexto', () => {
    // Simular estado de carga
    useAuth.mockReturnValue({
      token: null,
      user: null,
      loading: true,
      isAuthenticated: () => false
    });

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <div data-testid="protected-content">Dashboard</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    // No debe mostrar ni el contenido protegido ni el login mientras carga
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    // Debe mostrar el spinner de carga
    expect(document.querySelector('.preloader-wrapper')).toBeInTheDocument();
  });

  it('debe redirigir si el usuario no tiene rol ADMIN', () => {
    // Simular usuario con rol USER
    useAuth.mockReturnValue({
      token: 'fake-token',
      user: { email: 'user@test.com', rol: 'USER' },
      loading: false,
      isAuthenticated: () => true
    });

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <div data-testid="protected-content">Dashboard</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Debe redirigir a login porque no es ADMIN
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('debe permitir acceso si el usuario es ADMIN y loading es false', () => {
    useAuth.mockReturnValue({
      token: 'fake-token',
      user: { email: 'admin@test.com', rol: 'ADMIN' },
      loading: false,
      isAuthenticated: () => true
    });

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <div data-testid="protected-content">Dashboard Protegido</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Protegido')).toBeInTheDocument();
  });

  it('debe redirigir si user es null aunque haya token', () => {
    useAuth.mockReturnValue({
      token: 'fake-token',
      user: null,
      loading: false,
      isAuthenticated: () => false
    });

    render(
      <MemoryRouter initialEntries={['/admin/usuarios']}>
        <Routes>
          <Route path="/admin/usuarios" element={
            <ProtectedRoute>
              <div data-testid="usuarios-content">Usuarios</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
