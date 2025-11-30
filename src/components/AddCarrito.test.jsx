/*"Cuando el usuario oprime el boton +
se agrega 1 producto más al carrito"*/

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { Producto } from './Producto'
import axios from 'axios'

// Mock de axios
vi.mock('axios')

// Mock de API_URLS
vi.mock('../config/api.js', () => ({
  API_URLS: {
    productos: 'http://test-api/productos',
    categorias: 'http://test-api/categorias'
  }
}))

// Mock de datos de la API
const mockProductosAPI = [
  {
    idProducto: 1,
    nombreProducto: 'Manzana',
    categoria: { idCategoria: 1, nombreCategoria: 'Frutas' },
    precioProducto: 1000,
    stockProducto: 5,
    urlImagen: 'test.jpg'
  }
]

const mockCategoriasAPI = [
  { idCategoria: 1, nombreCategoria: 'Frutas' }
]

vi.mock('./Header', () => ({
  Header: () => <div>Header Mock</div>
}))

vi.mock('./Footer', () => ({
  Footer: () => <div>Footer Mock</div>
}))

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>
}))

describe('Producto', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock de axios.get para retornar productos y categorías
    axios.get.mockImplementation((url) => {
      if (url.includes('categorias')) {
        return Promise.resolve({ data: mockCategoriasAPI })
      }
      return Promise.resolve({ data: mockProductosAPI })
    })
  })

  test('debería renderizar el componente sin errores', async () => {
    // ARRANGE (Preparar)
    render(<Producto />)
    
    // ASSERT (Afirmar)
    // Verificar que se muestra el filtro
    await waitFor(() => {
      expect(screen.getAllByText(/Filtros/i).length).toBeGreaterThan(0)
    })
  })
})