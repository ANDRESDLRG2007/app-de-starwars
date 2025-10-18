// =============================================================================
// 🪐 PLANETAS - Sistema con cascada de imágenes
// =============================================================================

// 🔍 Buscar planetas
function buscarPlanetas(texto) {
    if (texto.length >= 3) {
        const filtrados = planetas.filter(p =>
            p.name.toLowerCase().includes(texto.toLowerCase())
        );
        actualizarListaPlanetas(filtrados);
    } else {
        actualizarListaPlanetas(planetas);
    }
}

// 🧩 Generar HTML de lista de planetas con cascada
function generarListaPlanetas(arrayPlanetas) {
    let listaHTML = "";

    for (let i = 0; i < arrayPlanetas.length; i++) {
        const id = arrayPlanetas[i].uid;
        const nombre = arrayPlanetas[i].name;
        
        const imgWebP = arrayPlanetas[i].image;
        const imgJPG = arrayPlanetas[i].imageJPG;
        const imgGitHub = arrayPlanetas[i].imageGitHub;
        const imgFallback = arrayPlanetas[i].imageFallback;
        const attrOnerror = generarAtributoOnerror(imgJPG, imgGitHub, imgFallback);

        listaHTML += `
        <div class="card-planeta" onclick="DetallePlaneta('${id}')">
            <img src="${imgWebP}" alt="${nombre}" ${attrOnerror}>
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

// 🌍 Página principal de Planetas
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
        buscarPlanetas(buscador.value);
    });

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-elementos";

    if (planetas.length === 0) {
        contenedorLista.innerHTML = "<div class='loading'>Cargando planetas...</div>";
        await obtenerPlanetas();
    }

    contenedorLista.innerHTML = generarListaPlanetas(planetas);

    root.appendChild(titulo);
    root.appendChild(buscador);
    root.appendChild(contenedorLista);
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
    const imgGitHub = data.imageGitHub;
    const imgFallback = data.imageFallback;
    const attrOnerror = generarAtributoOnerror(imgGitHub, imgFallback);
    const isFav = esFavorito(id, 'planeta');

    const detalle = document.createElement("div");
    detalle.className = "detalle-container";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Planetas()">← Volver</button>

        <div class="detalle-header">
            <img src="${imgLocal}" alt="${data.name}" ${attrOnerror}>
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