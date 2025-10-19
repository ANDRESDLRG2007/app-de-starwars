// =============================================================================
// 🚀 NAVES - Con carga perezosa
// =============================================================================

// 🧩 Generar HTML de lista de naves
function generarListaNaves(arrayNaves) {
    let listaHTML = "";

    for (let i = 0; i < arrayNaves.length; i++) {
        const id = arrayNaves[i].uid;
        const nombre = arrayNaves[i].name;
        const imgWebP = arrayNaves[i].image || 'img/fallback.webp';

        listaHTML += `
        <div class="card-nave" onclick="DetalleNave('${id}')">
            <img src="${imgWebP}" alt="${nombre}" onerror="this.src='img/fallback.webp'">
            <h3>${nombre}</h3>
            <p>ID: ${id}</p>
        </div>`;
    }

    return listaHTML;
}

// 🔁 Actualizar lista
function actualizarListaNaves(arrayNaves) {
    const contenedor = document.getElementById("lista-elementos");
    if (contenedor) {
        contenedor.innerHTML = generarListaNaves(arrayNaves);
    }
}

// 🚀 Página principal de Naves - CON CARGA PEREZOSA
async function Naves() {
    const root = document.getElementById("root");
    root.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.className = "titulo-seccion";
    titulo.textContent = "🚀 Naves Espaciales";

    const buscador = document.createElement("input");
    buscador.className = "buscador";
    buscador.type = "text";
    buscador.placeholder = "Buscar nave (Millennium Falcon, X-wing...)";
    buscador.addEventListener("input", () => {
        aplicarFiltrosNaves();
    });

    // Filtros
    const filtrosContainer = document.createElement("div");
    filtrosContainer.className = "filtros-container";
    filtrosContainer.innerHTML = `
        <div class="filtro-grupo filtro-nave">
            <label>🛸 Clase:</label>
            <select id="filtro-clase-nave">
                <option value="">Todas</option>
                <option value="starfighter">Caza estelar</option>
                <option value="transport">Transporte</option>
                <option value="cruiser">Crucero</option>
                <option value="corvette">Corbeta</option>
                <option value="freighter">Carguero</option>
            </select>
        </div>
        
        <div class="filtro-grupo filtro-nave">
            <label>⚡ Hiperpropulsor:</label>
            <select id="filtro-hiperpropulsor">
                <option value="">Todos</option>
                <option value="rapido">Rápido (≤1.0)</option>
                <option value="medio">Medio (1.0-4.0)</option>
                <option value="lento">Lento (&gt;4.0)</option>
            </select>
        </div>
        
        <div class="filtro-grupo filtro-nave">
            <label>👥 Tripulación:</label>
            <select id="filtro-tripulacion-nave">
                <option value="">Todas</option>
                <option value="1">1 persona</option>
                <option value="2-5">2-5 personas</option>
                <option value="6-50">6-50 personas</option>
                <option value="50+">50+ personas</option>
            </select>
        </div>
        
        <button class="btn-limpiar-filtros" onclick="limpiarFiltrosNaves()">🔄 Limpiar filtros</button>
    `;

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-elementos";

    // ⚡ CARGA PEREZOSA: Si no están los detalles, cargarlos ahora
    if (!navesDetallesCargados) {
        contenedorLista.innerHTML = "<div class='loading'>⏳ Cargando imágenes y detalles de naves...</div>";
        root.appendChild(titulo);
        root.appendChild(buscador);
        root.appendChild(filtrosContainer);
        root.appendChild(contenedorLista);
        
        await cargarDetallesNaves();
    }

    contenedorLista.innerHTML = generarListaNaves(naves);

    root.innerHTML = "";
    root.appendChild(titulo);
    root.appendChild(buscador);
    root.appendChild(filtrosContainer);
    root.appendChild(contenedorLista);

    // Event listeners para filtros
    document.getElementById("filtro-clase-nave").addEventListener("change", aplicarFiltrosNaves);
    document.getElementById("filtro-hiperpropulsor").addEventListener("change", aplicarFiltrosNaves);
    document.getElementById("filtro-tripulacion-nave").addEventListener("change", aplicarFiltrosNaves);
}

// Aplicar filtros de naves
function aplicarFiltrosNaves() {
    const textoBusqueda = document.querySelector('.buscador').value.toLowerCase();
    const clase = document.getElementById("filtro-clase-nave").value.toLowerCase();
    const hiperpropulsor = document.getElementById("filtro-hiperpropulsor").value;
    const tripulacion = document.getElementById("filtro-tripulacion-nave").value;

    const filtradas = naves.filter(n => {
        const cumpleTexto = n.name.toLowerCase().includes(textoBusqueda);
        const cumpleClase = !clase || n.starship_class?.toLowerCase().includes(clase);
        
        let cumpleHiper = true;
        if (hiperpropulsor) {
            const hiper = parseFloat(n.hyperdrive_rating) || 999;
            if (hiperpropulsor === "rapido") cumpleHiper = hiper <= 1.0;
            else if (hiperpropulsor === "medio") cumpleHiper = hiper > 1.0 && hiper <= 4.0;
            else if (hiperpropulsor === "lento") cumpleHiper = hiper > 4.0;
        }
        
        let cumpleTripulacion = true;
        if (tripulacion) {
            const crew = parseInt(n.crew?.replace(/,/g, '')) || 0;
            if (tripulacion === "1") cumpleTripulacion = crew === 1;
            else if (tripulacion === "2-5") cumpleTripulacion = crew >= 2 && crew <= 5;
            else if (tripulacion === "6-50") cumpleTripulacion = crew >= 6 && crew <= 50;
            else if (tripulacion === "50+") cumpleTripulacion = crew > 50;
        }

        return cumpleTexto && cumpleClase && cumpleHiper && cumpleTripulacion;
    });

    actualizarListaNaves(filtradas);
}

// Limpiar filtros de naves
function limpiarFiltrosNaves() {
    document.querySelector('.buscador').value = '';
    document.getElementById("filtro-clase-nave").value = '';
    document.getElementById("filtro-hiperpropulsor").value = '';
    document.getElementById("filtro-tripulacion-nave").value = '';
    aplicarFiltrosNaves();
}

// 🧭 Detalle de nave
async function DetalleNave(id) {
    const root = document.getElementById("root");
    root.innerHTML = "<div class='loading'>Cargando nave...</div>";

    const data = await obtenerDetalleNave(id);

    if (!data) {
        root.innerHTML = "<p>Error al cargar la nave</p>";
        return;
    }

    const imgLocal = data.image;
    const isFav = esFavorito(id, 'nave');

    const detalle = document.createElement("div");
    detalle.className = "detalle-container nave-detalle";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Naves()">← Volver</button>

        <div class="detalle-header">
            <img src="${imgLocal}" alt="${data.name}" onerror="this.src='img/fallback.webp'">
            <div class="detalle-info">
                <h1>${data.name}</h1>
                <button class="btn-favorito ${isFav ? 'activo' : ''}" 
                        onclick="toggleFavorito('${id}', 'nave', '${data.name}')">
                    ${isFav ? '⭐ Favorito' : '☆ Añadir a Favoritos'}
                </button>

                <p style="color: #aaa; font-size: 1.1rem; margin-bottom: 1rem;">
                    "${data.name}" - ${data.starship_class}
                </p>

                <div class="stats">
                    <div class="stat-item"><span class="stat-label">Modelo:</span><span class="stat-value">${data.model}</span></div>
                    <div class="stat-item"><span class="stat-label">Fabricante:</span><span class="stat-value">${data.manufacturer}</span></div>
                    <div class="stat-item"><span class="stat-label">Clase:</span><span class="stat-value">${data.starship_class}</span></div>
                    <div class="stat-item"><span class="stat-label">Costo:</span><span class="stat-value">${data.cost_in_credits} créditos</span></div>
                    <div class="stat-item"><span class="stat-label">Velocidad:</span><span class="stat-value">${data.max_atmosphering_speed}</span></div>
                    <div class="stat-item"><span class="stat-label">Hiperpropulsor:</span><span class="stat-value">Clase ${data.hyperdrive_rating}</span></div>
                    <div class="stat-item"><span class="stat-label">MGLT:</span><span class="stat-value">${data.MGLT}</span></div>
                    <div class="stat-item"><span class="stat-label">Longitud:</span><span class="stat-value">${data.length} metros</span></div>
                    <div class="stat-item"><span class="stat-label">Tripulación:</span><span class="stat-value">${data.crew}</span></div>
                    <div class="stat-item"><span class="stat-label">Pasajeros:</span><span class="stat-value">${data.passengers}</span></div>
                    <div class="stat-item"><span class="stat-label">Carga:</span><span class="stat-value">${data.cargo_capacity} kg</span></div>
                    <div class="stat-item"><span class="stat-label">Consumibles:</span><span class="stat-value">${data.consumables}</span></div>
                </div>
            </div>
        </div>
    `;

    root.innerHTML = "";
    root.appendChild(detalle);
}