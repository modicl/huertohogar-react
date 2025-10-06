import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoNavbar from '../assets/images/logo_navbar.png';

export function Header() {
    useEffect(() => {
        // Inicializar sidenav cuando el componente se monta
        if (window.M) {
            window.M.Sidenav.init(document.querySelectorAll('.sidenav'));
        }
    }, []);

    return (
        <header>
            {/* Navbar , se pueden agregar/editar links, seguir logica */}
            <nav className="navbar-custom">
                <div className="nav-wrapper">
                    <a href="#" data-target="mobile-menu" className="sidenav-trigger">
                        <i className="material-icons" style={{ color: "#2E8B57" }}>menu</i>
                    </a>
                    <div className="navbar-logo-container">
                        <img src={logoNavbar} alt="Logo HuertoHogar" className="navbar-logo" />
                    </div>
                    <div className="navbar-center hide-on-med-and-down">
                        <Link to="/">Inicio</Link>
                        <Link to="/productos">Productos</Link>
                        <Link to="/nosotros">Nosotros</Link>
                        <Link to="/contacto">Contacto</Link>
                        <Link to="/blog">Blog</Link>
                        {/* Searchbar Bootstrap */}
                        <form className="d-flex navbar-bootstrap-search" role="search"
                            style={{ display: "inline-flex", alignItems: "center", marginLeft: "24px", maxWidth: "260px" }}>
                            <input className="form-control" type="search" placeholder="Buscar..." aria-label="Buscar"
                                style={{ borderRadius: "20px", border: "2px solid #2E8B57", background: "#fff", color: "#333", fontFamily: "'Montserrat', sans-serif", height: "36px", fontSize: "1rem", paddingLeft: "36px" }} />
                            <button className="btn" type="submit"
                                style={{ background: "#2E8B57", color: "#fff", borderRadius: "20px", marginLeft: "-52px", marginBottom: "8px", minWidth: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="material-icons" style={{ verticalAlign: "middle" }}>search</i>
                            </button>
                        </form>
                        <Link to="/registro" title="Iniciar sesión / Registrarse">
                            <i className="fa fa-user" style={{ fontSize: "1.2rem", color: "#2E8B57" }}></i>
                        </Link>
                        <a href="carrito.html" title="Carrito de compras">
                            <i className="fa fa-shopping-cart" style={{ fontSize: "1.2rem", color: "#2E8B57" }}></i>
                            Tu carrito
                        </a>


                    </div>
                </div>
            </nav>
            {/* Menú móvil */}
            <ul className="sidenav" id="mobile-menu">
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/productos">Productos</Link></li>
                <li><Link to="/nosotros">Nosotros</Link></li>
                <li><Link to="/contacto">Contacto</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/registro"> Registro/Iniciar Sesión<i className="fa fa-user"
                    style={{ fontSize: "1.0rem", color: "#2E8B57", marginRight: "-9px" }}></i></Link></li>
                <li> <a href="carrito.html" title="Carrito de compras">
                    <i className="fa fa-shopping-cart" style={{ fontSize: "1.0rem", color: "#2E8B57", marginRight: "-7px" }}></i>
                    Tu carrito
                </a></li>
                <li>
                    <form className="d-flex navbar-bootstrap-search" role="search"
                        style={{ display: "inline-flex", alignItems: "center", marginLeft: "24px", maxWidth: "260px" }}>
                        <input className="form-control" type="search" placeholder="Buscar..." aria-label="Buscar"
                            style={{ borderRadius: "20px", border: "2px solid #2E8B57", background: "#fff", color: "#333", fontFamily: "'Montserrat', sans-serif", height: "36px", fontSize: "1rem", paddingLeft: "36px" }} />
                        <button className="btn" type="submit"
                            style={{ background: "#2E8B57", color: "#fff", borderRadius: "20px", marginLeft: "-52px", marginBottom: "8px", minWidth: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="material-icons" style={{ verticalAlign: "middle" }}>search</i>
                        </button>
                    </form>
                </li>
            </ul>
        </header>
    )
}
