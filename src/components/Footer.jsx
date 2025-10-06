import React from 'react'

export function Footer() {
  return (
    <footer className="footer-custom">
        <div className="container">
            <div className="row">
                <div className="col s12 m4">
                    <h5 className="footer-title">Tiendas físicas y horarios</h5>
                    <p className="footer-text">
                        <b>Sede Santiago</b>: Av. Providencia 1234, Santiago. <br />Tel: +56 2 2345 6789<br />
                        <b>Sede Puerto Montt</b>: Calle Los Lagos 456, Puerto Montt. <br />Tel: +56 65 1234 5678<br />
                        <b>Sede Villarica</b>: Av. Costanera 789, Villarica. <br />Tel: +56 45 8765 4321<br />
                        <b>Sede Nacimiento</b>: Calle Principal 321, Nacimiento. <br />Tel: +56 43 5678 1234<br />
                        <b>Sede Viña del Mar</b>: Av. Libertad 654, Viña del Mar. <br />Tel: +56 32 4321 8765<br />
                        <b>Sede Valparaíso</b>: Calle Esmeralda 987, Valparaíso. <br />Tel: +56 32 8765 4321<br />
                        <b>Sede Concepción</b>: Av. O'Higgins 159, Concepción. <br />Tel: +56 41 1234 5678
                    </p>
                    <p className="footer-text" style={{marginTop: "12px"}}>
                        <b>Horario</b> : Lun - Dom 9:00 - 18:00
                    </p>
                </div>
                <div className="col s12 m4">
                    <h5 className="footer-title">Contáctanos</h5>
                    <p className="footer-text" style={{marginTop: "12px"}}>
                        <b>Cotizaciones, Ventas, Dudas, Cuidados y Problemas.</b>
                    </p>
                    <p className="footer-text" style={{marginTop: "12px"}}>
                        contacto@huertohogar.cl
                    </p>
                    <p className="footer-text" style={{marginTop: "16px", paddingLeft: "20%"}}>
                        <a href="https://x.com/" target="_blank" rel="noopener" className="social-icon">
                            <i className="fab fa-x-twitter"></i>
                        </a>
                        <a href="https://instagram.com/" target="_blank" rel="noopener" className="social-icon">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://facebook.com/" target="_blank" rel="noopener" className="social-icon">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="https://wa.me/" target="_blank" rel="noopener" className="social-icon">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                    </p>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5536.629332167769!2d-70.6234142226731!3d-33.428933296413284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf62a2cb75c3%3A0x6c84dd8e2bc13a00!2sAv.%20Providencia%201234%2C%207500571%20Providencia%2C%20Santiago%2C%20Regi%C3%B3n%20Metropolitana!5e1!3m2!1ses-419!2scl!4v1757381392848!5m2!1ses-419!2scl"
                        width="600" height="450" style={{border: "0"}} allowFullScreen="" loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className="col s12 m4">
                    <h5 className="footer-title">Suscríbete</h5>
                    <p className="footer-text" style={{marginTop: "15px"}}>
                        Recibe notificaciones anticipadas sobre descuentos, promociones exclusivas y el lanzamiento de
                        nuevas colecciones!
                    </p>
                    <div className="input-field">
                        <input 
                            id="email" 
                            type="email" 
                            className="validate" 
                            required 
                            data-parsley-type="email"
                            data-parsley-type-message="Debes ingresar un correo válido."
                            data-parsley-required-message="Debes ingresar tu correo electrónico."
                            data-parsley-trigger="keyup" 
                        />
                        <label htmlFor="email">Correo electrónico</label>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}
