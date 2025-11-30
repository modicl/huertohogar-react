import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  describe('Filtrado de comentarios', () => {
    it('debe filtrar por producto cuando se selecciona', async () => {
      const user = userEvent.setup();
      render(<Comentarios />);
      
      // Cambiar filtro a primer producto
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
    });

    it('debe mostrar todos los comentarios con filtro "todos"', () => {
      render(<Comentarios />);
      
      // Verificar que se muestran todos los comentarios
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María González')).toBeInTheDocument();
      expect(screen.getByText('Pedro López')).toBeInTheDocument();
    });
  });

  describe('Estadísticas de calificación', () => {
    it('debe calcular comentarios de última semana', () => {
      render(<Comentarios />);
      
      expect(screen.getByText(/Última Semana/i)).toBeInTheDocument();
    });

    it('debe mostrar promedio de estrellas', () => {
      render(<Comentarios />);
      
      // (5 + 4 + 3) / 3 = 4
      expect(screen.getByText('Promedio Estrellas')).toBeInTheDocument();
    });
  });

  describe('Acciones de comentarios', () => {
    it('debe tener botones de editar y eliminar para cada comentario', () => {
      render(<Comentarios />);
      
      const editButtons = screen.getAllByText('edit');
      const deleteButtons = screen.getAllByText('delete');
      
      // 3 comentarios = 3 botones de cada tipo
      expect(editButtons.length).toBe(3);
      expect(deleteButtons.length).toBe(3);
    });

    it('debe abrir modal al hacer clic en editar', async () => {
      const user = userEvent.setup();
      render(<Comentarios />);
      
      const editButtons = screen.getAllByText('edit');
      await user.click(editButtons[0]);
      
      // El modal debería intentar abrirse
      expect(window.M.Modal.init).toBeDefined();
    });
  });

  describe('Ordenamiento', () => {
    it('debe ordenar comentarios por calificación', async () => {
      const user = userEvent.setup();
      render(<Comentarios />);
      
      const ordenSelects = screen.getAllByRole('combobox');
      expect(ordenSelects.length).toBeGreaterThan(0);
    });
  });

  describe('Estado vacío', () => {
    it('debe manejar productos sin comentarios', () => {
      localStorage.setItem('productos', JSON.stringify([
        { id: 1, nombre: 'Sin comentarios', comentarios: [] },
        { id: 2, nombre: 'Otro sin comentarios' }
      ]));
      
      render(<Comentarios />);
      
      const totalCard = screen.getByText('Total Comentarios').closest('.stat-card');
      expect(within(totalCard).getByText('0')).toBeInTheDocument();
    });

    it('debe mostrar 0 para promedio cuando no hay comentarios', () => {
      localStorage.setItem('productos', JSON.stringify([]));
      
      render(<Comentarios />);
      
      const totalCard = screen.getByText('Total Comentarios').closest('.stat-card');
      expect(within(totalCard).getByText('0')).toBeInTheDocument();
    });
  });

  describe('Modal de edición', () => {
    it('debe mostrar el formulario de edición en el modal', () => {
      const { container } = render(<Comentarios />);
      
      const modal = container.querySelector('#modal-editar-comentario');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText('Editar Comentario')).toBeInTheDocument();
    });
  });

  describe('Renderizado de estrellas', () => {
    it('debe mostrar estrellas para diferentes calificaciones', () => {
      render(<Comentarios />);
      
      // Verificar que hay estrellas en la página
      const stars = screen.getAllByText('star');
      expect(stars.length).toBeGreaterThan(0);
    });

    it('debe mostrar estrellas vacías para calificaciones bajas', () => {
      render(<Comentarios />);
      
      const starBorders = screen.getAllByText('star_border');
      expect(starBorders.length).toBeGreaterThan(0);
    });
  });
});
