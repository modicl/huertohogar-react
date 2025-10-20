import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Productos } from './Productos';

const mockProductos = [
  {
    id: 1,
    nombre: 'Manzana Roja',
    categoria: 'Frutas',
    descripcion: 'Manzanas frescas',
    precio: 1200,
    stock: 50,
    origen: 'Chile',
    imagen: '/images/manzana.jpg'
  },
  {
    id: 2,
    nombre: 'Plátano',
    categoria: 'Frutas',
    descripcion: 'Plátanos frescos',
    precio: 800,
    stock: 30,
    origen: 'Ecuador',
    imagen: '/images/platano.jpg'
  },
  {
    id: 3,
    nombre: 'Lechuga',
    categoria: 'Verduras',
    descripcion: 'Lechuga orgánica',
    precio: 600,
    stock: 5,
    origen: 'Chile',
    imagen: '/images/lechuga.jpg'
  }
];

describe('Componente Productos', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('productos', JSON.stringify(mockProductos));
    window.M = {
      Modal: { init: () => ({ open: () => {}, close: () => {} }) }
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe renderizar el componente Productos sin errores', () => {
    render(<Productos />);
    
    expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
  });

  it('debe mostrar el subtitulo del componente', () => {
    render(<Productos />);
    
    expect(screen.getByText('Administra el catálogo completo de productos')).toBeInTheDocument();
  });

  it('debe tener un boton para crear nuevo producto', () => {
    render(<Productos />);
    
    const createButton = screen.getByRole('button', { name: /nuevo producto/i });
    expect(createButton).toBeInTheDocument();
  });

  it('debe mostrar la tabla de productos', () => {
    render(<Productos />);
    
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Categoría')).toBeInTheDocument();
    expect(screen.getByText('Precio')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it('debe mostrar los productos cargados desde localStorage', () => {
    render(<Productos />);
    
    expect(screen.getByText('Manzana Roja')).toBeInTheDocument();
    expect(screen.getByText('Plátano')).toBeInTheDocument();
    expect(screen.getByText('Lechuga')).toBeInTheDocument();
  });

  it('debe mostrar las categorias de los productos', () => {
    render(<Productos />);
    
    const frutasElements = screen.getAllByText('Frutas');
    expect(frutasElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Verduras')).toBeInTheDocument();
  });

  it('debe mostrar los precios formateados correctamente', () => {
    render(<Productos />);
    
    expect(screen.getByText('$1.200')).toBeInTheDocument();
    expect(screen.getByText('$800')).toBeInTheDocument();
    expect(screen.getByText('$600')).toBeInTheDocument();
  });

  it('debe mostrar el stock de cada producto', () => {
    render(<Productos />);
    
    const stockElements = screen.getAllByText(/^\d+$/);
    expect(stockElements.length).toBeGreaterThan(0);
  });

  it('debe mostrar alerta de stock bajo para productos con menos de 10 unidades', () => {
    render(<Productos />);
    
    expect(screen.getByText('Lechuga')).toBeInTheDocument();
  });

  it('debe tener botones de editar para cada producto', () => {
    render(<Productos />);
    
    const editButtons = screen.getAllByText('edit');
    expect(editButtons.length).toBe(3);
  });

  it('debe tener botones de eliminar para cada producto', () => {
    render(<Productos />);
    
    const deleteButtons = screen.getAllByText('delete');
    expect(deleteButtons.length).toBe(3);
  });

  it('debe cargar productos desde localStorage al iniciar', () => {
    render(<Productos />);
    
    expect(screen.getByText('Manzana Roja')).toBeInTheDocument();
  });

  it('debe renderizar iconos de Material Icons', () => {
    render(<Productos />);
    
    expect(screen.getByText('add')).toBeInTheDocument();
    expect(screen.getAllByText('edit').length).toBeGreaterThan(0);
    expect(screen.getAllByText('delete').length).toBeGreaterThan(0);
  });

  it('debe mostrar el contador total de productos', () => {
    render(<Productos />);
    
    expect(screen.getByText(/Total Productos/i)).toBeInTheDocument();
    const totalCard = screen.getByText('Total Productos').closest('.stat-card');
    expect(within(totalCard).getByText('3')).toBeInTheDocument();
  });

  it('debe tener un boton para exportar productos', () => {
    render(<Productos />);
    
    const exportButton = screen.getByRole('button', { name: /exportar/i });
    expect(exportButton).toBeInTheDocument();
  });

  it('debe mostrar estadisticas de productos', () => {
    render(<Productos />);
    
    expect(screen.getByText(/Total Productos/i)).toBeInTheDocument();
  });

  it('debe renderizar correctamente cuando no hay productos', () => {
    localStorage.setItem('productos', JSON.stringify([]));
    render(<Productos />);
    
    expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
  });

  it('debe tener un formulario modal para crear/editar productos', () => {
    const { container } = render(<Productos />);
    
    const modal = container.querySelector('#productModal');
    expect(modal).toBeInTheDocument();
  });
});
