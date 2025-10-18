// 🔍 Buscar naves
function buscarNaves(texto) {
    if (texto.length >= 3) {
        const filtrados = naves.filter(n =>
            n.name.toLowerCase().includes(texto.toLowerCase())
        );
        actualizarListaNaves(filtrados);
    } else {
        actualizarListaNaves(naves);
    }
}

// 🚀 Obtener imagen de GitHub o placeholder
function obtenerImagenNave(nombre, id) {
    if (typeof obtenerImagen === "function") {
        // Usa la función global definida en conexion.js
        return obtenerImagen(nombre, 'starships', id);
    } else {
        // Fallback, si se carga antes de conexion.js
        return obtenerImagenPorDefecto('starships', nombre, id);
    }
}

// 🧩 Generar HTML de lista de naves
function generarListaNaves(arrayNaves) {
    let listaHTML = "";

    for (let i = 0; i < arrayNaves.length; i++) {
        const id = arrayNaves[i].uid;
        const nombre = arrayNaves[i].name;
        const imgUrl = obtenerImagenNave(nombre, id);
        const placeholder = obtenerImagenPorDefecto('starships', nombre, id);

        listaHTML += `
        <div class="card-nave" onclick="DetalleNave('${id}')">
            <img src="${imgUrl}" alt="${nombre}" onerror="this.src='${placeholder}'">
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

// 🚀 Página principal de Naves
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
        buscarNaves(buscador.value);
    });

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-elementos";

    if (naves.length === 0) {
        contenedorLista.innerHTML = "<div class='loading'>Cargando naves...</div>";
        await obtenerNaves();
    }

    contenedorLista.innerHTML = generarListaNaves(naves);

    root.appendChild(titulo);
    root.appendChild(buscador);
    root.appendChild(contenedorLista);
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

    const nombre = data.name;
    const imgUrl = obtenerImagenNave(nombre, id);
    const placeholder = obtenerImagenPorDefecto('starships', nombre, id);
    const isFav = esFavorito(id, 'nave');

    const detalle = document.createElement("div");
    detalle.className = "detalle-container nave-detalle";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Naves()">← Volver</button>

        <div class="detalle-header">
            <img src="${imgUrl}" alt="${nombre}" onerror="this.src='${placeholder}'">
            <div class="detalle-info">
                <h1>${nombre}</h1>
                <button class="btn-favorito ${isFav ? 'activo' : ''}" 
                        onclick="toggleFavorito('${id}', 'nave', '${nombre}')">
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
