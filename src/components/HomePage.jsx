import '../App.css' // CSS Vacio, en caso de necesitarlo...
import { Carousel } from './Carousel';

// Importar todas las imágenes
import tiendaOnline from '../assets/images/tienda_online2.jpg'
import quinoaImg from '../assets/images/quinoa.jpg'
import lecheImg from '../assets/images/leche.jpg'
import manzanasImg from '../assets/images/manzanas.jpg'
import naranjasImg from '../assets/images/naranjas_producto.png'
import zanahoriasImg from '../assets/images/zanahorias.jpg'
import pimientosImg from '../assets/images/pimientos_productos.png'
import { Footer } from './Footer';
import { Header } from './Header';

export function HomePage() {
    return (
        <>
            <Header />
            <main>
                <Carousel />

                <div className="container section" style={{ marginTop: "50px" }}>
                    <div className="row valign-wrapper">
                        <div className="col s12 m6">
                            <h1>TIENDA ONLINE</h1>
                            <p className="section-subtitle">
                                ¡Accede a nuestro catálogo completo de productos frescos y orgánicos, además puedes comprar
                                desde la comodidad de tu casa!
                            </p>
                            <a className="waves-effect waves-light btn btn-large btn-action" href="producto.html">
                                <i className="material-icons left">local_grocery_store</i>Ir a la tienda
                            </a>
                        </div>
                        <div className="col s12 m6 hide-on-small-only">
                            <div><img src={tiendaOnline} alt="Tienda Online" className="responsive-img" /></div>
                        </div>
                    </div>
                </div>

                {/* Sección ejemplares catálogo */}
                <div className="section" id="productos">
                    <div className="container">
                        <h1 className="section-title center">Nuestros productos</h1>
                        <p className="section-subtitle center">Explora nuestra variedad de productos frescos y orgánicos. A
                            continuación, te mostramos algunos de ellos:</p>
                        <div className="row">
                            <div className="col s12 m4">
                                <div className="card">
                                    <div className="card-image">
                                        <img src={quinoaImg} alt="Producto 1" />
                                        <span className="card-title">Quinoa Orgánica</span>
                                    </div>
                                    <div className="card-content">
                                        <p>$3000 (500g)</p>
                                    </div>
                                    <div className="card-action">
                                        <a href="producto.html">Comprar</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col s12 m4">
                                <div className="card">
                                    <div className="card-image">
                                        <img src={lecheImg} alt="Producto 2" />
                                        <span className="card-title">Leche Entera</span>
                                    </div>
                                    <div className="card-content">
                                        <p>$1200 (1L)</p>
                                    </div>
                                    <div className="card-action">
                                        <a href="producto.html">Comprar</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col s12 m4">
                                <div className="card">
                                    <div className="card-image">
                                        <img src={manzanasImg} alt="Producto 3" />
                                        <span className="card-title"> Manzana Fuji</span>
                                    </div>
                                    <div className="card-content">
                                        <p> $1200 (1 kg)</p>
                                    </div>
                                    <div className="card-action">
                                        <a href="producto.html"> Comprar</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col s12 m4">
                                <div className="card">
                                    <div className="card-image">
                                        <img src={naranjasImg} alt="Producto 4" />
                                        <span className="card-title"> Naranja Valencia</span>
                                    </div>
                                    <div className="card-content">
                                        <p> $1000 (1 kg)</p>
                                    </div>
                                    <div className="card-action">
                                        <a href="producto.html"> Comprar</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col s12 m4">
                                <div className="card">
                                    <div className="card-image">
                                        <img src={zanahoriasImg} alt="Producto 5" />
                                        <span className="card-title"> Zanahorias Orgánicas</span>
                                    </div>
                                    <div className="card-content">
                                        <p> $900 (1 kg)</p>
                                    </div>
                                    <div className="card-action">
                                        <a href="producto.html"> Comprar</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col s12 m4">
                                <div className="card">
                                    <div className="card-image">
                                        <img src={pimientosImg} alt="Producto 6" />
                                        <span className="card-title"> Pimientos Tricolores</span>
                                    </div>
                                    <div className="card-content">
                                        <p> $1500 (1 kg)</p>
                                    </div>
                                    <div className="card-action">
                                        <a href="producto.html"> Comprar</a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Seccion testimonios */}
                <div className="section" id="testimonios">
                    <div className="container">
                        <h1 className="section-title center">Testimonios</h1>
                        <p className="testimonial-card-text">Nuestros clientes están constantemente entregándonos sus
                            opiniones.<br />Revisa algunas de ellas!</p>
                        <div className="row">
                            <div className="col s12 m4">
                                <div className="card testimonial-card">
                                    <div className="card-content">
                                        <p>"Los productos de Huerto Hogar son frescos y de excelente calidad. ¡Mi familia está
                                            encantada!"</p>
                                    </div>
                                    <div className="card-action">
                                        <span>- María G.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col s12 m4">
                                <div className="card testimonial-card">
                                    <div className="card-content">
                                        <p>"El servicio al cliente es inmejorable. Siempre me ayudan a elegir los mejores
                                            productos para mi mesa."</p>
                                    </div>
                                    <div className="card-action">
                                        <span>- Darío Q.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col s12 m4">
                                <div className="card testimonial-card">
                                    <div className="card-content">
                                        <p>"Me encanta la variedad de productos orgánicos que ofrecen. ¡Recomiendo Huerto Hogar
                                            a todos mis amigos!"</p>
                                    </div>
                                    <div className="card-action">
                                        <span>- Carla M.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
            <Footer />
        </>

    )
}
