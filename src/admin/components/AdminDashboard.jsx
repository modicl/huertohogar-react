import React from 'react'
import './AdminDashboard.css'

export function AdminDashboard() {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h4 className="dashboard-title">Panel de Control</h4>
        <p className="dashboard-subtitle">Resumen general del sistema</p>
      </div>

      {/* Estadísticas principales */}
      <div className="row">
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon">
              <i className="material-icons">attach_money</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Ventas del Día</p>
              <h5 className="stat-value">$10.000</h5>
            </div>
          </div>
        </div>
        
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">
              <i className="material-icons">shopping_cart</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Nuevos Pedidos</p>
              <h5 className="stat-value">4</h5>
            </div>
          </div>
        </div>
        
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-green">
            <div className="stat-icon">
              <i className="material-icons">poll</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Ventas Totales</p>
              <h5 className="stat-value">35</h5>
            </div>
          </div>
        </div>
        
        <div className="col s12 m6 l3">
          <div className="stat-card stat-card-orange">
            <div className="stat-icon">
              <i className="material-icons">warning</i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Stock Bajo</p>
              <h5 className="stat-value">7</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de pedidos recientes */}
      <div className="row">
        <div className="col s12">
          <div className="card admin-card">
            <div className="card-content">
              <div className="card-header">
                <span className="card-title-admin">Pedidos Recientes</span>
                <a href="#!" className="btn-flat waves-effect">Ver todos</a>
              </div>
              
              <table className="responsive-table striped admin-table">
                <thead>
                  <tr>
                    <th>ID Pedido</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium">#FR001</td>
                    <td>Juan Pérez</td>
                    <td className="font-medium">$250</td>
                    <td><span className="badge-status badge-success">Completado</span></td>
                    <td>
                      <a href="#!" className="btn-small btn-flat waves-effect">
                        <i className="material-icons">visibility</i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium">#FR002</td>
                    <td>María López</td>
                    <td className="font-medium">$150</td>
                    <td><span className="badge-status badge-warning">Pendiente</span></td>
                    <td>
                      <a href="#!" className="btn-small btn-flat waves-effect">
                        <i className="material-icons">visibility</i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium">#FR003</td>
                    <td>Carlos Gómez</td>
                    <td className="font-medium">$320</td>
                    <td><span className="badge-status badge-success">Completado</span></td>
                    <td>
                      <a href="#!" className="btn-small btn-flat waves-effect">
                        <i className="material-icons">visibility</i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium">#FR004</td>
                    <td>Ana Torres</td>
                    <td className="font-medium">$90</td>
                    <td><span className="badge-status badge-danger">Cancelado</span></td>
                    <td>
                      <a href="#!" className="btn-small btn-flat waves-effect">
                        <i className="material-icons">visibility</i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
