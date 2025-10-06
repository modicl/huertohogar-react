document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    // Datos de ejemplo según contexto
    let productos = [
        { id: "FR001", nombre: "Manzanas Fuji", categoria: "Frutas frescas", precio: 1200, stock: 150, descripcion: "Manzanas Fuji frescas y crujientes." },
        { id: "FR002", nombre: "Naranjas Valencia", categoria: "Frutas frescas", precio: 900, stock: 200, descripcion: "Naranjas Valencia jugosas y dulces." },
        { id: "FR003", nombre: "Plátanos Cavendish", categoria: "Frutas frescas", precio: 800, stock: 250, descripcion: "Plátanos Cavendish maduros." },
        { id: "VR001", nombre: "Zanahorias Orgánicas", categoria: "Verduras orgánicas", precio: 700, stock: 100, descripcion: "Zanahorias orgánicas recién cosechadas." },
        { id: "VR002", nombre: "Espinacas Frescas", categoria: "Verduras orgánicas", precio: 650, stock: 80, descripcion: "Espinacas frescas y verdes." },
        { id: "VR003", nombre: "Pimientos Tricolores", categoria: "Verduras orgánicas", precio: 1100, stock: 120, descripcion: "Pimientos rojos, verdes y amarillos orgánicos." },
        { id: "PO001", nombre: "Miel Orgánica", categoria: "Productos orgánicos", precio: 2500, stock: 50, descripcion: "Miel pura y orgánica de abejas." },
        { id: "PO003", nombre: "Quinua Orgánica", categoria: "Productos orgánicos", precio: 1800, stock: 99, descripcion: "Quinua orgánica de alto valor nutricional." },
        { id: "PL001", nombre: "Leche Entera", categoria: "Productos lácteos", precio: 1200, stock: 88, descripcion: "Leche entera fresca de vaca." }
    ];

    function renderTabla(filtro) {
        const tbody = document.querySelector("#tabla-productos tbody");
        tbody.innerHTML = "";
        productos
            .filter(p => filtro === "todas" || p.categoria === filtro)
            .forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
    <td>${p.id}</td>
    <td>${p.nombre}</td>
    <td>${p.categoria}</td>
    <td>$${p.precio}</td>
    <td>${p.stock || '-'}</td>
    <td>${p.descripcion}</td>
    <td><button class="btn-small orange edit-btn" data-id="${p.id}"><i class="material-icons">edit</i></button></td>
    `;
                tbody.appendChild(tr);
            });
    }

    // Filtro por categoría
    document.getElementById("filtro-categoria").addEventListener("change", function () {
        renderTabla(this.value);
    });

    // Manejar edición de productos
    let editandoId = null;
    document.querySelector('#tabla-productos').addEventListener('click', function (e) {
        if (e.target.closest('.edit-btn')) {
            const id = e.target.closest('.edit-btn').getAttribute('data-id');
            const prod = productos.find(p => p.id === id);
            if (prod) {
                document.getElementById('nombre').value = prod.nombre;
                document.getElementById('categoria').value = prod.categoria;
                document.getElementById('precio').value = prod.precio;
                document.getElementById('stock').value = prod.stock;
                document.getElementById('descripcion').value = prod.descripcion;
                M.updateTextFields();
                M.FormSelect.init(document.querySelectorAll('select'));
                // Limpia los mensajes de Parsley
                if ($('#form-producto').parsley()) {
                    $('#form-producto').parsley().reset();
                    $('#form-producto').parsley().refresh();
                }
                editandoId = id;
                M.toast({ html: 'Editando producto ' + id, classes: 'blue' });
                document.getElementById('boton-creacion').innerText = "Editar Producto"
                document.getElementById('titulo-creacion').innerText = "Editando Producto " + prod.nombre
            }
        }
    });

    // Formulario para crear o editar producto, solo si Parsley valida correctamente
    const form = document.getElementById("form-producto");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if ($(form).parsley().isValid()) {
                // Obtenemos valores desde el formulario de creacion de objetos
                const nombre = document.getElementById("nombre").value;
                const categoria = document.getElementById("categoria").value;
                const precio = parseFloat(document.getElementById("precio").value);
                const stock = document.getElementById("stock").value;
                const descripcion = document.getElementById("descripcion").value;
                // Generar ID automático según categoría
                let prefix = '';
                switch (categoria) {
                    case 'Frutas frescas': prefix = 'FR'; break;
                    case 'Verduras orgánicas': prefix = 'VR'; break;
                    case 'Productos orgánicos': prefix = 'PO'; break;
                    case 'Productos lácteos': prefix = 'PL'; break;
                    default: prefix = 'XX';
                }
                if (editandoId) {
                    // Editar producto existente
                    const idx = productos.findIndex(p => p.id === editandoId);
                    if (idx !== -1) {
                        productos[idx] = { id: editandoId, nombre, categoria, precio, stock, descripcion };
                        M.toast({ html: 'Producto actualizado', classes: 'green' });
                        document.getElementById('boton-creacion').innerText = "Crear Producto"
                        document.getElementById('titulo-creacion').innerText = "Agregar Nuevo Producto"
                        editandoId = null

                    }
                } else {
                    const id = prefix + String(productos.filter(p => p.categoria === categoria).length + 1).padStart(3, '0');
                    productos.push({ id, nombre, categoria, precio, stock, descripcion });
                    M.toast({ html: 'Producto agregado', classes: 'green' });
                }
                renderTabla(document.getElementById("filtro-categoria").value);
                this.reset();
                $(form).parsley().reset();
                form.reset();
                setTimeout(function () {
                    $(form).parsley().reset();
                    $(form).parsley().refresh();
                    M.updateTextFields();
                    M.FormSelect.init(document.querySelectorAll('select'));
                }, 50);

                M.updateTextFields();
                M.FormSelect.init(document.querySelectorAll('select'));


            }

        });
    }

    renderTabla("todas");

});