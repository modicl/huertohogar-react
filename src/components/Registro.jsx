import { useEffect, useState, useRef } from "react";
import { Footer } from "./Footer.jsx";
import { Header } from "./Header.jsx";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { PerfilUsuario } from "./PerfilUsuario.jsx";
import { API_URLS } from "../config/api.js";

export function Registro() {
  const { user, login } = useAuth();
  
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

  // Mapeo de regiones a IDs
  const regionesIds = {
    "Arica y Parinacota": 15,
    "Tarapacá": 1,
    "Antofagasta": 2,
    "Atacama": 3,
    "Coquimbo": 4,
    "Valparaíso": 5,
    "Metropolitana": 13,
    "O'Higgins": 6,
    "Maule": 7,
    "Ñuble": 16,
    "Biobío": 8,
    "La Araucanía": 9,
    "Los Ríos": 14,
    "Los Lagos": 10,
    "Aysén": 11,
    "Magallanes": 12
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
      }
    }, 100);

  };

  // Función para manejar el registro
  const handleRegistro = async (e) => {
    e.preventDefault();
    
    // Validar el formulario con Parsley
    if (window.$ && window.Parsley && registroFormRef.current) {
      const form = window.$(registroFormRef.current);
      if (form.parsley() && !form.parsley().isValid()) {
        form.parsley().validate();
        return;
      }
    }

    try {
      // Validar que la fecha de nacimiento no esté vacía
      if (!formData.birthdate || formData.birthdate.trim() === '') {
        if (window.M) {
          window.M.toast({ 
            html: 'Debes seleccionar tu fecha de nacimiento.', 
            classes: 'red',
            displayLength: 4000
          });
        } else {
          alert('Debes seleccionar tu fecha de nacimiento.');
        }
        return;
      }

      // Extraer RUT y DV
      const rutCompleto = formData.rut;
      const rut = rutCompleto.slice(0, -1); // Todos los dígitos excepto el último
      const dv = rutCompleto.slice(-1).toUpperCase(); // Último carácter (puede ser número o K)

      // Convertir fecha - el input type="date" ya devuelve formato yyyy-mm-dd
      const fechaNacimiento = formData.birthdate;
      
      // Validar que la fecha exista
      if (!fechaNacimiento || fechaNacimiento.trim() === '') {
        if (window.M) {
          window.M.toast({ 
            html: 'Debes seleccionar tu fecha de nacimiento.', 
            classes: 'red',
            displayLength: 4000
          });
        } else {
          alert('Debes seleccionar tu fecha de nacimiento.');
        }
        return;
      }

      // Obtener ID de región
      const idRegion = regionesIds[formData.region] || 13;

      // Construir el body para la API
      const body = {
        nombre: formData.firstName,
        sNombre: "", // Segundo nombre vacío según especificación
        aPaterno: formData.lastName,
        aMaterno: formData.apellidoMaterno,
        rut: rut,
        dv: dv,
        fechaNacimiento: fechaNacimiento,
        idRegion: idRegion,
        direccion: formData.address,
        email: formData.email,
        telefono: "+56912345678", // Teléfono por defecto
        passwordHashed: formData.password
      };

      console.log('Body enviado:', body);

      // Realizar la petición POST
      const response = await axios.post(
        API_URLS.usuarios.base,
        body,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Si la petición fue exitosa
      if (response.status === 200 || response.status === 201) {
        if (window.M) {
          window.M.toast({ 
            html: '¡Usuario registrado exitosamente!', 
            classes: 'green' 
          });
        } else {
          alert('¡Usuario registrado exitosamente!');
        }
        
        // Limpiar el formulario
        limpiarFormulario();
      }

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      let mensajeError = 'Error al registrar usuario. Por favor, intenta nuevamente.';
      
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.log('Detalles del error:', error.response.data);
        mensajeError = error.response.data?.message || error.response.data?.error || JSON.stringify(error.response.data) || mensajeError;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      
      if (window.M) {
        window.M.toast({ 
          html: mensajeError, 
          classes: 'red',
          displayLength: 6000
        });
      } else {
        alert(mensajeError);
      }
    }
  };

  // Función para manejar el login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validar el formulario con Parsley
    if (window.$ && window.Parsley && loginFormRef.current) {
      const form = window.$(loginFormRef.current);
      if (form.parsley() && !form.parsley().isValid()) {
        form.parsley().validate();
        return;
      }
    }

    try {
      // Construir el body para la autenticación
      const body = {
        email: loginData.email,
        password: loginData.password
      };

      console.log('Intentando login con:', { email: loginData.email });

      // Realizar la petición POST
      const response = await axios.post(
        API_URLS.usuarios.authenticate,
        body,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Si la petición fue exitosa
      if (response.status === 200 && response.data) {
        const userData = {
          idUsuario: response.data.idUsuario,
          nombre: response.data.nombre,
          sNombre: response.data.sNombre,
          aPaterno: response.data.aPaterno,
          aMaterno: response.data.aMaterno,
          rut: response.data.rut,
          dv: response.data.dv,
          fechaNacimiento: response.data.fechaNacimiento,
          idRegion: response.data.idRegion,
          direccion: response.data.direccion,
          email: response.data.email,
          telefono: response.data.telefono,
          rol: response.data.rol,
          // Mantener compatibilidad con código antiguo
          pnombre: response.data.nombre,
          apaterno: response.data.aPaterno
        };

        // Guardar el usuario y token usando el contexto
        login(userData, response.data.token);

        if (window.M) {
          window.M.toast({ 
            html: `¡Bienvenido, ${userData.nombre || userData.pnombre}!`, 
            classes: 'green',
            displayLength: 3000
          });
        } else {
          alert(`¡Bienvenido, ${userData.nombre || userData.pnombre}!`);
        }
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      let mensajeError = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      
      if (error.response) {
        if (error.response.status === 401) {
          mensajeError = 'Email o contraseña incorrectos.';
        } else {
          mensajeError = error.response.data?.message || error.response.data?.error || mensajeError;
        }
      } else if (error.request) {
        mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      
      if (window.M) {
        window.M.toast({ 
          html: mensajeError, 
          classes: 'red',
          displayLength: 6000
        });
      } else {
        alert(mensajeError);
      }
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si el usuario está autenticado, mostrar el perfil
  if (user) {
    return <PerfilUsuario />;
  }

  return (
    <>
      <style>
        {`
          /* Deshabilitar el datepicker de Materialize */
          .datepicker-modal,
          .datepicker-date-display,
          .datepicker-calendar-container {
            display: none !important;
          }
          
          /* Asegurar que el input date nativo funcione correctamente */
          input[type="date"]::-webkit-calendar-picker-indicator {
            cursor: pointer;
          }
        `}
      </style>
      <Header />
      <main data-testid="registro">
        <div className="container" style={{ marginTop: "30px" }}>
          <div className="row">
            {/* Login a la izquierda */}
            <div className="col s12 m6">
              <div className="card-panel" style={{ borderRadius: "20px", padding: "32px" }}>
                <h5 className="center titulo-formulario"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#8B4513" }}>Iniciar
                  Sesión</h5>
                <form id="form-login" className="formulario-pagina" ref={loginFormRef} onSubmit={handleLogin} data-testid="inicio-sesion">
                  <div className="input-field" >
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
                <form id="formulario-registro" className="formulario-pagina" ref={registroFormRef} onSubmit={handleRegistro} data-testid="formulario-registro">
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
                       data-testid="rut-registro"
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
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        required
                        value={formData.birthdate}
                        onChange={handleRegistroChange}
                        max={new Date().toISOString().split('T')[0]}
                        min="1900-01-01"
                        data-parsley-required-message="Debes seleccionar tu fecha de nacimiento." />
                      <label htmlFor="birthdate" className="active">Fecha de nacimiento</label>
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