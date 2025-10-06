
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './components/HomePage'
import { Contacto } from './components/Contacto'
import { Producto } from './components/Producto'
import { Nosotros } from './components/Nosotros'
import { Blog } from './components/Blog'
import { Registro } from './components/Registro'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/productos" element={<Producto />}></Route>
      <Route path="/nosotros" element={<Nosotros />}></Route>
      <Route path="/contacto" element={<Contacto />}></Route>
      <Route path="/blog" element={<Blog />}></Route>
      <Route path="/registro" element={<Registro />}></Route>
    </Routes>

  )
}
