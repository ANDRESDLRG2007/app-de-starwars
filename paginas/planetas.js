// =============================================================================
// 🪐 PLANETAS - Con carga perezosa
// =============================================================================

// 🧩 Generar HTML de lista de planetas
function generarListaPlanetas(arrayPlanetas) {
    let listaHTML = "";

    for (let i = 0; i < arrayPlanetas.length; i++) {
        const id = arrayPlanetas[i].uid;
        const nombre = arrayPlanetas[i].name;
        const imgWebP = arrayPlanetas[i].image;

        listaHTML += `
        <div class="card-planeta" onclick="DetallePlaneta('${id}')">
            <img src="${imgWebP}" alt="${nombre}" onerror="this.src='img/fallback.webp'">
            <h3>${nombre}</h3>
            <p>ID: ${id}</p>
        </div>`;
    }

    return listaHTML;
}

// 🔁 Actualizar lista
function actualizarListaPlanetas(arrayPlanetas) {
    const contenedor = document.getElementById("lista-elementos");
    if (contenedor) {
        contenedor.innerHTML = generarListaPlanetas(arrayPlanetas);
    }
}

// 🌍 Página principal de Planetas - CON CARGA PEREZOSA
async function Planetas() {
    const root = document.getElementById("root");
    root.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.className = "titulo-seccion";
    titulo.textContent = "🌍 Planetas";

    const buscador = document.createElement("input");
    buscador.className = "buscador";
    buscador.type = "text";
    buscador.placeholder = "Buscar planeta (Tatooine, Hoth, Endor...)";
    buscador.addEventListener("input", () => {
        aplicarFiltrosPlanetas();
    });

    // Filtros
    const filtrosContainer = document.createElement("div");
    filtrosContainer.className = "filtros-container";
    filtrosContainer.innerHTML = `
        <div class="filtro-grupo filtro-planeta">
            <label>🌡️ Clima:</label>
            <select id="filtro-clima">
                <option value="">Todos</option>
                <option value="arid">Árido</option>
                <option value="temperate">Templado</option>
                <option value="frozen">Helado</option>
                <option value="tropical">Tropical</option>
                <option value="murky">Turbio</option>
            </select>
        </div>
        
        <div class="filtro-grupo filtro-planeta">
            <label>🏔️ Terreno:</label>
            <select id="filtro-terreno">
                <option value="">Todos</option>
                <option value="desert">Desierto</option>
                <option value="grasslands">Praderas</option>
                <option value="mountains">Montañas</option>
                <option value="jungle">Jungla</option>
                <option value="forests">Bosques</option>
                <option value="ocean">Océano</option>
            </select>
        </div>
        
        <div class="filtro-grupo filtro-planeta">
            <label>👥 Población:</label>
            <select id="filtro-poblacion">
                <option value="">Todas</option>
                <option value="deshabitado">Deshabitado</option>
                <option value="bajo">Baja (&lt;1M)</option>
                <option value="medio">Media (1M-1B)</option>
                <option value="alto">Alta (&gt;1B)</option>
            </select>
        </div>
        
        <button class="btn-limpiar-filtros" onclick="limpiarFiltrosPlanetas()">🔄 Limpiar filtros</button>
    `;

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-elementos";

    // ⚡ CARGA PEREZOSA: Si no están los detalles, cargarlos ahora
    if (!planetasDetallesCargados) {
        contenedorLista.innerHTML = "<div class='loading'>⏳ Cargando detalles de planetas...</div>";
        root.appendChild(titulo);
        root.appendChild(buscador);
        root.appendChild(filtrosContainer);
        root.appendChild(contenedorLista);
        
        await cargarDetallesPlanetas();
    }

    contenedorLista.innerHTML = generarListaPlanetas(planetas);

    root.innerHTML = "";
    root.appendChild(titulo);
    root.appendChild(buscador);
    root.appendChild(filtrosContainer);
    root.appendChild(contenedorLista);

    // Event listeners para filtros
    document.getElementById("filtro-clima").addEventListener("change", aplicarFiltrosPlanetas);
    document.getElementById("filtro-terreno").addEventListener("change", aplicarFiltrosPlanetas);
    document.getElementById("filtro-poblacion").addEventListener("change", aplicarFiltrosPlanetas);
}

// Aplicar filtros de planetas
function aplicarFiltrosPlanetas() {
    const textoBusqueda = document.querySelector('.buscador').value.toLowerCase();
    const clima = document.getElementById("filtro-clima").value.toLowerCase();
    const terreno = document.getElementById("filtro-terreno").value.toLowerCase();
    const poblacion = document.getElementById("filtro-poblacion").value;

    const filtrados = planetas.filter(p => {
        const cumpleTexto = p.name.toLowerCase().includes(textoBusqueda);
        const cumpleClima = !clima || (p.climate && p.climate.toLowerCase().includes(clima));
        const cumpleTerr = !terreno || (p.terrain && p.terrain.toLowerCase().includes(terreno));
        
        let cumplePoblacion = true;
        if (poblacion) {
            const popStr = p.population ? p.population.toString().replace(/,/g, '') : "0";
            const pop = parseInt(popStr) || 0;
            
            if (poblacion === "deshabitado") {
                cumplePoblacion = pop === 0 || p.population === "unknown" || p.population === "0";
            } else if (poblacion === "bajo") {
                cumplePoblacion = pop > 0 && pop < 1000000;
            } else if (poblacion === "medio") {
                cumplePoblacion = pop >= 1000000 && pop <= 1000000000;
            } else if (poblacion === "alto") {
                cumplePoblacion = pop > 1000000000;
            }
        }

        return cumpleTexto && cumpleClima && cumpleTerr && cumplePoblacion;
    });

    actualizarListaPlanetas(filtrados);
}

// Limpiar filtros de planetas
function limpiarFiltrosPlanetas() {
    document.querySelector('.buscador').value = '';
    document.getElementById("filtro-clima").value = '';
    document.getElementById("filtro-terreno").value = '';
    document.getElementById("filtro-poblacion").value = '';
    aplicarFiltrosPlanetas();
}

// 🧭 Detalle de planeta
async function DetallePlaneta(id) {
    const root = document.getElementById("root");
    root.innerHTML = "<div class='loading'>Cargando planeta...</div>";

    const data = await obtenerDetallePlaneta(id);

    if (!data) {
        root.innerHTML = "<p>Error al cargar el planeta</p>";
        return;
    }

    const imgLocal = data.image;
    const isFav = esFavorito(id, 'planeta');

    const detalle = document.createElement("div");
    detalle.className = "detalle-container";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Planetas()">← Volver</button>

        <div class="detalle-header">
            <img src="${imgLocal}" alt="${data.name}" onerror="this.src='img/fallback.webp'">
            <div class="detalle-info">
                <h1>${data.name}</h1>
                <button class="btn-favorito ${isFav ? 'activo' : ''}" 
                        onclick="toggleFavorito('${id}', 'planeta', '${data.name}')">
                    ${isFav ? '⭐ Favorito' : '☆ Añadir a Favoritos'}
                </button>

                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-label">Clima:</span>
                        <span class="stat-value">${data.climate}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Terreno:</span>
                        <span class="stat-value">${data.terrain}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Población:</span>
                        <span class="stat-value">${data.population}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Diámetro:</span>
                        <span class="stat-value">${data.diameter} km</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Período de rotación:</span>
                        <span class="stat-value">${data.rotation_period} horas</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Período orbital:</span>
                        <span class="stat-value">${data.orbital_period} días</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Gravedad:</span>
                        <span class="stat-value">${data.gravity}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Agua superficial:</span>
                        <span class="stat-value">${data.surface_water}%</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    root.innerHTML = "";
    root.appendChild(detalle);
}