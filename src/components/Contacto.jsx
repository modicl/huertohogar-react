import { useEffect } from 'react'
import './Contacto.css'
import { Header } from './Header';
import { Footer } from './Footer';

export function Contacto() {
  useEffect(() => {
    // Inicializar Materialize components después del montaje
    if (window.M) {
      window.M.updateTextFields();
      window.M.textareaAutoResize(document.querySelector('#mensaje'));
    }
  }, []);

  return (
    <>
    <Header />
      <main className="container">
        <h1 className="center-align" style={{ margin: "30px 0", color: "#2E8B57", fontFamily: "'Playfair Display', serif" }}>
          Contáctanos</h1>

        <div className="row">
          <div className="col s12 m8 offset-m2">
            <div className="contact-container">
              <h4 className="contact-title">¿Tienes alguna pregunta?</h4>
              <p className="contact-subtitle">Estamos aquí para ayudarte. Completa el formulario y nos pondremos en
                contacto contigo lo antes posible.</p>

              <form id="contact-form" data-parsley-validate>
                <div className="row form-section">
                  <div className="input-field col s12">
                    <i className="material-icons prefix contact-icon">person</i>
                    <input id="nombre" type="text" className="validate" required
                      data-parsley-required-message="Por favor ingresa tu nombre" />
                    <label htmlFor="nombre">Nombre completo</label>
                  </div>
                </div>

                <div className="row form-section">
                  <div className="input-field col s12">
                    <i className="material-icons prefix contact-icon">email</i>
                    <input id="email" type="email" className="validate" required data-parsley-type="email"
                      data-parsley-type-message="Debes ingresar un correo válido"
                      data-parsley-required-message="Por favor ingresa tu correo electrónico" />
                    <label htmlFor="email">Correo electrónico</label>
                  </div>
                </div>

                <div className="row form-section">
                  <div className="input-field col s12">
                    <i className="material-icons prefix contact-icon">subject</i>
                    <input id="asunto" type="text" className="validate" required
                      data-parsley-required-message="Por favor ingresa un asunto" />
                    <label htmlFor="asunto">Asunto</label>
                  </div>
                </div>

                <div className="row form-section">
                  <div className="input-field col s12">
                    <i className="material-icons prefix contact-icon">message</i>
                    <textarea id="mensaje" className="materialize-textarea" required
                      data-parsley-required-message="Por favor ingresa tu mensaje"
                      data-parsley-minlength="10"
                      data-parsley-minlength-message="El mensaje debe tener al menos 10 caracteres"></textarea>
                    <label htmlFor="mensaje">Mensaje</label>
                  </div>
                </div>

                <div className="row">
                  <div className="col s12 center">
                    <button className="btn waves-effect waves-light btn-large" type="submit" name="action">
                      Enviar mensaje
                      <i className="material-icons right">send</i>
                    </button>
                  </div>
                </div>
              </form>

              <div className="contact-info">
                <h5>Otras formas de contactarnos</h5>
                <p><i className="material-icons contact-icon">email</i> contacto@huertohogar.cl</p>
                <p><i className="material-icons contact-icon">phone</i> +56 2 2345 6789</p>
                <p><i className="material-icons contact-icon">schedule</i> Lun - Dom: 9:00 - 18:00 hrs</p>

                <div className="center" style={{ marginTop: "20px" }}>
                  <a href="https://x.com/" target="_blank" rel="noopener" className="social-icon">
                    <i className="fab fa-x-twitter fa-2x"></i>
                  </a>
                  <a href="https://instagram.com/" target="_blank" rel="noopener" className="social-icon">
                    <i className="fab fa-instagram fa-2x"></i>
                  </a>
                  <a href="https://facebook.com/" target="_blank" rel="noopener" className="social-icon">
                    <i className="fab fa-facebook fa-2x"></i>
                  </a>
                  <a href="https://wa.me/" target="_blank" rel="noopener" className="social-icon">
                    <i className="fab fa-whatsapp fa-2x"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>

  )
}