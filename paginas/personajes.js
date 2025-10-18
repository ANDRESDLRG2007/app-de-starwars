// 🧠 Obtener imagen de personaje desde la API de GitHub o usar placeholder
function obtenerImagenPersonaje(nombre, id) {
    if (typeof obtenerImagen === "function") {
        // Usa la función global definida en conexion.js
        return obtenerImagen(nombre, 'characters', id);
    } else {
        // Fallback si la función global no está disponible aún
        return obtenerImagenPorDefecto('characters', nombre, id);
    }
}

// 🔍 Buscador de personajes
function buscarPersonajes(texto) {
    if (texto.length >= 3) {
        const filtrados = personajes.filter(p =>
            p.name.toLowerCase().includes(texto.toLowerCase())
        );
        actualizarListaPersonajes(filtrados);
    } else {
        actualizarListaPersonajes(personajes);
    }
}

// 🧱 Generar HTML de lista de personajes
function generarListaPersonajes(arrayPersonajes) {
    let listaHTML = "";

    for (let i = 0; i < arrayPersonajes.length; i++) {
        const id = arrayPersonajes[i].uid;
        const nombre = arrayPersonajes[i].name;
        const imgUrl = obtenerImagenPersonaje(nombre, id);
        const placeholder = obtenerImagenPorDefecto('characters', nombre, id);

        listaHTML += `
        <div class="card-personaje" onclick="DetallePersonaje('${id}')">
            <img src="${imgUrl}" alt="${nombre}" onerror="this.src='${placeholder}'">
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
        buscarPersonajes(buscador.value);
    });

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
    root.appendChild(contenedorLista);
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

    const imgUrl = obtenerImagenPersonaje(data.name, id);
    const placeholder = obtenerImagenPorDefecto('characters', data.name, id);
    const isFav = esFavorito(id, 'personaje');

    const detalle = document.createElement("div");
    detalle.className = "detalle-container";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Personajes()">← Volver</button>

        <div class="detalle-header">
            <img src="${imgUrl}" alt="${data.name}" onerror="this.src='${placeholder}'">
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
    }
}
