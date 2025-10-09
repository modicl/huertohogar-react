import { Footer } from "./Footer";
import { Header } from "./Header";


export function Blog() {
  return (
    <>
      <Header />
      <main className="container">
        <h1 className="center-align" style={{ margin: "30px 0" }}>Blog</h1>

        <div className="row">
          {/* Noticia 1 */}
          <div className="col s12 m6">
            <div className="card hoverable">
              <div className="card-content">
                <span className="card-title" style={{ fontFamily: "'Playfair Display', serif" }}>¿Qué pasa si tomo jugo
                  verde todos los días?</span>
                <p style={{ fontFamily: "'Montserrat', sans-serif", marginTop: "10px" }}>
                  Descubre los beneficios y posibles efectos de incorporar jugos verdes en tu rutina diaria.
                </p>
              </div>
              <div className="card-action">
                <a href="https://www.vogue.mx/articulo/que-pasa-si-tomo-jugo-verde-todos-los-dias"
                  target="_blank" style={{ color: "#2E8B57", fontWeight: "bold" }}>
                  Leer noticia completa
                </a>
              </div>
            </div>
          </div>

          {/* Noticia 2 */}
          <div className="col s12 m6">
            <div className="card hoverable">
              <div className="card-content">
                <span className="card-title" style={{ fontFamily: "'Playfair Display', serif" }}>Proyecto pionero
                  promueve el bienestar de las abejas y miel orgánica en Ñuble</span>
                <p style={{ fontFamily: "'Montserrat', sans-serif", marginTop: "10px" }}>
                  Conoce cómo esta iniciativa busca proteger a las abejas mientras fomenta la producción de
                  miel orgánica en la región.
                </p>
              </div>
              <div className="card-action">
                <a href="https://www.diarioconcepcion.cl/ciencia-y-sociedad/2025/07/13/proyecto-pionero-promueve-el-bienestar-de-las-abejas-y-miel-organica-en-nuble.html"
                  target="_blank" style={{ color: "#2E8B57", fontWeight: "bold" }}>
                  Leer noticia completa
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>

  )
}