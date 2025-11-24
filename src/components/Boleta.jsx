import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Boleta.css';
import logoNavbar from '../assets/images/logo_navbar.png';

export function Boleta({ cartItems: propCartItems, shippingInfo: propShippingInfo, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener datos desde location.state o desde props con useMemo
  const cartItems = useMemo(() => 
    location.state?.cartItems || propCartItems || [], 
    [location.state?.cartItems, propCartItems]
  );
  
  const shippingInfo = useMemo(() => 
    location.state?.shippingInfo || propShippingInfo || null,
    [location.state?.shippingInfo, propShippingInfo]
  );

  // Si no hay datos, redirigir al checkout
  React.useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      console.warn('No hay items en el carrito para generar la boleta');
      navigate('/checkout');
    }
  }, [cartItems, navigate]);

  // Función para calcular subtotal (neto sin IVA)
  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  // Función para calcular IVA (19%)
  const calculateIVA = () => {
    return Math.round(calculateSubtotal() * 0.19);
  };

  // Función para calcular neto (precio sin IVA)
  const calculateNeto = () => {
    return calculateSubtotal() - calculateIVA();
  };

  // Función para calcular envío
  const calculateShipping = () => {
    return 3000;
  };

  // Función para calcular total final
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  // Obtener fecha y hora actual
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const time = now.toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return { date, time };
  };

  const { date, time } = getCurrentDateTime();

  // Número de boleta (usar ID de orden si existe, sino generar aleatorio)
  const boletaNumber = location.state?.orderId 
    ? location.state.orderId.toString().padStart(7, '0') 
    : Math.floor(Math.random() * 1000000).toString().padStart(7, '0');

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    navigate('/');
  };

  return (
    <div className="boleta-overlay" onClick={handleClose}>
      <div className="boleta-container" onClick={(e) => e.stopPropagation()}>
        <div className="boleta-header">
          <div className="boleta-logo">
            <img src={logoNavbar} alt="Huerto Hogar Logo" />
          </div>
          <div className="boleta-info">
            <h2>BOLETA ELECTRÓNICA</h2>
            <p>Nº {boletaNumber}</p>
          </div>
        </div>

        <div className="boleta-company-info">
          <h3>HUERTO HOGAR SPA</h3>
          <p>RUT: 76.XXX.XXX-X</p>
          <p>Dirección: Av. Principal 123, Santiago</p>
          <p>Teléfono: +56 2 2345 6789</p>
          <p>Email: ventas@huertohogar.cl</p>
        </div>

        <div className="boleta-date-info">
          <p><strong>Fecha:</strong> {date}</p>
          <p><strong>Hora:</strong> {time}</p>
        </div>

        {shippingInfo && (
          <div className="boleta-customer-info">
            <h4>DATOS DEL CLIENTE</h4>
            <p><strong>Nombre:</strong> {shippingInfo.fullName}</p>
            <p><strong>Email:</strong> {shippingInfo.email}</p>
            <p><strong>Teléfono:</strong> {shippingInfo.phone}</p>
            <p><strong>Dirección:</strong> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.region}</p>
          </div>
        )}

        <div className="boleta-items">
          <h4>DETALLE DE PRODUCTOS</h4>
          <table className="boleta-table">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Producto</th>
                <th>Precio Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems && cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="text-center">{item.quantity}</td>
                  <td>{item.nombre}</td>
                  <td className="text-right">${item.precio.toLocaleString()}</td>
                  <td className="text-right">${(item.precio * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="boleta-totals">
          <div className="boleta-total-row">
            <span>Neto:</span>
            <span>${calculateNeto().toLocaleString()}</span>
          </div>
          <div className="boleta-total-row">
            <span>IVA (19%):</span>
            <span>${calculateIVA().toLocaleString()}</span>
          </div>
          <div className="boleta-total-row">
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toLocaleString()}</span>
          </div>
          <div className="boleta-total-row">
            <span>Envío:</span>
            <span>${calculateShipping().toLocaleString()}</span>
          </div>
          <div className="boleta-total-row boleta-final-total">
            <span>TOTAL A PAGAR:</span>
            <span>${calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <div className="boleta-footer">
          <p>¡Gracias por su compra en Huerto Hogar!</p>
          <p className="boleta-footer-small">
            Esta boleta electrónica es válida sin necesidad de firma ni timbre.
          </p>
          <p className="boleta-footer-small">
            Documento tributario electrónico - SII Chile
          </p>
        </div>

        <div className="boleta-actions no-print">
          <button className="btn waves-effect waves-light" onClick={handlePrint}>
            <i className="material-icons left">print</i>
            Imprimir Boleta
          </button>
          <button className="btn grey waves-effect waves-light" onClick={handleClose}>
            <i className="material-icons left">close</i>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
