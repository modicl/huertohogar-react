import { useEffect, useState, useRef } from "react";
import { Footer } from "./Footer.jsx";
import { Header } from "./Header.jsx";

export function Registro() {
  // Estados para todos los campos del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    apellidoMaterno: '',
    region: '',
    comuna: '',
    address: '',
    rut: '',
    birthdate: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [comunas, setComunas] = useState([]);

  // Refs para los formularios
  const loginFormRef = useRef(null);
  const registroFormRef = useRef(null);

  // Definir comunasPorRegion dentro del componente
  const comunasPorRegion = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "San Antonio", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María"],
    "Metropolitana": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Ñuble": ["Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
    "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
    "La Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo"],
    "Aysén": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
  };

  // Función para manejar cambios en el formulario de registro
  const handleRegistroChange = (e) => {
    const { name, value } = e.target;

    // Validación especial para RUT
    if (name === 'rut') {
      let rutValue = value.replace(/[^0-9kK]/g, '');
      if (rutValue.startsWith('0')) {
        rutValue = rutValue.replace(/^0+/, '');
      }
      setFormData(prev => ({ ...prev, [name]: rutValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // Si cambió la región, actualizar comunas
    if (name === 'region') {
      const comunasDeRegion = comunasPorRegion[value] || [];
      setComunas(comunasDeRegion);
      setFormData(prev => ({ ...prev, comuna: '' })); // Limpiar comuna

      // Reinicializar Materialize select
      setTimeout(() => {
        if (window.M) {
          const comunaSelect = document.getElementById('comuna');
          if (comunaSelect) {
            window.M.FormSelect.init(comunaSelect);
          }
        }
      }, 100);
    }
  };

  // Función para manejar cambios en el formulario de login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  // Función para limpiar el formulario (React way)
  const limpiarFormulario = () => {
    // Resetear estado del formulario
    setFormData({
      firstName: '',
      lastName: '',
      apellidoMaterno: '',
      region: '',
      comuna: '',
      address: '',
      rut: '',
      birthdate: '',
      email: '',
      password: '',
      passwordConfirm: ''
    });

    // Limpiar comunas
    setComunas([]);

    // Limpiar errores de Parsley si existen
    if (window.$ && window.Parsley && registroFormRef.current) {
      const form = window.$(registroFormRef.current);
      if (form.parsley()) {
        form.parsley().reset();
      }
    }

    // Reinicializar Materialize
    setTimeout(() => {
      if (window.M) {
        window.M.FormSelect.init(document.querySelectorAll('select'));
        window.M.updateTextFields();

        // Reinicializar datepicker
        const datepicker = document.getElementById('birthdate');
        if (datepicker) {
          const instance = window.M.Datepicker.getInstance(datepicker);
          if (instance) {
            instance.destroy();
          }
          window.M.Datepicker.init(datepicker, {
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
        }
      }
    }, 100);

  };

  // Función para manejar el registro
  const handleRegistro = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de registro
  };

  // Función para manejar el login
  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de login
  };

  useEffect(() => {
    // Cargar scripts necesarios
    const loadScripts = async () => {
      try {
        await loadjQuery();
        await loadParsley();
        if (!window.mainLoaded) {
          await import('../assets/js/main.js');
          window.mainLoaded = true;
        }
        initializeParsleyAndMaterialize();
      } catch (error) {
        console.error('Error cargando scripts:', error);
      }
    };

    const loadjQuery = () => {
      return new Promise((resolve, reject) => {
        if (window.jQuery && window.$) {
          resolve();
          return;
        }
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
        jqueryScript.onload = () => setTimeout(() => resolve(), 100);
        jqueryScript.onerror = () => reject(new Error('Error al cargar jQuery'));
        document.head.appendChild(jqueryScript);
      });
    };

    const loadParsley = () => {
      return new Promise((resolve, reject) => {
        if (window.Parsley) {
          resolve();
          return;
        }
        const parsleyScript = document.createElement('script');
        parsleyScript.src = 'https://cdn.jsdelivr.net/npm/parsleyjs@2.9.2/dist/parsley.min.js';
        parsleyScript.onload = () => setTimeout(() => resolve(), 200);
        parsleyScript.onerror = () => reject(new Error('Error al cargar Parsley'));
        document.head.appendChild(parsleyScript);
      });
    };

    const initializeParsleyAndMaterialize = () => {
      setTimeout(() => {
        // Inicializar Materialize
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

        // Inicializar Parsley
        if (window.Parsley && typeof window.Parsley.addValidator === 'function') {
          try {
            if (!window.parsleyCustomValidatorAdded) {
              window.Parsley.addValidator('specialchar', {
                requirementType: 'string',
                validateString: function (value) {
                  return /[!@#$%^&*(),.?":{}|<>]/.test(value);
                },
                messages: {
                  en: 'La contraseña debe tener al menos un carácter especial.',
                  es: 'La contraseña debe tener al menos un carácter especial.'
                }
              });
              window.parsleyCustomValidatorAdded = true;
            }

            if (loginFormRef.current && window.$) {
              window.$(loginFormRef.current).parsley();
            }
            if (registroFormRef.current && window.$) {
              window.$(registroFormRef.current).parsley();
            }
          } catch (error) {
            console.error('Error inicializando Parsley:', error);
          }
        }
      }, 700);
    };

    // Hacer funciones disponibles globalmente (compatibilidad)
    window.limpiar = limpiarFormulario;
    window.registrar = handleRegistro;

    loadScripts();

    return () => {
      delete window.limpiar;
      delete window.registrar;
    };
  }, []);

  return (
    <>
    <Header />
      <main>
        <div className="container" style={{ marginTop: "30px" }}>
          <div className="row">
            {/* Login a la izquierda */}
            <div className="col s12 m6">
              <div className="card-panel" style={{ borderRadius: "20px", padding: "32px" }}>
                <h5 className="center titulo-formulario"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#8B4513" }}>Iniciar
                  Sesión</h5>
                <form id="form-login" className="formulario-pagina" ref={loginFormRef} onSubmit={handleLogin}>
                  <div className="input-field">
                    <input
                      id="login_email"
                      name="email"
                      type="email"
                      className="validate"
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
                      data-parsley-type="email"
                      data-parsley-pattern="[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$"
                      data-parsley-pattern-message="Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com"
                      data-parsley-type-message="Debes ingresar un correo válido."
                      data-parsley-required-message="Debes ingresar tu correo electrónico."
                      data-parsley-maxlength="100"
                      data-parsley-maxlength-message="El correo no puede tener más de 100 carácteres."
                      data-parsley-trigger="keyup" />
                    <label htmlFor="login_email">Correo electrónico</label>
                  </div>
                  <div className="input-field">
                    <input
                      id="login_password"
                      name="password"
                      type="password"
                      className="validate"
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
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
                <form id="formulario-registro" className="formulario-pagina" ref={registroFormRef} onSubmit={handleRegistro}>
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        placeholder="Nombre"
                        id="first_name"
                        name="firstName"
                        type="text"
                        className="validate"
                        required
                        value={formData.firstName}
                        onChange={handleRegistroChange}
                        data-parsley-required-message="Debes ingresar tu nombre."
                        data-parsley-maxlength="50"
                        data-parsley-maxlength-message="El nombre no puede tener más de 50 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="first_name">Nombre</label>
                    </div>
                    <div className="input-field col s12">
                      <input
                        placeholder="Apellido Paterno"
                        id="last_name"
                        name="lastName"
                        type="text"
                        className="validate"
                        required
                        value={formData.lastName}
                        onChange={handleRegistroChange}
                        data-parsley-required-message="Debes ingresar tu apellido paterno."
                        data-parsley-minlength="1"
                        data-parsley-minlength-message="Se debe ingresar al menos un carácter."
                        data-parsley-maxlength="100"
                        data-parsley-maxlength-message="El apellido no puede tener más de 100 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="last_name">Apellido Paterno</label>
                    </div>
                    <div className="input-field col s12">
                      <input
                        placeholder="Apellido Materno"
                        id="apellido_materno"
                        name="apellidoMaterno"
                        type="text"
                        className="validate"
                        required
                        value={formData.apellidoMaterno}
                        onChange={handleRegistroChange}
                        data-parsley-required-message="Debes ingresar tu apellido materno."
                        data-parsley-minlength="1"
                        data-parsley-minlength-message="Se debe ingresar al menos un carácter."
                        data-parsley-maxlength="100"
                        data-parsley-maxlength-message="El apellido no puede tener más de 100 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="apellido_materno">Apellido Materno</label>
                    </div>

                    <div className="input-field col s12 m6">
                      <select
                        id="region"
                        name="region"
                        required
                        value={formData.region}
                        onChange={handleRegistroChange}
                        data-parsley-required-message="Debes seleccionar una región.">
                        <option value="" disabled>Selecciona una región</option>
                        {Object.keys(comunasPorRegion).map((region, index) => (
                          <option key={index} value={region}>{region}</option>
                        ))}
                      </select>
                      <label htmlFor="region">Región</label>
                    </div>

                    <div className="input-field col s12 m6">
                      <select
                        id="comuna"
                        name="comuna"
                        required
                        value={formData.comuna}
                        onChange={handleRegistroChange}
                        data-parsley-required-message="Debes seleccionar una comuna.">
                        <option value="" disabled>Selecciona una comuna</option>
                        {comunas.map((comuna, index) => (
                          <option key={index} value={comuna}>{comuna}</option>
                        ))}
                      </select>
                      <label htmlFor="comuna">Comuna</label>
                    </div>

                    <div className="input-field col s12">
                      <input
                        id="address"
                        name="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={handleRegistroChange}
                        data-parsley-required-message="Debe de ingresar una dirección."
                        data-parsley-minlength="10"
                        data-parsley-minlength-message="Debe de ingresar una dirección valida"
                        data-parsley-trigger="keyup" />
                      <label htmlFor="address">Dirección</label>
                    </div>

                    <div className="input-field col s12">
                      <input
                        id="rut"
                        name="rut"
                        type="text"
                        maxLength="9"
                        required
                        value={formData.rut}
                        onChange={handleRegistroChange}
                        data-parsley-required-message="Se debe de ingresar un RUT."
                        data-parsley-pattern="^[0-9]{7,8}[kK0-9]{1}$"
                        data-parsley-pattern-message="El RUT debe contener solo números y la letra K, sin puntos ni guion. Ejemplo: 12345678K o 123456789."
                        data-parsley-minlength="7"
                        data-parsley-minlength-message="El RUT debe tener al menos 7 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="rut">RUT</label>
                    </div>

                    <div className="input-field col s12">
                      <input
                        type="text"
                        className="datepicker"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleRegistroChange} />
                      <label htmlFor="birthdate">Fecha de nacimiento</label>
                    </div>

                    <div className="input-field col s12">
                      <input
                        id="registro_email"
                        name="email"
                        type="email"
                        className="validate"
                        required
                        value={formData.email}
                        onChange={handleRegistroChange}
                        data-parsley-type="email"
                        data-parsley-pattern="[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$"
                        data-parsley-pattern-message="Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com"
                        data-parsley-type-message="Debes ingresar un correo válido."
                        data-parsley-required-message="Debes ingresar tu correo electrónico."
                        data-parsley-maxlength="100"
                        data-parsley-maxlength-message="El correo no puede tener más de 100 carácteres."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="registro_email">Correo electrónico</label>
                    </div>

                    <div className="input-field col s12">
                      <input
                        id="registro_password"
                        name="password"
                        type="password"
                        className="validate"
                        required
                        value={formData.password}
                        onChange={handleRegistroChange}
                        data-parsley-specialchar
                        data-parsley-specialchar-message="La contraseña debe tener al menos un carácter especial."
                        data-parsley-minlength="4"
                        data-parsley-minlength-message="La contraseña debe tener al menos 4 carácteres."
                        data-parsley-maxlength="10"
                        data-parsley-maxlength-message="La contraseña no puede tener más de 10 caracteres."
                        data-parsley-required-message="Debes ingresar una contraseña."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="registro_password">Contraseña</label>
                    </div>

                    <div className="input-field col s12">
                      <input
                        id="passwordConfirmar"
                        name="passwordConfirm"
                        style={{ marginBottom: "5%" }}
                        type="password"
                        className="validate"
                        required
                        value={formData.passwordConfirm}
                        onChange={handleRegistroChange}
                        data-parsley-specialchar
                        data-parsley-equalto="#registro_password"
                        data-parsley-equalto-message="Las contraseñas no coinciden."
                        data-parsley-required-message="Debes ingresar una contraseña."
                        data-parsley-trigger="keyup" />
                      <label htmlFor="passwordConfirmar">Repita su contraseña</label>
                    </div>

                    <div className="container mt-3">
                      <div className="col s6 center-align offset-m1">
                        <button className="btn" type="submit">Registrar</button>
                      </div>
                      <div className="col s6 l4 center-align offset-m1">
                        <button className="btn waves-effect red lighten-2" type="button"
                          onClick={limpiarFormulario}>Limpiar</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    <Footer />
    </>

  )
}