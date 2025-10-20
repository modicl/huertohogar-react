import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';

vi.mock('../components/AdminDashboard', () => ({
  AdminDashboard: () => <div>AdminDashboard Component</div>
}));

describe('Dashboard Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe renderizar sin errores', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(screen.getByText('AdminDashboard Component')).toBeInTheDocument();
  });

  it('debe cambiar el titulo del documento', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(document.title).toBe('Dashboard - Admin | HuertoHogar');
  });

  it('debe renderizar el componente AdminDashboard', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(screen.getByText('AdminDashboard Component')).toBeInTheDocument();
  });
});
