import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoNavbar from '../assets/images/logo_navbar.png';

export function Header() {
    const [cartCount, setCartCount] = useState(0);

    // Función para actualizar el contador del carrito
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cartHuerto') || '[]');
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        setCartCount(totalItems);
    };

    useEffect(() => {
        // Inicializar sidenav cuando el componente se monta
        if (window.M) {
            window.M.Sidenav.init(document.querySelectorAll('.sidenav'));
        }

        // Actualizar contador inicial
        updateCartCount();

        // Escuchar cambios en el localStorage
        const handleStorageChange = () => {
            updateCartCount();
        };

        window.addEventListener('storage', handleStorageChange);

        // Intervalo para detectar cambios (fallback)
        const interval = setInterval(updateCartCount, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
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
                        <Link to="/">
                            <img src={logoNavbar} alt="Logo HuertoHogar" className="navbar-logo" />
                        </Link>
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
                        <Link to="/checkout" title="Carrito de compras" style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                            <i className="fa fa-shopping-cart" style={{ fontSize: "1.2rem", color: "#2E8B57" }}></i>
                            {cartCount > 0 && (
                                <span style={{
                                    position: "absolute",
                                    top: "-8px",
                                    right: "-10px",
                                    background: "#dc3545",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                    border: "2px solid #fff"
                                }}>
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                            <span style={{ marginLeft: "4px" }}>Tu carrito</span>
                        </Link>


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
                <li>
                    <Link to="/checkout" title="Carrito de compras" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <i className="fa fa-shopping-cart" style={{ fontSize: "1.0rem", color: "#2E8B57", marginRight: "8px" }}></i>
                        Tu carrito
                        {cartCount > 0 && (
                            <span style={{
                                marginLeft: "8px",
                                background: "#dc3545",
                                color: "#fff",
                                borderRadius: "50%",
                                width: "22px",
                                height: "22px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                                fontWeight: "bold"
                            }}>
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>
                </li>
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
