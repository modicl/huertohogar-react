import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

export function Checkout({ cartHuerto, setCartHuerto }) {
    const navigate = useNavigate();
    const selectRef = useRef(null);
    
    // Estado para información de envío
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        region: '',
        zipCode: ''
    });

    // Función para calcular subtotal
    const calculateSubtotal = () => {
        if (!cartHuerto || cartHuerto.length === 0) return 0;
        return cartHuerto.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    // Función para calcular envío
    const calculateShipping = () => {
        return cartHuerto && cartHuerto.length > 0 ? 3000 : 0; // Solo cobrar envío si hay productos
    };

    // Función para calcular total
    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    // Función para manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
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

    // Función para agregar productos de prueba
    const addTestProducts = () => {
        const testProducts = [
            { id: 101, nombre: "Tomate Limachino", precio: 2800, quantity: 2, imagen: "/images/tomate.jpg", categoria: "Verduras" },
            { id: 102, nombre: "Albahaca Fresca", precio: 1500, quantity: 1, imagen: "/images/albahaca.jpg", categoria: "Hierbas" },
            { id: 103, nombre: "Pimiento Rojo", precio: 2200, quantity: 3, imagen: "/images/pimiento.jpg", categoria: "Verduras" },
        ];
        setCartHuerto(testProducts);
        localStorage.setItem('cartHuerto', JSON.stringify(testProducts));
        console.log('Productos de prueba agregados al carrito.');
    };

    // Función para procesar la compra
    const handlePurchase = (e) => {
        e.preventDefault();
        
        if (!cartHuerto || cartHuerto.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }

        // Validar que todos los campos del formulario estén completos
        if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || 
            !shippingInfo.address || !shippingInfo.city || !shippingInfo.region || 
            !shippingInfo.zipCode) {
            alert('Por favor completa todos los campos de envío');
            return;
        }

        console.log('Procesando compra...', { 
            productos: cartHuerto, 
            envio: shippingInfo, 
            total: calculateTotal() 
        });
        
        // Navegar a la boleta con los datos de la compra
        navigate('/boleta', {
            state: {
                cartItems: cartHuerto,
                shippingInfo: shippingInfo
            }
        });
        
        // Limpiar el carrito después de navegar a la boleta
        setCartHuerto([]);
        localStorage.removeItem('cartHuerto');
    };

    // Función para actualizar cantidad de un producto
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const updatedCart = cartHuerto.map(item => 
            item.id === productId 
                ? { ...item, quantity: newQuantity }
                : item
        );
        
        setCartHuerto(updatedCart);
        localStorage.setItem('cartHuerto', JSON.stringify(updatedCart));
    };

    // Función para remover producto del carrito
    const removeFromCart = (productId) => {
        const updatedCart = cartHuerto.filter(item => item.id !== productId);
        setCartHuerto(updatedCart);
        localStorage.setItem('cartHuerto', JSON.stringify(updatedCart));
    };

    // Si no hay productos en el carrito, mostrar mensaje
    if (!cartHuerto || cartHuerto.length === 0) {
        return (
            <main>
                <div className="container checkout-container">
                    <div className="row">
                        <div className="col s12">
                            <div className="card-panel" style={{ textAlign: 'center', padding: '50px' }}>
                                <h4 style={{ color: '#8B4513', marginBottom: '20px' }}>
                                    Tu carrito está vacío
                                </h4>
                                <p style={{ color: '#666', fontSize: '18px', marginBottom: '30px' }}>
                                    Agrega algunos productos para continuar con tu compra
                                </p>
                                <a href="/productos" className="btn" style={{ backgroundColor: '#2E8B57', marginRight: '10px' }}>
                                    Ver Productos
                                </a>
                                <button onClick={addTestProducts} className="btn blue">
                                    Agregar Productos de Prueba
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="container checkout-container">
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
                            <h5 className="checkout-section-title">
                                Productos en tu carrito ({cartHuerto.length})
                            </h5>

                            {cartHuerto.map((item) => (
                                <div key={item.id} className="row cart-item">
                                    <div className="col s3">
                                        <img
                                            src={item.imagen}
                                            alt={item.nombre}
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
                                            {item.nombre}
                                        </h6>
                                        <p className="cart-item-category">
                                            Categoría: {item.categoria}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                            <button 
                                                className="btn-small" 
                                                style={{ backgroundColor: '#ff6b6b', marginRight: '10px' }}
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span style={{ margin: '0 15px', fontWeight: 'bold' }}>
                                                {item.quantity}
                                            </span>
                                            <button 
                                                className="btn-small" 
                                                style={{ backgroundColor: '#2E8B57', marginRight: '10px' }}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                            <button 
                                                className="btn-small red" 
                                                onClick={() => removeFromCart(item.id)}
                                                title="Eliminar producto"
                                            >
                                                <i className="material-icons">delete</i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col s3 right-align">
                                        <p className="cart-item-price">
                                            ${(item.precio * item.quantity).toLocaleString()}
                                        </p>
                                        <p className="cart-item-unit-price">
                                            ${item.precio.toLocaleString()} c/u
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Información de envío */}
                            <div className="shipping-form">
                                <h5 className="checkout-subsection-title">
                                    Información de Envío
                                </h5>

                                <form onSubmit={handlePurchase}>
                                    <div className="row">
                                        <div className="input-field col s12 m6">
                                            <input
                                                id="fullName"
                                                name="fullName"
                                                type="text"
                                                className="validate"
                                                required
                                                value={shippingInfo.fullName}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="fullName">Nombre Completo</label>
                                        </div>
                                        <div className="input-field col s12 m6">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                className="validate"
                                                required
                                                value={shippingInfo.email}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="email">Email</label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="input-field col s12 m6">
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                className="validate"
                                                required
                                                value={shippingInfo.phone}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="phone">Teléfono</label>
                                        </div>
                                        <div className="input-field col s12 m6">
                                            <input
                                                id="zipCode"
                                                name="zipCode"
                                                type="text"
                                                className="validate"
                                                required
                                                value={shippingInfo.zipCode}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="zipCode">Código Postal</label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input
                                                id="address"
                                                name="address"
                                                type="text"
                                                className="validate"
                                                required
                                                value={shippingInfo.address}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="address">Dirección Completa</label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="input-field col s12 m6">
                                            <input
                                                id="city"
                                                name="city"
                                                type="text"
                                                className="validate"
                                                required
                                                value={shippingInfo.city}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="city">Ciudad</label>
                                        </div>
                                        <div className="input-field col s12 m6">
                                            <select
                                                ref={selectRef}
                                                name="region"
                                                value={shippingInfo.region}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="" disabled>Selecciona Región</option>
                                                <option value="Región de Arica y Parinacota">Región de Arica y Parinacota</option>
                                                <option value="Región de Tarapacá">Región de Tarapacá</option>
                                                <option value="Región de Antofagasta">Región de Antofagasta</option>
                                                <option value="Región de Atacama">Región de Atacama</option>
                                                <option value="Región de Coquimbo">Región de Coquimbo</option>
                                                <option value="Región de Valparaíso">Región de Valparaíso</option>
                                                <option value="Región Metropolitana de Santiago">Región Metropolitana de Santiago</option>
                                                <option value="Región del Libertador General Bernardo O'Higgins">Región del Libertador General Bernardo O'Higgins</option>
                                                <option value="Región del Maule">Región del Maule</option>
                                                <option value="Región de Ñuble">Región de Ñuble</option>
                                                <option value="Región del Biobío">Región del Biobío</option>
                                                <option value="Región de La Araucanía">Región de La Araucanía</option>
                                                <option value="Región de Los Ríos">Región de Los Ríos</option>
                                                <option value="Región de Los Lagos">Región de Los Lagos</option>
                                                <option value="Región de Aysén del General Carlos Ibáñez del Campo">Región de Aysén del General Carlos Ibáñez del Campo</option>
                                                <option value="Región de Magallanes y de la Antártica Chilena">Región de Magallanes y de la Antártica Chilena</option>
                                            </select>
                                            <label>Región</label>
                                        </div>
                                    </div>
                                </form>
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
    )
}

