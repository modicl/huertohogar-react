import './Producto.css'

export function Producto() {
  return (
    <main className="container">
      <h1 className="section-title center" style={{margin: "30px 0"}}>Nuestra Tienda</h1>

      {/* Botones de filtrado por categoría */}
      <div className="filter-container center">
        <span className="filter-title">🥑 Filtrar por categoría:</span>
        <div className="filter-buttons">
          <button className="filter-btn active" data-category="all">Todos los productos</button>
          <button className="filter-btn" data-category="frutas">Frutas Frescas</button>
          <button className="filter-btn" data-category="verduras">Verduras Orgánicas</button>
          <button className="filter-btn" data-category="organicos">Productos Orgánicos</button>
          <button className="filter-btn" data-category="lacteos">Productos Lácteos</button>
          <button className="filter-reset" id="reset-filters">Limpiar filtros</button>
        </div>
      </div>

      <div className="row" id="product-list"></div>

      {/* Mensaje cuando no hay productos */}
      <div id="no-products" className="no-products" style={{display: "none"}}>
        <h5>No hay productos en esta categoría</h5>
        <p>Intenta con otra categoría o vuelve a ver todos los productos.</p>
      </div>
    </main>
  )
}