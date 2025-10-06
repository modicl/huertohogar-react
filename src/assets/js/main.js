document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.datepicker');
    var currentYear = new Date().getFullYear();
    var options = {
        i18n: {
            months: [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ],
            monthsShort: [
                'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
            ],
            weekdays: [
                'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
            ],
            weekdaysShort: [
                'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
            ],
            weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            cancel: 'Cancelar',
            clear: 'Limpiar',
            done: 'Aceptar'
        },
        format: 'dd/mm/yyyy',
        yearRange: [currentYear - 120, currentYear], // Desde hace 120 años hasta el actual
        maxDate: new Date(), // No permite fechas futuras
        minDate: new Date(currentYear - 120, 0, 1) // Opcional: no permite fechas más antiguas
    };
    var instances = M.Datepicker.init(elems, options);

    // Inicializa el menú hamburguesa (sidenav)
    var sidenavElems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavElems);
});

function registrar() {
    var $form = $('#formulario-registro');
    var parsleyForm = $form.parsley();

    // Valida el formulario
    if (parsleyForm.validate()) {
        M.toast({ html: '¡Registro exitoso!', displayLength: 2000 });
    } else {
        var mensaje = "Debe rellenar correctamente los campos indicados!"
        M.toast({ html: mensaje, displayLength: 3000 });
    }
}

function limpiar() {
    // Campos a limpiar
    var campos = [
        "first_name",
        "last_name",
        "address",
        "birthdate",
        "email",
        "password",
    ];

    campos.forEach(function (id) {
        var input = document.getElementById(id);
        input.value = "";
        input.classList.remove("valid"); // Remueve el highlight verde
        input.classList.remove("invalid"); // Remueve el highlight rojo
    });

    // Remueve los mensajes de error de Parsley
    var $form = $('form[data-parsley-validate]');
    $form.parsley().reset();

    // Script de materialize que "recarga" los labels
    M.updateTextFields();

}

window.Parsley.addValidator('birthdate', {
    validateString: function (value) {
        // Espera formato dd/mm/yyyy
        var parts = value.split('/');
        if (parts.length !== 3) return false;
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1; // Meses en JS son 0-indexados
        var year = parseInt(parts[2], 10);
        var inputDate = new Date(year, month, day);
        var today = new Date();
        // Solo permite fechas anteriores o iguales a hoy
        return inputDate <= today;
    },
    messages: {
        es: 'La fecha de nacimiento no puede ser futura.'
    }
});

window.Parsley.addValidator('specialchar', {
    validateString: function (value) {
        // Al menos un carácter especial
        return /[!@#$%^&*(),.?":{}|<>]/.test(value);
    },
    messages: {
        es: 'La contraseña debe tener al menos un carácter especial.'
    }
});
