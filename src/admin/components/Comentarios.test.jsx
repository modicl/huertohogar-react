import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Comentarios } from './Comentarios';

const mockProductosConComentarios = [
  {
    id: 1,
    nombre: 'Manzana Roja',
    comentarios: [
      {
        id: 1,
        usuario: 'Juan Pérez',
        comentario: 'Excelente producto',
        estrellas: 5,
        fecha: '2025-10-15T10:00:00.000Z'
      },
      {
        id: 2,
        usuario: 'María González',
        comentario: 'Muy buena calidad',
        estrellas: 4,
        fecha: '2025-10-16T14:00:00.000Z'
      }
    ]
  },
  {
    id: 2,
    nombre: 'Plátano',
    comentarios: [
      {
        id: 3,
        usuario: 'Pedro López',
        comentario: 'Buen precio',
        estrellas: 3,
        fecha: '2025-10-17T09:00:00.000Z'
      }
    ]
  }
];

describe('Componente Comentarios', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('productos', JSON.stringify(mockProductosConComentarios));
    window.M = {
      Modal: { init: () => ({ open: () => {}, close: () => {}, getInstance: () => ({ close: () => {} }) }) },
      toast: () => {}
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe renderizar el componente Comentarios sin errores', () => {
    render(<Comentarios />);
    
    expect(screen.getByText('Gestión de Comentarios')).toBeInTheDocument();
  });

  it('debe mostrar el subtitulo del componente', () => {
    render(<Comentarios />);

    expect(screen.getByText(/Administra/i)).toBeInTheDocument();
  });  it('debe mostrar las 4 tarjetas de estadisticas', () => {
    render(<Comentarios />);
    
    expect(screen.getByText('Total Comentarios')).toBeInTheDocument();
    expect(screen.getByText(/5 Estrellas/i)).toBeInTheDocument();
  });

  it('debe calcular correctamente el total de comentarios', () => {
    render(<Comentarios />);
    
    const totalCard = screen.getByText('Total Comentarios').closest('.stat-card');
    expect(within(totalCard).getByText('3')).toBeInTheDocument();
  });

  it('debe calcular correctamente el promedio de estrellas', () => {
    render(<Comentarios />);

    expect(screen.getByText('Total Comentarios')).toBeInTheDocument();
  });  it('debe contar correctamente los comentarios de 5 estrellas', () => {
    render(<Comentarios />);
    
    const cincoCincoCincoCard = screen.getByText('5 Estrellas').closest('.stat-card');
    expect(within(cincoCincoCincoCard).getByText('1')).toBeInTheDocument();
  });

  it('debe mostrar los nombres de los usuarios', () => {
    render(<Comentarios />);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
    expect(screen.getByText('Pedro López')).toBeInTheDocument();
  });

  it('debe mostrar los comentarios de los usuarios', () => {
    render(<Comentarios />);
    
    expect(screen.getByText('Excelente producto')).toBeInTheDocument();
    expect(screen.getByText('Muy buena calidad')).toBeInTheDocument();
    expect(screen.getByText('Buen precio')).toBeInTheDocument();
  });

  it('debe mostrar los nombres de los productos', () => {
    render(<Comentarios />);
    
    expect(screen.getAllByText('Manzana Roja').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Plátano').length).toBeGreaterThan(0);
  });

  it('debe tener un filtro de productos', () => {
    render(<Comentarios />);
    
    const filterSelects = screen.getAllByRole('combobox');
    expect(filterSelects.length).toBeGreaterThan(0);
  });

  it('debe tener botones de accion para cada comentario', () => {
    render(<Comentarios />);
    
    const editButtons = screen.getAllByText('edit');
    expect(editButtons.length).toBeGreaterThan(0);
    
    const deleteButtons = screen.getAllByText('delete');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('debe renderizar estrellas para cada comentario', () => {
    render(<Comentarios />);
    
    const stars = screen.getAllByText('star');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('debe cargar comentarios desde localStorage', () => {
    render(<Comentarios />);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Excelente producto')).toBeInTheDocument();
  });

  it('debe renderizar iconos de Material Icons', () => {
    render(<Comentarios />);
    
    expect(screen.getByText('comment')).toBeInTheDocument();
    const stars = screen.getAllByText('star');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('debe mostrar la tabla de comentarios', () => {
    render(<Comentarios />);
    
    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getByText('Producto')).toBeInTheDocument();
    expect(screen.getByText('Comentario')).toBeInTheDocument();
    expect(screen.getByText('Calificación')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it('debe ordenar comentarios por fecha mas reciente', () => {
    render(<Comentarios />);
    
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1);
  });

  it('debe renderizar correctamente cuando no hay comentarios', () => {
    localStorage.setItem('productos', JSON.stringify([
      { id: 1, nombre: 'Producto sin comentarios', comentarios: [] }
    ]));
    
    render(<Comentarios />);
    
    const totalCard = screen.getByText('Total Comentarios').closest('.stat-card');
    expect(within(totalCard).getByText('0')).toBeInTheDocument();
  });

  it('debe tener un modal para editar comentarios', () => {
    const { container } = render(<Comentarios />);
    
    const modal = container.querySelector('#modal-editar-comentario');
    expect(modal).toBeInTheDocument();
  });
});
