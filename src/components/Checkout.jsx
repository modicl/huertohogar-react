import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../config/api.js';
import './Checkout.css';
import { Header } from './Header.jsx';
import { useAuth } from '../context/AuthContext';
import logoNavbar from '../assets/images/logo_navbar.png';

function HeaderSoloLogo() {
    return (
        <header style={{ background: '#f7f7f7', borderBottom: '2px solid #2E8B57', padding: '16px 0', textAlign: 'center' }}>
            <Link to="/">
                <img src={logoNavbar} alt="Logo HuertoHogar" style={{ height: '60px', maxWidth: '180px', background: '#f7f7f7' }} />
            </Link>
        </header>
    );
}

export function Checkout({ cartHuerto, setCartHuerto }) {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const selectRef = useRef(null);

    // Función para calcular subtotal
    useEffect(() => {
        const loadCart = () => {
            // Verificar que el usuario esté autenticado
            if (!token) {
                navigate('/registro');
                return;
            }

            const storedCart = JSON.parse(localStorage.getItem('cartHuerto') || '[]');
            if (storedCart && storedCart.length > 0) {
                setCartHuerto(storedCart);
            }
        };

        loadCart();
    }, [setCartHuerto, token, navigate]);

    // Inicializar la información de envío con los datos del usuario autenticado
    useEffect(() => {
        // Los datos se usan directamente del user autenticado
    }, [user]);

    // Función para calcular subtotal
    const calculateSubtotal = () => {
        if (!cartHuerto || cartHuerto.length === 0) return 0;
        return cartHuerto.reduce((total, item) => {
            const precio = item.precioProducto || item.precio || 0;
            return total + (precio * item.quantity);
        }, 0);
    };

    // Función para calcular envío
    const calculateShipping = () => {
        return cartHuerto && cartHuerto.length > 0 ? 3000 : 0; // Solo cobrar envío si hay productos
    };

    // Función para calcular total
    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    // Inicializar select de Materialize
    useEffect(() => {
        if (window.M && selectRef.current) {
            const instances = window.M.FormSelect.init(selectRef.current, {
                classes: 'validate'
            });

            // Cleanup al desmontar
            return () => {
                if (instances && instances.destroy) {
                    instances.destroy();
                }
            };
        }
    }, []);

    // Función para procesar la compra
    const handlePurchase = async (e) => {
        e.preventDefault();

        if (!cartHuerto || cartHuerto.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }

        // Verificar que el usuario esté autenticado con token
        if (!token) {
            alert('Debes estar registrado para finalizar la compra');
            navigate('/registro');
            return;
        }

        try {
            // Construir el body para la API según el formato requerido
            const orderBody = {
                idUsuario: user.idUsuario,
                fechaOrden: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
                estado: "pendiente",
                totalOrden: calculateTotal(),
                direccionEnvio: user.direccion || "Dirección no registrada",
                detalleOrden: cartHuerto.map(item => ({
                    idProducto: item.id || item.idProducto,
                    cantidad: item.quantity,
                    precioUnitario: item.precio || item.precioProducto
                }))
            };

            console.log('Enviando orden al backend:', orderBody);

            // Realizar la petición POST con el token Bearer
            const response = await axios.post(API_URLS.ordenes, orderBody, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                console.log('Orden creada exitosamente en BD:', response.data);

                // Datos de envío para la boleta
                const orderShippingInfo = {
                    fullName: `${user.nombre || ''} ${user.aPaterno || ''}`.trim(),
                    email: user.email || '',
                    phone: user.telefono || '',
                    address: user.direccion || '',
                    city: '',
                    region: user.idRegion || '',
                    zipCode: ''
                };

                // Navegar a la boleta con los datos de la compra
                navigate('/boleta', {
                    state: {
                        cartItems: cartHuerto,
                        shippingInfo: orderShippingInfo,
                        orderId: response.data.idOrden || Date.now() // Usar ID del backend si viene
                    }
                });

                // Limpiar el carrito después de navegar a la boleta
                setCartHuerto([]);
                localStorage.removeItem('cartHuerto');
            }
        } catch (error) {
            console.error('Error al crear la orden:', error);
            alert('Hubo un error al procesar tu compra. Por favor intenta nuevamente.');
        }
    };

    // Función para actualizar cantidad de un producto
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const updatedCart = cartHuerto.map(item => {
            const itemId = item.idProducto || item.id;
            return itemId === productId
                ? { ...item, quantity: newQuantity }
                : item;
        });

        setCartHuerto(updatedCart);
        localStorage.setItem('cartHuerto', JSON.stringify(updatedCart));
    };

    // Función para remover producto del carrito
    const removeFromCart = (productId) => {
        const updatedCart = cartHuerto.filter(item => {
            const itemId = item.idProducto || item.id;
            return itemId !== productId;
        });
        setCartHuerto(updatedCart);
        localStorage.setItem('cartHuerto', JSON.stringify(updatedCart));
    };

    // Si no hay productos en el carrito, mostrar mensaje
    if (!cartHuerto || cartHuerto.length === 0) {
        return (
            <>
                <HeaderSoloLogo />
                <main>
                    <div data-testid="carro-sinitems" className="container checkout-container">
                        <div className="row">
                            <div className="col s12">
                                <div className="card-panel" style={{ textAlign: 'center', padding: '50px' }}>
                                    <button
                                        className="btn-flat waves-effect"
                                        style={{ color: '#2E8B57', marginBottom: '10px', fontWeight: 'bold', fontSize: '1rem' }}
                                        onClick={() => navigate(-1)}
                                    >
                                        <i className="material-icons left">arrow_back</i>
                                        Volver atrás
                                    </button>
                                    <h4 style={{ color: '#8B4513', marginBottom: '20px' }}>
                                        Tu carrito está vacío
                                    </h4>
                                    <p style={{ color: '#666', fontSize: '18px', marginBottom: '30px' }}>
                                        Agrega algunos productos para continuar con tu compra
                                    </p>
                                    <a href="/productos" className="btn" style={{ backgroundColor: '#2E8B57', marginRight: '10px' }}>
                                        Ver Productos
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <HeaderSoloLogo />
            <main>
                <div data-testid="carro-sinitems" className="container checkout-container">
                    {/* Título */}
                    <div className="row">
                        <div className="col s12">
                            <h3 className="center checkout-title">
                                Finalizar Compra
                            </h3>
                        </div>
                    </div>

                    <div className="row">
                        {/* Columna izquierda - Items del carrito */}
                        <div className="col s12 l7">
                            <div className="card-panel checkout-panel">
                                <button
                                    className="btn-flat waves-effect"
                                    style={{ color: '#2E8B57', marginBottom: '10px', fontWeight: 'bold', fontSize: '1rem' }}
                                    onClick={() => navigate(-1)}
                                >
                                    <i className="material-icons left">arrow_back</i>
                                    Volver atrás
                                </button>
                                <h5 className="checkout-section-title">
                                    Productos en tu carrito ({cartHuerto.length})
                                </h5>

                                {cartHuerto.map((item) => {
                                    const precio = item.precioProducto || item.precio || 0;
                                    const nombre = item.nombreProducto || item.nombre || 'Producto';
                                    const imagen = item.imagenUrl || item.imagen || '';
                                    const itemId = item.idProducto || item.id;
                                    const categoria = typeof item.categoria === 'object' && item.categoria !== null
                                        ? item.categoria.nombreCategoria || 'Sin categoría'
                                        : item.categoria || 'Sin categoría';
                                    
                                    return (
                                    <div key={itemId} className="row cart-item">
                                        <div className="col s3">
                                            <img
                                                src={imagen}
                                                alt={nombre}
                                                className="cart-item-image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="cart-item-placeholder">
                                                🥬 Producto
                                            </div>
                                        </div>
                                        <div className="col s6">
                                            <h6 className="cart-item-name">
                                                {nombre}
                                            </h6>
                                            <p className="cart-item-category">
                                                Categoría: {categoria}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                                <button
                                                    className="btn-small"
                                                    style={{ backgroundColor: '#ff6b6b', marginRight: '10px' }}
                                                    onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                                >
                                                    -
                                                </button>
                                                <span style={{ margin: '0 15px', fontWeight: 'bold' }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="btn-small"
                                                    style={{ backgroundColor: '#2E8B57', marginRight: '10px' }}
                                                    onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                                <button
                                                    className="btn-small red"
                                                    onClick={() => removeFromCart(itemId)}
                                                    title="Eliminar producto"
                                                >
                                                    <i className="material-icons">delete</i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col s3 right-align">
                                            <p className="cart-item-price">
                                                ${(precio * item.quantity).toLocaleString()}
                                            </p>
                                            <p className="cart-item-unit-price">
                                                ${precio.toLocaleString()} c/u
                                            </p>
                                        </div>
                                    </div>
                                    );
                                })}

                                {/* Información de envío - Desde perfil del usuario */}
                                <div className="shipping-form">
                                    <h5 className="checkout-subsection-title">
                                        Información de Envío
                                    </h5>

                                    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                        <p style={{ margin: '8px 0', color: '#555' }}>
                                            <strong>Nombre:</strong> {user?.nombre} {user?.aPaterno}
                                        </p>
                                        <p style={{ margin: '8px 0', color: '#555' }}>
                                            <strong>Email:</strong> {user?.email}
                                        </p>
                                        <p style={{ margin: '8px 0', color: '#555' }}>
                                            <strong>Teléfono:</strong> {user?.telefono || 'No registrado'}
                                        </p>
                                        <p style={{ margin: '8px 0', color: '#555' }}>
                                            <strong>Dirección:</strong> {user?.direccion || 'No registrada'}
                                        </p>
                                        <p style={{ margin: '8px 0', color: '#555' }}>
                                            <strong>Región:</strong> {user?.idRegion ? `Región ${user.idRegion}` : 'No registrada'}
                                        </p>
                                        <p style={{ margin: '12px 0 0 0', fontSize: '0.85em', color: '#999' }}>
                                            <i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle' }}>info</i>
                                            Los datos se obtienen de tu perfil de usuario. Para modificarlos, ve a tu perfil.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna derecha - Resumen de compra */}
                        <div className="col s12 l5">
                            <div className="card-panel summary-panel">
                                <h5 className="summary-title">
                                    Resumen de Compra
                                </h5>

                                {/* Detalle de precios */}
                                <div className="price-details">
                                    <div className="price-row">
                                        <span className="price-label">Subtotal ({cartHuerto.length} productos)</span>
                                        <span className="price-value">${calculateSubtotal().toLocaleString()}</span>
                                    </div>

                                    <div className="price-row">
                                        <span className="price-label">Envío</span>
                                        <span className="price-value">${calculateShipping().toLocaleString()}</span>
                                    </div>

                                    <hr className="price-divider" />

                                    <div className="total-row">
                                        <span className="total-label">Total</span>
                                        <span className="total-value">${calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Métodos de pago */}
                                <div className="payment-section">
                                    <h6 className="payment-title">
                                        Método de Pago
                                    </h6>

                                    <div className="payment-option">
                                        <label>
                                            <input name="payment" type="radio" defaultChecked />
                                            <span className="payment-label">💳 Tarjeta de Crédito/Débito</span>
                                        </label>
                                    </div>

                                    <div className="payment-option">
                                        <label>
                                            <input name="payment" type="radio" />
                                            <span className="payment-label">🏦 Transferencia Bancaria</span>
                                        </label>
                                    </div>

                                    <div className="payment-option">
                                        <label>
                                            <input name="payment" type="radio" />
                                            <span className="payment-label">💰 Pago contra entrega</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Botón de compra */}
                                <button
                                    data-testid="btn-finalizar-compra"
                                    className="btn-large waves-effect waves-light purchase-button"
                                    onClick={handlePurchase}
                                >
                                    <i className="material-icons left">shopping_cart</i>
                                    Finalizar Compra
                                </button>

                                {/* Información adicional */}
                                <div className="security-info">
                                    <p className="security-text">
                                        🔒 Compra 100% segura<br />
                                        🚚 Envío en 24-48 horas<br />
                                        ↩️ Garantía de devolución
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

