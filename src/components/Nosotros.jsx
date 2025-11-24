// Importar imagen desde assets
import jardinImg from '../assets/images/jardin.jpg'
import { Footer } from './Footer'
import { Header } from './Header'
import './Nosotros.css' // Importar estilos Bento Grid

export function Nosotros() {
  return (
    <>
      <Header />
      <main className="nosotros-container">
        <div className="bento-grid">
          
          {/* 1. Hero / Hook */}
          <div className="bento-item hero-box">
            <h1>Del Campo a tu Mesa, <br /> <span className="highlight">Sin Intermediarios.</span></h1>
            <p>Conectamos a las familias chilenas con la frescura real de la tierra, promoviendo un estilo de vida saludable y sostenible.</p>
          </div>

          {/* 2. Stats */}
          <div className="bento-item stat-box">
            <h2>+6</h2>
            <p>Años de Experiencia</p>
          </div>
          <div className="bento-item stat-box secondary">
            <h2>+10k</h2>
            <p>Clientes Felices</p>
          </div>

          {/* 3. History (Moved UP) */}
          <div className="bento-item history-box">
            <h3>Nuestra Historia</h3>
            <p>
              Desde 2018, comenzamos con un pequeño huerto en el sur de Chile. Hoy, operamos en 9 ciudades clave como Santiago, Concepción y Valparaíso, llevando lo mejor del campo directamente a tu hogar.
            </p>
          </div>

          {/* 4. Image / Vibe */}
          <div className="bento-item image-box">
            <img src={jardinImg} alt="Huerto Hogar Jardín" />
          </div>

          {/* 5. Values (Moved DOWN) */}
          <div className="bento-item values-box">
            <h3>Nuestros Valores</h3>
            <ul className="values-list">
              <li>
                <i className="material-icons">eco</i>
                <span>Sostenibilidad</span>
              </li>
              <li>
                <i className="material-icons">local_shipping</i>
                <span>Rapidez</span>
              </li>
              <li>
                <i className="material-icons">favorite</i>
                <span>Calidad</span>
              </li>
            </ul>
          </div>

          {/* 6. Team */}
          <div className="bento-item team-box">
            <h3>El Equipo</h3>
            <div className="team-avatars">
              <div className="team-member">
                <div className="avatar-circle" style={{background: '#FF7043'}}>FV</div>
                <p>Felipe Villarroel</p>
                <span>Developer</span>
              </div>
              <div className="team-member">
                <div className="avatar-circle" style={{background: '#42A5F5'}}>LR</div>
                <p>Luciano Riveros</p>
                <span>Developer</span>
              </div>
              <div className="team-member">
                <div className="avatar-circle" style={{background: '#66BB6A'}}>CF</div>
                <p>Cristobal Faundez</p>
                <span>Developer</span>
              </div>
              <div className="team-member">
                <div className="avatar-circle" style={{background: '#AB47BC'}}>JR</div>
                <p>Joaquin Reyes</p>
                <span>Developer</span>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}