// =============================================================================
// 👽 ESPECIES - Sistema con cascada de imágenes
// =============================================================================

// 🔍 Buscar especies
function buscarEspecies(texto) {
    if (texto.length >= 3) {
        const filtrados = especies.filter(e =>
            e.name.toLowerCase().includes(texto.toLowerCase())
        );
        actualizarListaEspecies(filtrados);
    } else {
        actualizarListaEspecies(especies);
    }
}

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

// 👽 Página principal de Especies
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
        buscarEspecies(buscador.value);
    });

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-elementos";

    if (especies.length === 0) {
        contenedorLista.innerHTML = "<div class='loading'>Cargando especies...</div>";
        await obtenerEspecies();
    }

    contenedorLista.innerHTML = generarListaEspecies(especies);

    root.appendChild(titulo);
    root.appendChild(buscador);
    root.appendChild(contenedorLista);
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