import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export function NotFound() {
  return (
    <main className="not-found-main">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-404">404</h1>
          <h2 className="not-found-message">Página No Encontrada</h2>
          <p className="not-found-description">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/" className="btn waves-effect waves-light not-found-button">
            <i className="material-icons left">home</i>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  )
}