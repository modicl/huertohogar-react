// Importar imagen desde assets
import jardinImg from '../assets/images/jardin.jpg'
import { Footer } from './Footer'
import { Header } from './Header'


export function Nosotros() {
  return (
    <>
    <Header />
    <main className="container">
        <h1 className="section-title center" style={{margin: "30px 0"}}>¿Quiénes somos?</h1>
        <div className="row" id="product-list"></div>
    </main>

    <div className="section" id="nosotros">
        <div className="container">
            <div className="row valign-wrapper">
               {/* imagen de "nosotros" se agrega className de materialize para hacerla responsiva con sombra sutil y borde redondeado */}
                <div className="col s12 m6">
                    <img src={jardinImg} alt="Imagen Nosotros" className="responsive-img z-depth-2"
                        style={{borderRadius: "12px"}} />
                </div>
                <div className="col s12 m6">
                    <h2 className="center-align">Sobre Nosotros</h2>
                    <p className="section-about-us">
                        <i><b>HuertoHogar</b> es una tienda online dedicada a llevar la frescura y calidad de los
                            productos del campo
                            directamente a la puerta de nuestros clientes en Chile. Con más de 6 años de experiencia,
                            operamos
                            en más de 9 puntos a lo largo del país, incluyendo ciudades clave como Santiago, Puerto
                            Montt,
                            Villarica, Nacimiento, Viña del Mar, Valparaíso, y Concepción. Nuestra misión es conectar a
                            las
                            familias chilenas con el campo, promoviendo un estilo de vida saludable y sostenible.</i>
                    </p>
                </div>
            </div>
            <div className="row same-height">
                <div className="col s12 m6">
                    <h2 className="center-align">Nuestra Misión</h2>
                    <p className="section-about-us">
                        Nuestra misión es proporcionar productos frescos y de calidad directamente desde el campo hasta
                        la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega. Nos
                        comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores
                        locales, apoyando prácticas agrícolas sostenibles y promoviendo una alimentación saludable en
                        todos los hogares chilenos.
                    </p>
                </div>
                <div className="col s12 m6">
                    <h2 className="center-align">Nuestra Visión</h2>
                    <p className="section-about-us">
                        Nuestra visión es ser la tienda online líder en la distribución de productos frescos y naturales
                        en
                        Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la
                        sostenibilidad. Aspiramos a expandir nuestra presencia a nivel nacional e internacional,
                        estableciendo un nuevo estándar en la distribución de productos agrícolas directos del productor
                        al
                        consumidor.
                    </p>
                </div>
            </div>
        </div>
    </div>
    <Footer />
  </>
  );
}