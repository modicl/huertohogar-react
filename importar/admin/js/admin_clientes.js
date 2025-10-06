document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    // Datos de ejemplo (no hay backend)
    let clientes = [
        { rut: '17809471k', nombre: 'Juan', apellido: 'Pérez', apellidom: 'Lara', pais: 'Chile', ordenes: 12, frecuente: true },
        { rut: '17809472k', nombre: 'María', apellido: 'López', apellidom: 'Loro', pais: 'Argentina', ordenes: 3, frecuente: false },
        { rut: '17809473k', nombre: 'Carlos', apellido: 'Gómez', apellidom: 'Lura', pais: 'Chile', ordenes: 8, frecuente: true },
        { rut: '17809474k', nombre: 'Ana', apellido: 'Torres', apellidom: 'Lera', pais: 'Perú', ordenes: 2, frecuente: false },
        { rut: '17809475k', nombre: 'Lucía', apellido: 'Rojas', apellidom: 'Lira', pais: 'Chile', ordenes: 15, frecuente: true },
    ];

    function renderTabla(filtroPais, filtroFrecuente, filtroNombre) {
        const tbody = document.querySelector("#tabla-clientes tbody");
        tbody.innerHTML = "";
        clientes
            .filter(c => (filtroPais === 'todos' || c.pais === filtroPais))
            .filter(c => (filtroFrecuente === 'todos' || (filtroFrecuente === 'si' ? c.frecuente : !c.frecuente)))
            .filter(c => (!filtroNombre || (c.nombre + ' ' + c.apellido).toLowerCase().includes(filtroNombre.toLowerCase())))
            .forEach(c => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${c.rut}</td>
                    <td>${c.nombre} ${c.apellido} ${c.apellidom}</td>
                    <td>${c.ordenes}</td>
                    <td><span class="badge ${c.frecuente ? 'green' : 'grey'} white-text">${c.frecuente ? 'Sí' : 'No'}</span></td>
<td>
    <button class="btn-small orange edit-btn" data-id="${c.rut}">
        <i class="material-icons">edit</i>
    </button>
</td>
                `;
                tbody.appendChild(tr);
            });
    }

    // Filtros
    document.getElementById("filtro-pais").addEventListener("change", function () {
        renderTabla(this.value, document.getElementById('filtro-frecuente').value, document.getElementById('filtro-nombre').value);
    });
    document.getElementById("filtro-frecuente").addEventListener("change", function () {
        renderTabla(document.getElementById('filtro-pais').value, this.value, document.getElementById('filtro-nombre').value);
    });
    document.getElementById("filtro-nombre").addEventListener("input", function () {
        renderTabla(document.getElementById('filtro-pais').value, document.getElementById('filtro-frecuente').value, this.value);
    });

    const form = document.getElementById('form-cliente');
    const tabla = document.querySelector('#tabla-clientes tbody');

    let editandoRut = null;

    tabla.addEventListener('click', function (e) {
        if (e.target.closest('.edit-btn')) {
            const rut = e.target.closest('.edit-btn').getAttribute('data-id');
            const cliente = clientes.find(c => c.rut === rut);
            if (cliente) {
                document.getElementById('rut').value = cliente.rut;
                document.getElementById('rut').readOnly = true;
                document.getElementById('nombre').value = cliente.nombre;
                document.getElementById('apellido_paterno').value = cliente.apellido;
                document.getElementById('apellido_materno').value = cliente.apellidom;

                M.updateTextFields();
                M.FormSelect.init(document.querySelectorAll('select'));
                editandoRut = rut;
                document.getElementById("titulo-creacion").textContent = "Editando Cliente " + cliente.rut;
                document.querySelector('#form-cliente button[type="submit"]').textContent = "Editar Cliente";
                if ($('#form-cliente').parsley()) {
                    $('#form-cliente').parsley().reset();
                }
                
            }
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if ($(form).parsley().isValid()) {
            // Obtén los valores de los campos
            const rut = document.getElementById('rut').value;
            const nombre = document.getElementById('nombre').value;
            const apellidoP = document.getElementById('apellido_paterno').value;
            const apellidoM = document.getElementById('apellido_materno').value;

            if (editandoRut) {
                // Actualiza el cliente en el array
                const idx = clientes.findIndex(c => c.rut === editandoRut);
                if (idx !== -1) {
                    clientes[idx].rut = rut;
                    clientes[idx].nombre = nombre;
                    clientes[idx].apellido = apellidoP;
                    clientes[idx].apellidom = apellidoM;
                }
                editandoRut = null;
                document.getElementById('rut').readOnly = false;
                document.querySelector('.card-title').textContent = "Agregar Nuevo Cliente";
                document.querySelector('#form-cliente button[type="submit"]').textContent = "Crear Cliente";
            } else {
                // Agrega el cliente al array
                clientes.push({
                    rut,
                    nombre,
                    apellido: apellidoP,
                    apellidom: apellidoM,
                    pais: "Chile",
                    ordenes: 0,
                    frecuente: false
                });
            }

            // Vuelve a renderizar la tabla
            renderTabla(
                document.getElementById('filtro-pais').value,
                document.getElementById('filtro-frecuente').value,
                document.getElementById('filtro-nombre').value
            );

            // Limpia el formulario y Parsley
            form.reset();
            setTimeout(function () {
                $(form).parsley().reset();
                $(form).parsley().refresh();
                M.updateTextFields();
                M.FormSelect.init(document.querySelectorAll('select'));
            }, 50);
        }
    });

    renderTabla('todos', 'todos', '');
});
