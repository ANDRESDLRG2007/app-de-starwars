// =============================================================================
// 🚗 VEHÍCULOS - Sistema con cascada de imágenes
// =============================================================================

// 🔍 Buscar vehículos
function buscarVehiculos(texto) {
    if (texto.length >= 3) {
        const filtrados = vehiculos.filter(v =>
            v.name.toLowerCase().includes(texto.toLowerCase())
        );
        actualizarListaVehiculos(filtrados);
    } else {
        actualizarListaVehiculos(vehiculos);
    }
}

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

// 🚗 Página principal de Vehículos
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
        buscarVehiculos(buscador.value);
    });

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-elementos";

    if (vehiculos.length === 0) {
        contenedorLista.innerHTML = "<div class='loading'>Cargando vehículos...</div>";
        await obtenerVehiculos();
    }

    contenedorLista.innerHTML = generarListaVehiculos(vehiculos);

    root.appendChild(titulo);
    root.appendChild(buscador);
    root.appendChild(contenedorLista);
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