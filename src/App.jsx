
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
import { DetalleProducto } from './components/DetalleProducto';

// Componentes de Admin
import { AdminLogin } from './admin/pages/AdminLogin'
import { Dashboard } from './admin/pages/Dashboard'
import { ProductosPage } from './admin/pages/ProductosPage'
import { PedidosPage } from './admin/pages/PedidosPage'
import { UsuariosPage } from './admin/pages/UsuariosPage'
import { ConfiguracionPage } from './admin/pages/ConfiguracionPage'
import { BlogPage } from './admin/pages/BlogPage'
import { PaginasPage } from './admin/pages/PaginasPage'
import { ComentariosPage } from './admin/pages/ComentariosPage'
import { AdminLayout } from './admin/components/AdminLayout'
import { ProtectedRoute } from './admin/components/ProtectedRoute'

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
      {/* ========== RUTAS PÚBLICAS ========== */}
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/productos" element={<Producto />}></Route>
      <Route path="/nosotros" element={<Nosotros />}></Route>
      <Route path="/contacto" element={<Contacto />}></Route>
      <Route path="/blog" element={<Blog />}></Route>
      <Route path="/registro" element={<Registro />}></Route>
      <Route path="/checkout" element={<Checkout cartHuerto={cartHuerto} setCartHuerto={setCartHuerto} />}></Route>
      <Route path="/boleta" element={<Boleta />} />

      <Route path="/productos" element={<Producto />} />
      <Route path="/producto/:id" element={<DetalleProducto />} />

      {/* ========== RUTAS DE ADMINISTRACIÓN ========== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Rutas protegidas de admin con sidebar compartido */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="paginas" element={<PaginasPage />} />
        <Route path="comentarios" element={<ComentariosPage />} />
      </Route>

      {/* 404 */}
      <Route path="/*" element={<NotFound />}></Route>
    </Routes>

  )
}
