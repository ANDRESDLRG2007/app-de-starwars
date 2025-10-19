// =============================================================================
// 🚗 VEHÍCULOS - Con carga perezosa
// =============================================================================

// 🧩 Generar HTML de lista de vehículos
function generarListaVehiculos(arrayVehiculos) {
    let listaHTML = "";

    for (let i = 0; i < arrayVehiculos.length; i++) {
        const id = arrayVehiculos[i].uid;
        const nombre = arrayVehiculos[i].name;
        const imgWebP = arrayVehiculos[i].image;

        listaHTML += `
        <div class="card-vehiculo" onclick="DetalleVehiculo('${id}')">
            <img src="${imgWebP}" alt="${nombre}" onerror="this.src='img/fallback.webp'">
            <h3>${nombre}</h3>
            <p>ID: ${id}</p>
        </div>`;
    }

    return listaHTML;
}

// 🔁 Actualizar lista
function actualizarListaVehiculos(arrayVehiculos) {
    const contenedor = document.getElementById("lista-elementos");
    if (contenedor) {
        contenedor.innerHTML = generarListaVehiculos(arrayVehiculos);
    }
}

// 🚗 Página principal de Vehículos - CON CARGA PEREZOSA
async function Vehiculos() {
    const root = document.getElementById("root");
    root.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.className = "titulo-seccion";
    titulo.textContent = "🚗 Vehículos";

    const buscador = document.createElement("input");
    buscador.className = "buscador";
    buscador.type = "text";
    buscador.placeholder = "Buscar vehículo (Speeder, AT-AT, Sandcrawler...)";
    buscador.addEventListener("input", () => {
        aplicarFiltrosVehiculos();
    });

    // Filtros
    const filtrosContainer = document.createElement("div");
    filtrosContainer.className = "filtros-container";
    filtrosContainer.innerHTML = `
        <div class="filtro-grupo filtro-vehiculo">
            <label>🚙 Clase:</label>
            <select id="filtro-clase-vehiculo">
                <option value="">Todas</option>
                <option value="wheeled">Con ruedas</option>
                <option value="repulsorcraft">Repulsores</option>
                <option value="walker">Caminante</option>
                <option value="speeder">Speeder</option>
            </select>
        </div>
        
        <div class="filtro-grupo filtro-vehiculo">
            <label>👥 Tripulación:</label>
            <select id="filtro-tripulacion">
                <option value="">Todas</option>
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3-5">3-5 personas</option>
                <option value="6+">6+ personas</option>
            </select>
        </div>
        
        <button class="btn-limpiar-filtros" onclick="limpiarFiltrosVehiculos()">🔄 Limpiar filtros</button>
    `;

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-elementos";

    // ⚡ CARGA PEREZOSA: Si no están los detalles, cargarlos ahora
    if (!vehiculosDetallesCargados) {
        contenedorLista.innerHTML = "<div class='loading'>⏳ Cargando detalles de vehículos...</div>";
        root.appendChild(titulo);
        root.appendChild(buscador);
        root.appendChild(filtrosContainer);
        root.appendChild(contenedorLista);
        
        await cargarDetallesVehiculos();
    }

    contenedorLista.innerHTML = generarListaVehiculos(vehiculos);

    root.innerHTML = "";
    root.appendChild(titulo);
    root.appendChild(buscador);
    root.appendChild(filtrosContainer);
    root.appendChild(contenedorLista);

    // Event listeners para filtros
    document.getElementById("filtro-clase-vehiculo").addEventListener("change", aplicarFiltrosVehiculos);
    document.getElementById("filtro-tripulacion").addEventListener("change", aplicarFiltrosVehiculos);
}

// Aplicar filtros de vehículos
function aplicarFiltrosVehiculos() {
    const textoBusqueda = document.querySelector('.buscador').value.toLowerCase();
    const clase = document.getElementById("filtro-clase-vehiculo").value.toLowerCase();
    const tripulacion = document.getElementById("filtro-tripulacion").value;

    const filtrados = vehiculos.filter(v => {
        const cumpleTexto = v.name.toLowerCase().includes(textoBusqueda);
        const cumpleClase = !clase || v.vehicle_class?.toLowerCase().includes(clase);
        
        let cumpleTripulacion = true;
        if (tripulacion) {
            const crew = parseInt(v.crew) || 0;
            if (tripulacion === "1") cumpleTripulacion = crew === 1;
            else if (tripulacion === "2") cumpleTripulacion = crew === 2;
            else if (tripulacion === "3-5") cumpleTripulacion = crew >= 3 && crew <= 5;
            else if (tripulacion === "6+") cumpleTripulacion = crew >= 6;
        }

        return cumpleTexto && cumpleClase && cumpleTripulacion;
    });

    actualizarListaVehiculos(filtrados);
}

// Limpiar filtros de vehículos
function limpiarFiltrosVehiculos() {
    document.querySelector('.buscador').value = '';
    document.getElementById("filtro-clase-vehiculo").value = '';
    document.getElementById("filtro-tripulacion").value = '';
    aplicarFiltrosVehiculos();
}

// 🧭 Detalle de vehículo
async function DetalleVehiculo(id) {
    const root = document.getElementById("root");
    root.innerHTML = "<div class='loading'>Cargando vehículo...</div>";

    const data = await obtenerDetalleVehiculo(id);

    if (!data) {
        root.innerHTML = "<p>Error al cargar el vehículo</p>";
        return;
    }

    const imgLocal = data.image;
    const isFav = esFavorito(id, 'vehiculo');

    const detalle = document.createElement("div");
    detalle.className = "detalle-container vehiculo-detalle";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Vehiculos()">← Volver</button>

        <div class="detalle-header">
            <img src="${imgLocal}" alt="${data.name}" onerror="this.src='img/fallback.webp'">
            <div class="detalle-info">
                <h1>${data.name}</h1>
                <button class="btn-favorito ${isFav ? 'activo' : ''}" 
                        onclick="toggleFavorito('${id}', 'vehiculo', '${data.name}')">
                    ${isFav ? '⭐ Favorito' : '☆ Añadir a Favoritos'}
                </button>

                <p style="color: #aaa; font-size: 1.1rem; margin-bottom: 1rem;">
                    "${data.name}" - ${data.vehicle_class}
                </p>

                <div class="stats">
                    <div class="stat-item"><span class="stat-label">Modelo:</span><span class="stat-value">${data.model}</span></div>
                    <div class="stat-item"><span class="stat-label">Fabricante:</span><span class="stat-value">${data.manufacturer}</span></div>
                    <div class="stat-item"><span class="stat-label">Clase:</span><span class="stat-value">${data.vehicle_class}</span></div>
                    <div class="stat-item"><span class="stat-label">Costo:</span><span class="stat-value">${data.cost_in_credits} créditos</span></div>
                    <div class="stat-item"><span class="stat-label">Velocidad máxima:</span><span class="stat-value">${data.max_atmosphering_speed} km/h</span></div>
                    <div class="stat-item"><span class="stat-label">Longitud:</span><span class="stat-value">${data.length} metros</span></div>
                    <div class="stat-item"><span class="stat-label">Tripulación:</span><span class="stat-value">${data.crew}</span></div>
                    <div class="stat-item"><span class="stat-label">Pasajeros:</span><span class="stat-value">${data.passengers}</span></div>
                    <div class="stat-item"><span class="stat-label">Capacidad de carga:</span><span class="stat-value">${data.cargo_capacity} kg</span></div>
                    <div class="stat-item"><span class="stat-label">Consumibles:</span><span class="stat-value">${data.consumables}</span></div>
                </div>
            </div>
        </div>
    `;

    root.innerHTML = "";
    root.appendChild(detalle);
}