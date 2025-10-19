// =============================================================================
// 👽 ESPECIES - Con carga perezosa
// =============================================================================

// 🧩 Generar HTML de lista de especies
function generarListaEspecies(arrayEspecies) {
    let listaHTML = "";

    for (let i = 0; i < arrayEspecies.length; i++) {
        const id = arrayEspecies[i].uid;
        const nombre = arrayEspecies[i].name;
        const imgWebP = arrayEspecies[i].image;

        listaHTML += `
        <div class="card-especie" onclick="DetalleEspecie('${id}')">
            <img src="${imgWebP}" alt="${nombre}" onerror="this.src='img/fallback.webp'">
            <h3>${nombre}</h3>
            <p>ID: ${id}</p>
        </div>`;
    }

    return listaHTML;
}

// 🔁 Actualizar lista
function actualizarListaEspecies(arrayEspecies) {
    const contenedor = document.getElementById("lista-elementos");
    if (contenedor) {
        contenedor.innerHTML = generarListaEspecies(arrayEspecies);
    }
}

// 👽 Página principal de Especies - CON CARGA PEREZOSA
async function Especies() {
    const root = document.getElementById("root");
    root.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.className = "titulo-seccion";
    titulo.textContent = "👽 Especies";

    const buscador = document.createElement("input");
    buscador.className = "buscador";
    buscador.type = "text";
    buscador.placeholder = "Buscar especie (Wookiee, Droid, Ewok...)";
    buscador.addEventListener("input", () => {
        aplicarFiltrosEspecies();
    });

    // Filtros
    const filtrosContainer = document.createElement("div");
    filtrosContainer.className = "filtros-container";
    filtrosContainer.innerHTML = `
        <div class="filtro-grupo filtro-especie">
            <label>🧬 Clasificación:</label>
            <select id="filtro-clasificacion">
                <option value="">Todas</option>
                <option value="mammal">Mamífero</option>
                <option value="reptile">Reptil</option>
                <option value="artificial">Artificial</option>
                <option value="sentient">Consciente</option>
            </select>
        </div>
        
        <div class="filtro-grupo filtro-especie">
            <label>🧠 Designación:</label>
            <select id="filtro-designacion">
                <option value="">Todas</option>
                <option value="sentient">Sensible</option>
                <option value="reptilian">Reptiliana</option>
            </select>
        </div>
        
        <button class="btn-limpiar-filtros" onclick="limpiarFiltrosEspecies()">🔄 Limpiar filtros</button>
    `;

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-elementos";

    // ⚡ CARGA PEREZOSA: Si no están los detalles, cargarlos ahora
    if (!especiesDetallesCargados) {
        contenedorLista.innerHTML = "<div class='loading'>⏳ Cargando detalles de especies...</div>";
        root.appendChild(titulo);
        root.appendChild(buscador);
        root.appendChild(filtrosContainer);
        root.appendChild(contenedorLista);
        
        await cargarDetallesEspecies();
    }

    contenedorLista.innerHTML = generarListaEspecies(especies);

    root.innerHTML = "";
    root.appendChild(titulo);
    root.appendChild(buscador);
    root.appendChild(filtrosContainer);
    root.appendChild(contenedorLista);

    // Event listeners para filtros
    document.getElementById("filtro-clasificacion").addEventListener("change", aplicarFiltrosEspecies);
    document.getElementById("filtro-designacion").addEventListener("change", aplicarFiltrosEspecies);
}

// Aplicar filtros de especies
function aplicarFiltrosEspecies() {
    const textoBusqueda = document.querySelector('.buscador').value.toLowerCase();
    const clasificacion = document.getElementById("filtro-clasificacion").value.toLowerCase();
    const designacion = document.getElementById("filtro-designacion").value.toLowerCase();

    const filtradas = especies.filter(e => {
        const cumpleTexto = e.name.toLowerCase().includes(textoBusqueda);
        const cumpleClasificacion = !clasificacion || e.classification?.toLowerCase().includes(clasificacion);
        const cumpleDesignacion = !designacion || e.designation?.toLowerCase().includes(designacion);

        return cumpleTexto && cumpleClasificacion && cumpleDesignacion;
    });

    actualizarListaEspecies(filtradas);
}

// Limpiar filtros de especies
function limpiarFiltrosEspecies() {
    document.querySelector('.buscador').value = '';
    document.getElementById("filtro-clasificacion").value = '';
    document.getElementById("filtro-designacion").value = '';
    aplicarFiltrosEspecies();
}

// 🧭 Detalle de especie
async function DetalleEspecie(id) {
    const root = document.getElementById("root");
    root.innerHTML = "<div class='loading'>Cargando especie...</div>";

    const data = await obtenerDetalleEspecie(id);

    if (!data) {
        root.innerHTML = "<p>Error al cargar la especie</p>";
        return;
    }

    const imgLocal = data.image;
    const isFav = esFavorito(id, 'especie');

    const detalle = document.createElement("div");
    detalle.className = "detalle-container especie-detalle";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Especies()">← Volver</button>

        <div class="detalle-header">
            <img src="${imgLocal}" alt="${data.name}" onerror="this.src='img/fallback.webp'">
            <div class="detalle-info">
                <h1>${data.name}</h1>
                <button class="btn-favorito ${isFav ? 'activo' : ''}" 
                        onclick="toggleFavorito('${id}', 'especie', '${data.name}')">
                    ${isFav ? '⭐ Favorito' : '☆ Añadir a Favoritos'}
                </button>

                <p style="color: #aaa; font-size: 1.1rem; margin-bottom: 1rem;">
                    "${data.name}" - ${data.classification}
                </p>

                <div class="stats">
                    <div class="stat-item"><span class="stat-label">Clasificación:</span><span class="stat-value">${data.classification}</span></div>
                    <div class="stat-item"><span class="stat-label">Designación:</span><span class="stat-value">${data.designation}</span></div>
                    <div class="stat-item"><span class="stat-label">Altura promedio:</span><span class="stat-value">${data.average_height} cm</span></div>
                    <div class="stat-item"><span class="stat-label">Esperanza de vida:</span><span class="stat-value">${data.average_lifespan} años</span></div>
                    <div class="stat-item"><span class="stat-label">Color de ojos:</span><span class="stat-value">${data.eye_colors}</span></div>
                    <div class="stat-item"><span class="stat-label">Color de cabello:</span><span class="stat-value">${data.hair_colors}</span></div>
                    <div class="stat-item"><span class="stat-label">Color de piel:</span><span class="stat-value">${data.skin_colors}</span></div>
                    <div class="stat-item"><span class="stat-label">Lenguaje:</span><span class="stat-value">${data.language}</span></div>
                </div>
            </div>
        </div>
    `;

    root.innerHTML = "";
    root.appendChild(detalle);
}