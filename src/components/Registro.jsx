import { useEffect } from 'react';

export function Registro() {

  useEffect(() => {
    // Cargar ambos archivos JS
    const loadScripts = async () => {
      try {
        // Cargar main.js primero
        if (!window.mainLoaded) {
          await import('../assets/js/main.js');
          window.mainLoaded = true;
        }
        
        // Luego cargar registro.js
        if (!window.registroLoaded) {
          await import('../assets/js/registro.js');
          window.registroLoaded = true;
        }

        // Inicializar componentes de Materialize después de cargar los scripts
        setTimeout(() => {
          if (window.M) {
            window.M.FormSelect.init(document.querySelectorAll('select'));
            window.M.Datepicker.init(document.querySelectorAll('.datepicker'), {
              format: 'dd/mm/yyyy',
              yearRange: [1950, new Date().getFullYear()],
              i18n: {
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
              }
            });
            window.M.updateTextFields();
          }
        }, 100);

      } catch (error) {
        console.error('Error cargando scripts:', error);
      }
    };
    
    loadScripts();
  }, []);

  return (
    <main>
      <div className="container" style={{ marginTop: "30px" }}>
        <div className="row">
          {/* Login a la izquierda */}
          <div className="col s12 m6">
            <div className="card-panel" style={{ borderRadius: "20px", padding: "32px" }}>
              <h5 className="center titulo-formulario"
                style={{ fontFamily: "'Playfair Display', serif", color: "#8B4513" }}>Iniciar
                Sesión</h5>
              <form id="form-login" className="formulario-pagina" data-parsley-validate>
                <div className="input-field">
                  <input id="login_email" type="email" className="validate" required data-parsley-type="email"
                    data-parsley-pattern="[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$"
                    data-parsley-pattern-message="Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com"
                    data-parsley-type-message="Debes ingresar un correo válido."
                    data-parsley-required="true"
                    data-parsley-required-message="Debes ingresar tu correo electrónico."
                    data-parsley-maxlength="100"
                    data-parsley-maxlength-message="El correo no puede tener más de 100 carácteres."
                    data-parsley-trigger="keyup" />
                  <label htmlFor="login_email">Correo electrónico</label>
                </div>
                <div className="input-field">
                  <input id="login_password" type="password" className="validate" required
                    data-parsley-required="true"
                    data-parsley-required-message="Se debe de ingresar una contraseña." />
                  <label htmlFor="login_password">Contraseña</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <button className="btn" type="submit">Ingresar</button>
                  <a href="#" style={{ marginLeft: "auto", color: "#2E8B57", fontWeight: "600", textDecoration: "underline" }}>
                    Recuperar contraseña
                  </a>
                </div>
              </form>
            </div>
          </div>
          {/* Registro a la derecha */}
          <div className="col s12 m6">
            <div className="card-panel" style={{ borderRadius: "20px", padding: "32px" }}>
              <h5 className="center" style={{ fontFamily: "'Playfair Display', serif", color: "#8B4513" }}>Registro</h5>
              <form id="formulario-registro" className="formulario-pagina" data-parsley-validate>
                <div className="row">
                  <div className="row">
                    <div className="input-field col s4">
                      <input placeholder="Nombre" id="first_name" type="text" className="validate"
                        required data-parsley-required="true"
                        data-parsley-required-message="Debes ingresar tu nombre."
                        data-parsley-maxlength="50"
                        data-parsley-maxlength-message="El nombre no puede tener más de 50 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="first_name">Nombre</label>
                    </div>
                    <div className="input-field col s4">
                      <input placeholder="Apellido Paterno" id="last_name" type="text"
                        className="validate" required data-parsley-required="true"
                        data-parsley-required-message="Debes ingresar tu apellido paterno."
                        data-parsley-minlength="1"
                        data-parsley-minlength-message="Se debe ingresar al menos un carácter."
                        data-parsley-maxlength="100"
                        data-parsley-maxlength-message="El apellido no puede tener más de 100 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="last_name">Apellido Paterno</label>
                    </div>
                    <div className="input-field col s4">
                      <input placeholder="Apellido Materno" id="apellido_materno" type="text"
                        className="validate" required data-parsley-required="true"
                        data-parsley-required-message="Debes ingresar tu apellido materno."
                        data-parsley-minlength="1"
                        data-parsley-minlength-message="Se debe ingresar al menos un carácter."
                        data-parsley-maxlength="100"
                        data-parsley-maxlength-message="El apellido no puede tener más de 100 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="apellido_materno">Apellido Materno</label>
                    </div>
                    <div className="input-field col s12 m6">
                      <select id="region" required data-parsley-required="true"
                        data-parsley-required-message="Debes seleccionar una región.">
                        <option value="" disabled defaultValue>Selecciona una región</option>
                        <option value="Arica y Parinacota">Arica y Parinacota</option>
                        <option value="Tarapacá">Tarapacá</option>
                        <option value="Antofagasta">Antofagasta</option>
                        <option value="Atacama">Atacama</option>
                        <option value="Coquimbo">Coquimbo</option>
                        <option value="Valparaíso">Valparaíso</option>
                        <option value="Metropolitana">Metropolitana</option>
                        <option value="O'Higgins">O'Higgins</option>
                        <option value="Maule">Maule</option>
                        <option value="Ñuble">Ñuble</option>
                        <option value="Biobío">Biobío</option>
                        <option value="La Araucanía">La Araucanía</option>
                        <option value="Los Ríos">Los Ríos</option>
                        <option value="Los Lagos">Los Lagos</option>
                        <option value="Aysén">Aysén</option>
                        <option value="Magallanes">Magallanes</option>
                      </select>
                      <label htmlFor="region">Región</label>
                    </div>
                    <div className="input-field col s12 m6">
                      <select id="comuna" required data-parsley-required="true"
                        data-parsley-required-message="Debes seleccionar una comuna.">
                        <option value="" disabled defaultValue>Selecciona una comuna</option>
                        {/* Las comunas se llenarán dinámicamente con el script de registro.js */}
                      </select>
                      <label htmlFor="comuna">Comuna</label>
                    </div>
                    <div className="input-field col s12">
                      <input id="address" type="text" required data-parsley-required="true"
                        data-parsley-required-message="Debe de ingresar una dirección."
                        data-parsley-minlength="10"
                        data-parsley-minlength-message="Debe de ingresar una dirección valida"
                        data-parsley-trigger="keyup" />
                      <label htmlFor="address">Dirección</label>
                    </div>
                    <div className="input-field col s12">
                      <input id="rut" type="text" maxLength="9" required data-parsley-required="true"
                        data-parsley-required-message="Se debe de ingresar un RUT."
                        data-parsley-pattern="^[0-9]{7,8}[kK0-9]{1}$"
                        data-parsley-pattern-message="El RUT debe contener solo números y la letra K, sin puntos ni guion. Ejemplo: 12345678K o 123456789."
                        data-parsley-minlength="7"
                        data-parsley-minlength-message="El RUT debe tener al menos 7 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="rut">RUT</label>
                    </div>
                    <div className="input-field col s12">
                      <input type="text" className="datepicker" id="birthdate" />
                      <label htmlFor="birthdate">Fecha de nacimiento</label>
                    </div>
                    <div className="input-field col s12">
                      <input id="email" type="email" className="validate" required
                        data-parsley-type="email"
                        data-parsley-pattern="[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$"
                        data-parsley-pattern-message="Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com"
                        data-parsley-type-message="Debes ingresar un correo válido."
                        data-parsley-required-message="Debes ingresar tu correo electrónico."
                        data-parsley-maxlength="100"
                        data-parsley-maxlength-message="El correo no puede tener más de 100 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="email">Correo electrónico</label>
                    </div>
                    <div className="input-field col s12">
                      <input id="password" type="password" className="validate" required
                        data-parsley-required="true"
                        data-parsley-specialchar
                        data-parsley-specialchar-message="La contraseña debe tener al menos un carácter especial."
                        data-parsley-minlength="4"
                        data-parsley-minlength-message="La contraseña debe tener al menos 4 carácteres."
                        data-parsley-maxlength="10"
                        data-parsley-maxlength-message="La contraseña no puede tener más de 10 caracteres."
                        data-parsley-required-message="Debes ingresar una contraseña."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="password">Contraseña</label>
                    </div>
                    <div className="input-field col s12">
                      <input id="passwordConfirmar" style={{ marginBottom: "5%" }} type="password"
                        className="validate" required data-parsley-specialchar
                        data-parsley-equalto="#password"
                        data-parsley-equalto-message="Las contraseñas no coinciden."
                        data-parsley-required-message="Debes ingresar una contraseña."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="passwordConfirmar">Repita su contraseña</label>
                    </div>
                    <div className="container mt-3">
                      <div className="col s6 center-align offset-m1">
                        <button className="btn" type="button" onClick={() => window.registrar?.()}>Registrar</button>
                      </div>
                      <div className="col s6 l4 center-align offset-m1">
                        <button className="btn waves-effect red lighten-2" type="button"
                          onClick={() => window.limpiar?.()}>Limpiar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}