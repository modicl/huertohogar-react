import '../App.css' // CSS Vacio, en caso de necesitarlo...
import { Carousel } from './Carousel';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../config/api.js';

// Importar todas las imágenes
import tiendaOnline from '../assets/images/tienda_online2.jpg'
import { Footer } from './Footer';
import { Header } from './Header';

export function HomePage() {
    const [productos, setProductos] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(API_URLS.productos);
                if (response.data) {
                    const normalized = response.data.map(p => ({
                        id: p.idProducto,
                        nombre: p.nombreProducto,
                        precio: p.precioProducto,
                        imagen: p.imagenUrl,
                        categoria: { nombre: p.categoria?.nombreCategoria },
                        stock: p.stockProducto
                    })).slice(0, 4);
                    setProductos(normalized);
                }
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProductos();
    }, []);

    useEffect(() => {
        // Initialize Carousel
        const elem = document.getElementById('testimonial-carousel');
        if (window.M && elem) {
            window.M.Carousel.init(elem, {
                fullWidth: true,
                indicators: true,
                duration: 200
            });
        }
    }, []);

    const handleQuantityChange = (productId, value) => {
        const newValue = parseInt(value) || 1;
        setQuantities(prev => ({
            ...prev,
            [productId]: newValue
        }));
    };

    const addToCart = (producto) => {
        const quantity = quantities[producto.id] || 1;
        const currentCart = JSON.parse(localStorage.getItem('cartHuerto') || '[]');
        const existingProductIndex = currentCart.findIndex(item => item.id === producto.id);

        if (existingProductIndex >= 0) {
            currentCart[existingProductIndex].quantity += quantity;
        } else {
            currentCart.push({ ...producto, quantity });
        }

        localStorage.setItem('cartHuerto', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('cartUpdated'));

        if (window.M) {
            window.M.toast({ html: `Agregado: ${producto.nombre}`, classes: 'green' });
        } else {
            alert(`Agregado: ${producto.nombre}`);
        }

        setQuantities(prev => ({ ...prev, [producto.id]: 1 }));
    };

    const testimonials = [
        {
            text: "Los productos de Huerto Hogar son frescos y de excelente calidad. ¡Mi familia está encantada!",
            author: "María G."
        },
        {
            text: "El servicio al cliente es inmejorable. Siempre me ayudan a elegir los mejores productos para mi mesa.",
            author: "Darío Q."
        },
        {
            text: "Me encanta la variedad de productos orgánicos que ofrecen. ¡Recomiendo Huerto Hogar a todos mis amigos!",
            author: "Carla M."
        },
        {
            text: "La entrega fue rapidísima y todo llegó en perfecto estado. ¡Volveré a comprar sin duda!",
            author: "Juan P."
        },
        {
            text: "Calidad insuperable, se nota el cariño en cada producto. 100% recomendados para una vida sana.",
            author: "Ana R."
        },
        {
            text: "Excelente relación precio-calidad. Los mejores productos orgánicos de la zona, frescos y ricos.",
            author: "Roberto S."
        }
    ];

    const handlePrev = (e) => {
        e.preventDefault();
        const elem = document.getElementById('testimonial-carousel');
        if (window.M) {
            const instance = window.M.Carousel.getInstance(elem);
            if (instance) instance.prev();
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        const elem = document.getElementById('testimonial-carousel');
        if (window.M) {
            const instance = window.M.Carousel.getInstance(elem);
            if (instance) instance.next();
        }
    };

    return (
        <>
            <Header />
            <main>
                <Carousel />

                <div className="container section" style={{ marginTop: "50px" }}>
                    <div className="row valign-wrapper">
                        <div className="col s12 m6">
                            <h1>¡BIENVENIDO!</h1>
                            <p className="section-subtitle">
                               Productos frescos y orgánicos. Compra desde la comodidad de tu casa!
                            </p>
                            <Link className="waves-effect waves-light btn btn-large btn-action" to="/productos">
                                <i className="material-icons left">local_grocery_store</i>Ir a la tienda
                            </Link>
                        </div>
                        <div className="col s12 m6 hide-on-small-only">
                            <div><img src={tiendaOnline} alt="Tienda Online" className="responsive-img" /></div>
                        </div>
                    </div>
                </div>

                {/* Sección ejemplares catálogo */}
                <div className="section" id="productos">
                    <div className="container">
                        <h1 className="section-title center">Algunos de Nuestros Productos</h1>
                        <div className="row">
                            {productos.length > 0 ? (
                                <div
                                    className="productos-grid"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "24px"
                                    }}
                                >
                                    {productos.map((producto, index) => (
                                        <div
                                            className="product-card"
                                            key={producto.id || `producto-${index}`}
                                            style={{
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "10px",
                                                padding: "20px",
                                                minHeight: "380px",
                                                background: "#fff",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                textAlign: "center",
                                                transition: "transform 0.3s, box-shadow 0.3s"
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = "translateY(-5px)";
                                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                                            }}
                                        >
                                            {/* Imagen del producto */}
                                            <div
                                                style={{
                                                    position: "relative",
                                                    width: "120px",
                                                    height: "120px",
                                                    marginBottom: "16px",
                                                    borderRadius: "8px",
                                                    overflow: "hidden",
                                                    group: "image"
                                                }}
                                            >
                                                <img
                                                    src={producto.imagen || '/placeholder.jpg'}
                                                    alt={producto.nombre}
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder.jpg';
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: "8px"
                                                    }}
                                                />
                                                {/* Overlay con botón Ver Detalle */}
                                                <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none' }}>
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: 0,
                                                            left: 0,
                                                            width: "100%",
                                                            height: "100%",
                                                            background: "rgba(46, 139, 87, 0.9)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            opacity: 0,
                                                            transition: "opacity 0.3s ease",
                                                            borderRadius: "8px",
                                                            cursor: "pointer"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.opacity = "1";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.opacity = "0";
                                                        }}
                                                        className="image-overlay"
                                                    >
                                                        <div style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "6px",
                                                            color: "#fff",
                                                            fontWeight: "500",
                                                            fontSize: "0.9em"
                                                        }}>
                                                            <i className="material-icons" style={{ fontSize: "20px" }}>visibility</i>
                                                            Ver Detalle
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Nombre del producto */}
                                            <h3 style={{
                                                marginBottom: "12px",
                                                fontSize: "1.4em",
                                                color: "#2E8B57",
                                                fontWeight: "600",
                                                fontFamily: "'Montserrat', sans-serif"
                                            }}>
                                                {producto.nombre}
                                            </h3>

                                            {/* Categoría */}
                                            <p style={{ margin: "4px 0", fontSize: "0.9em", color: "#666" }}>
                                                <strong>Categoría:</strong> {producto.categoria?.nombre || 'Sin categoría'}
                                            </p>

                                            {/* Precio */}
                                            <p style={{ margin: "4px 0", fontSize: "1.1em", color: "#8B4513", fontWeight: "bold" }}>
                                                ${(producto.precio || 0).toLocaleString('es-CL')}
                                            </p>

                                            {/* Selector de cantidad */}
                                            <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <label htmlFor={`quantity-${producto.id}`} style={{ fontSize: "0.85em", fontWeight: "500", color: "#555" }}>
                                                    Cantidad:
                                                </label>
                                                <input
                                                    id={`quantity-${producto.id}`}
                                                    type="number"
                                                    min="1"
                                                    max={producto.stock || 99}
                                                    value={quantities[producto.id] || 0}
                                                    onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                                                    style={{
                                                        width: "35px",
                                                        height: "20px",
                                                        padding: "4px 6px",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                        textAlign: "center",
                                                        fontSize: "0.9em"
                                                    }}
                                                    placeholder="1"
                                                />
                                            </div>

                                            {/* Botón Agregar al Carrito */}
                                            <button
                                                className="btn waves-effect waves-light"
                                                onClick={() => addToCart(producto)}
                                                style={{
                                                    backgroundColor: "#2E8B57",
                                                    width: "100%",
                                                    borderRadius: "25px",
                                                    fontWeight: "600",
                                                    textTransform: "none",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "8px"
                                                }}
                                            >
                                                <i className="material-icons" style={{ fontSize: "20px" }}>shopping_cart</i>
                                                Agregar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="center-align">
                                    <div className="preloader-wrapper active">
                                        <div className="spinner-layer spinner-green-only">
                                            <div className="circle-clipper left">
                                                <div className="circle"></div>
                                            </div><div className="gap-patch">
                                                <div className="circle"></div>
                                            </div><div className="circle-clipper right">
                                                <div className="circle"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Seccion testimonios */}
                <div className="section" id="testimonios" style={{ padding: '40px 0' }}>
                    <div className="container">
                        <h1 className="section-title center">Lo que dicen de nosotros</h1>
                        
                        <div style={{ position: 'relative', padding: '0 40px' }}>
                            <button onClick={handlePrev} className="btn-flat waves-effect" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, padding: 0 }}>
                                <i className="material-icons" style={{ fontSize: '3rem', color: '#2E8B57' }}>chevron_left</i>
                            </button>

                            <div id="testimonial-carousel" className="carousel carousel-slider center" style={{ height: '150px' }}>
                                {testimonials.map((testimonial, index) => (
                                    <div className="carousel-item" key={index} href={`#${index}!`} style={{ backgroundColor: 'transparent' }}>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col s12 m10 offset-m1">
                                                    <div className="card-panel" style={{ backgroundColor: '#fff', marginTop: '0px', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                                        <div style={{ color: '#FFD700', marginBottom: '2px' }}>
                                                            <i className="material-icons">star</i>
                                                            <i className="material-icons">star</i>
                                                            <i className="material-icons">star</i>
                                                            <i className="material-icons">star</i>
                                                            <i className="material-icons">star</i>
                                                        </div>
                                                        <h5 style={{ fontStyle: 'italic', lineHeight: '1.2', marginBottom: '5px', fontSize: '1rem' }}>"{testimonial.text}"</h5>
                                                        <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#2E8B57', margin: 0 }}>- {testimonial.author}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={handleNext} className="btn-flat waves-effect" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, padding: 0 }}>
                                <i className="material-icons" style={{ fontSize: '3rem', color: '#2E8B57' }}>chevron_right</i>
                            </button>
                        </div>
                    </div>
                </div>
            </main >
            <Footer />
        </>

    )
}
