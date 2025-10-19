// =============================================================================
// 🧍‍♂️ PERSONAJES - Con filtros avanzados
// =============================================================================

// 🧱 Generar HTML de lista de personajes
function generarListaPersonajes(arrayPersonajes) {
    let listaHTML = "";

    for (let i = 0; i < arrayPersonajes.length; i++) {
        const id = arrayPersonajes[i].uid;
        const nombre = arrayPersonajes[i].name;
        const imgWebP = arrayPersonajes[i].image;

        listaHTML += `
        <div class="card-personaje" onclick="DetallePersonaje('${id}')">
            <img src="${imgWebP}" alt="${nombre}" onerror="this.src='img/fallback.webp'">
            <h3>${nombre}</h3>
            <p>#${id}</p>
        </div>`;
    }

    return listaHTML;
}

// 🔄 Actualizar lista de personajes
function actualizarListaPersonajes(arrayPersonajes) {
    const contenedor = document.getElementById("lista-elementos");
    if (contenedor) {
        contenedor.innerHTML = generarListaPersonajes(arrayPersonajes);
    }
}

// 🧍 Página principal de Personajes
async function Personajes() {
    const root = document.getElementById("root");
    root.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.className = "titulo-seccion";
    titulo.textContent = "🧍‍♂️ Personajes";

    const buscador = document.createElement("input");
    buscador.className = "buscador";
    buscador.type = "text";
    buscador.placeholder = "Buscar personaje (Luke, Vader, Leia...)";
    buscador.addEventListener("input", () => {
        aplicarFiltrosPersonajes();
    });

    // Filtros
    const filtrosContainer = document.createElement("div");
    filtrosContainer.className = "filtros-container";
    filtrosContainer.innerHTML = `
        <div class="filtro-grupo filtro-personaje">
            <label>⚧️ Género:</label>
            <select id="filtro-genero">
                <option value="">Todos</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="n/a">N/A</option>
                <option value="hermaphrodite">Hermafrodita</option>
            </select>
        </div>
        
        <div class="filtro-grupo filtro-personaje">
            <label>👁️ Color de ojos:</label>
            <select id="filtro-ojos">
                <option value="">Todos</option>
                <option value="blue">Azul</option>
                <option value="brown">Marrón</option>
                <option value="yellow">Amarillo</option>
                <option value="red">Rojo</option>
                <option value="black">Negro</option>
                <option value="unknown">Desconocido</option>
            </select>
        </div>
        
        <div class="filtro-grupo filtro-personaje">
            <label>📏 Altura:</label>
            <select id="filtro-altura">
                <option value="">Todas</option>
                <option value="bajo">Bajo (&lt;150cm)</option>
                <option value="medio">Medio (150-180cm)</option>
                <option value="alto">Alto (&gt;180cm)</option>
            </select>
        </div>
        
        <button class="btn-limpiar-filtros" onclick="limpiarFiltrosPersonajes()">🔄 Limpiar filtros</button>
    `;

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-elementos";

    if (personajes.length === 0) {
        contenedorLista.innerHTML = "<div class='loading'>Cargando personajes...</div>";
        await obtenerPersonajes();
    }

    contenedorLista.innerHTML = generarListaPersonajes(personajes);

    root.appendChild(titulo);
    root.appendChild(buscador);
    root.appendChild(filtrosContainer);
    root.appendChild(contenedorLista);

    // Event listeners para filtros
    document.getElementById("filtro-genero").addEventListener("change", aplicarFiltrosPersonajes);
    document.getElementById("filtro-ojos").addEventListener("change", aplicarFiltrosPersonajes);
    document.getElementById("filtro-altura").addEventListener("change", aplicarFiltrosPersonajes);
}

// Aplicar filtros de personajes
function aplicarFiltrosPersonajes() {
    const textoBusqueda = document.querySelector('.buscador').value.toLowerCase();
    const genero = document.getElementById("filtro-genero").value.toLowerCase();
    const ojos = document.getElementById("filtro-ojos").value.toLowerCase();
    const altura = document.getElementById("filtro-altura").value;

    const filtrados = personajes.filter(p => {
        const cumpleTexto = p.name.toLowerCase().includes(textoBusqueda);
        const cumpleGenero = !genero || p.gender?.toLowerCase() === genero;
        const cumpleOjos = !ojos || p.eye_color?.toLowerCase().includes(ojos);
        
        let cumpleAltura = true;
        if (altura) {
            const h = parseInt(p.height) || 0;
            if (altura === "bajo") cumpleAltura = h < 150 && h > 0;
            else if (altura === "medio") cumpleAltura = h >= 150 && h <= 180;
            else if (altura === "alto") cumpleAltura = h > 180;
        }

        return cumpleTexto && cumpleGenero && cumpleOjos && cumpleAltura;
    });

    actualizarListaPersonajes(filtrados);
}

// Limpiar filtros de personajes
function limpiarFiltrosPersonajes() {
    document.querySelector('.buscador').value = '';
    document.getElementById("filtro-genero").value = '';
    document.getElementById("filtro-ojos").value = '';
    document.getElementById("filtro-altura").value = '';
    aplicarFiltrosPersonajes();
}

// 💫 Detalle de personaje
async function DetallePersonaje(id) {
    const root = document.getElementById("root");
    root.innerHTML = "<div class='loading'>Cargando personaje...</div>";

    const data = await obtenerDetallePersonaje(id);

    if (!data) {
        root.innerHTML = "<p>Error al cargar el personaje</p>";
        return;
    }

    const imgLocal = data.image;
    const isFav = esFavorito(id, 'personaje');

    const detalle = document.createElement("div");
    detalle.className = "detalle-container";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Personajes()">← Volver</button>

        <div class="detalle-header">
             <img src="${imgLocal}" alt="${data.name}" onerror="this.src='img/fallback.webp'">
            <div class="detalle-info">
                <h1>${data.name}</h1>
                <button class="btn-favorito ${isFav ? 'activo' : ''}"
                        onclick="toggleFavorito('${id}', 'personaje', '${data.name}')">
                    ${isFav ? '⭐ Favorito' : '☆ Añadir a Favoritos'}
                </button>

                <div class="stats">
                    <div class="stat-item"><span class="stat-label">Altura:</span><span class="stat-value">${data.height} cm</span></div>
                    <div class="stat-item"><span class="stat-label">Peso:</span><span class="stat-value">${data.mass} kg</span></div>
                    <div class="stat-item"><span class="stat-label">Género:</span><span class="stat-value">${data.gender}</span></div>
                    <div class="stat-item"><span class="stat-label">Año de nacimiento:</span><span class="stat-value">${data.birth_year}</span></div>
                    <div class="stat-item"><span class="stat-label">Color de ojos:</span><span class="stat-value">${data.eye_color}</span></div>
                    <div class="stat-item"><span class="stat-label">Color de cabello:</span><span class="stat-value">${data.hair_color}</span></div>
                    <div class="stat-item"><span class="stat-label">Color de piel:</span><span class="stat-value">${data.skin_color}</span></div>
                </div>
            </div>
        </div>
    `;

    root.innerHTML = "";
    root.appendChild(detalle);
}

// ⭐ Toggle favorito
function toggleFavorito(uid, tipo, nombre) {
    if (esFavorito(uid, tipo)) {
        eliminarFavorito(uid, tipo);
    } else {
        agregarFavorito({ uid, tipo, nombre });
    }

    if (tipo === 'personaje') {
        DetallePersonaje(uid);
    } else if (tipo === 'planeta') {
        DetallePlaneta(uid);
    } else if (tipo === 'nave') {
        DetalleNave(uid);
    } else if (tipo === 'especie') {
        DetalleEspecie(uid);
    } else if (tipo === 'vehiculo') {
        DetalleVehiculo(uid);
    }
}