
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './components/HomePage'
import { Contacto } from './components/Contacto'
import { Producto } from './components/Producto'
import { Nosotros } from './components/Nosotros'
import { Blog } from './components/Blog'
import { Registro } from './components/Registro'
import { Checkout } from './components/Checkout'
import { useState, useEffect } from 'react'
import { NotFound } from './components/NotFound'
import { Boleta } from './components/Boleta'

export function App() {

  // Inicializando localStorage

  const cartLocal = JSON.parse(localStorage.getItem('cartHuerto') || "[]")
  const [cartHuerto, setCartHuerto] = useState(cartLocal)

  // Cambiamos carrito cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(cartHuerto))
  }, [cartHuerto])


  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/productos" element={<Producto />}></Route>
      <Route path="/nosotros" element={<Nosotros />}></Route>
      <Route path="/contacto" element={<Contacto />}></Route>
      <Route path="/blog" element={<Blog />}></Route>
      <Route path="/registro" element={<Registro />}></Route>
      <Route path="/checkout" element={<Checkout cartHuerto={cartHuerto} setCartHuerto={setCartHuerto} />}></Route>
      <Route path="/boleta" element={<Boleta />} />
      <Route path="/*" element={<NotFound />}></Route>
    </Routes>

  )
}
