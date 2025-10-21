/*"Cuando el usuario oprime el boton +
se agrega 1 producto más al carrito"*/

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { Producto } from './Producto'

// Mocks
vi.mock('../data/productos.jsx', () => ({
  productos: [
    {
      id: 1,
      nombre: 'Manzana',
      categoria: 'frutas',
      precio: 1000,
      stock: 5,
      imagen: 'test.jpg'
    }
  ]
}))

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
  test('debería cambiar la cantidad cuando se modifica el input', () => {
    // ARRANGE (Preparar)
    render(<Producto />)
    
    // ACT (Actuar)
    // 1. Encontrar el input de cantidad (el primero que aparece)
    const cantidadInput = screen.getByLabelText(/cantidad:/i)
    
    // 2. Simular que el usuario escribe "3" en el input
    fireEvent.change(cantidadInput, { target: { value: '3' } })
    
    // ASSERT (Afirmar)
    // Verificar que el input ahora tiene el valor "3"
    expect(cantidadInput.value).toBe('3')
  })
})