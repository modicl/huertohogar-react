document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    // Datos de ejemplo
    let pedidos = [
        {id: '#FR001', fecha: '2025-09-01', cliente: 'Juan Pérez', total: 250, estado: 'Completado'},
        {id: '#FR002', fecha: '2025-09-02', cliente: 'María López', total: 150, estado: 'Pendiente'},
        {id: '#FR003', fecha: '2025-09-03', cliente: 'Carlos Gómez', total: 320, estado: 'Completado'},
        {id: '#FR004', fecha: '2025-09-04', cliente: 'Ana Torres', total: 90, estado: 'Cancelado'},
        {id: '#FR005', fecha: '2025-09-05', cliente: 'Pedro Díaz', total: 180, estado: 'Pendiente'},
        {id: '#FR006', fecha: '2025-09-06', cliente: 'Lucía Rojas', total: 400, estado: 'Completado'},
    ];

    function renderTabla(filtroEstado, filtroFecha, filtroTotal) {
        const tbody = document.querySelector("#tabla-pedidos tbody");
        tbody.innerHTML = "";
        pedidos
            .filter(p => (filtroEstado === 'todas' || p.estado === filtroEstado))
            .filter(p => (!filtroFecha || p.fecha === filtroFecha))
            .filter(p => (!filtroTotal || p.total == filtroTotal))
            .forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.fecha}</td>
                    <td>${p.cliente}</td>
                    <td>$${p.total}</td>
                    <td><span class="new badge ${badgeColor(p.estado)}" data-badge-caption="${p.estado}"></span></td>
                `;
                tbody.appendChild(tr);
            });
    }

    function badgeColor(estado) {
        switch(estado) {
            case 'Completado': return 'green';
            case 'Pendiente': return 'orange';
            case 'Cancelado': return 'red';
            default: return 'grey';
        }
    }

    // Filtros
    document.getElementById("filtro-estado").addEventListener("change", function() {
        renderTabla(this.value, document.getElementById('filtro-fecha').value, document.getElementById('filtro-total').value);
    });
    document.getElementById("filtro-fecha").addEventListener("change", function() {
        renderTabla(document.getElementById('filtro-estado').value, this.value, document.getElementById('filtro-total').value);
    });
    document.getElementById("filtro-total").addEventListener("input", function() {
        renderTabla(document.getElementById('filtro-estado').value, document.getElementById('filtro-fecha').value, this.value);
    });

    renderTabla('todas', '', '');
});
