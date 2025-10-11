// Buscador de personajes
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

// Filtrar personajes por género
function filtrarPersonajes(genero) {
    if (genero === 'todos') {
        actualizarListaPersonajes(personajes);
    } else {
        const filtrados = personajes;
        actualizarListaPersonajes(filtrados);
    }
}

// Generar HTML de lista de personajes
function generarListaPersonajes(arrayPersonajes) {
    let listaHTML = "";
    
    for (let i = 0; i < arrayPersonajes.length; i++) {
        const id = arrayPersonajes[i].uid;
        const nombre = arrayPersonajes[i].name;
        const imgUrl = `${IMG_BASE}/characters/${id}.jpg`;
        
        listaHTML += `
        <div class="card-personaje" onclick="DetallePersonaje('${id}')">
            <img src="${imgUrl}" alt="${nombre}" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22300%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22300%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%A7%8D%E2%80%8D%E2%99%82%EF%B8%8F%20${nombre}%3C/text%3E%3C/svg%3E'">
            <h3>${nombre}</h3>
            <p>#${id}</p>
        </div>`;
    }
    
    return listaHTML;
}

// Actualizar lista de personajes
function actualizarListaPersonajes(arrayPersonajes) {
    const contenedor = document.getElementById("lista-elementos");
    if (contenedor) {
        contenedor.innerHTML = generarListaPersonajes(arrayPersonajes);
    }
}

// Página principal de Personajes
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
    
    const contenedorFiltros = document.createElement("div");
    contenedorFiltros.className = "filtros-container";
    
    const filtros = [
        { texto: "Todos", valor: "todos" },
        { texto: "Masculino", valor: "male" },
        { texto: "Femenino", valor: "female" },
        { texto: "Otros", valor: "n/a" }
    ];
    
    for (let i = 0; i < filtros.length; i++) {
        const btn = document.createElement("button");
        btn.className = "btn-filtro";
        btn.textContent = filtros[i].texto;
        btn.addEventListener("click", () => {
            filtrarPersonajes(filtros[i].valor);
        });
        contenedorFiltros.appendChild(btn);
    }
    
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
    root.appendChild(contenedorFiltros);
    root.appendChild(contenedorLista);
}

// Detalle de personaje
async function DetallePersonaje(id) {
    const root = document.getElementById("root");
    root.innerHTML = "<div class='loading'>Cargando...</div>";
    
    const data = await obtenerDetallePersonaje(id);
    
    if (!data) {
        root.innerHTML = "<p>Error al cargar el personaje</p>";
        return;
    }
    
    const imgUrl = `${IMG_BASE}/characters/${id}.jpg`;
    const isFav = esFavorito(id, 'personaje');
    
    const frases = {
        '1': '"Help me, Obi-Wan Kenobi. You\'re my only hope." - Leia',
        '4': '"I am your father." - Darth Vader',
        '5': '"Do. Or do not. There is no try." - Yoda',
        '10': '"Never tell me the odds!" - Han Solo',
        '13': '"I\'ve got a bad feeling about this." - Luke',
    };
    
    const detalle = document.createElement("div");
    detalle.className = "detalle-container";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Personajes()">← Volver</button>
        
        <div class="detalle-header">
            <img src="${imgUrl}" alt="${data.name}" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22400%22%3E%3Crect fill=%22%231a1a1a%22 width=%22300%22 height=%22400%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2218%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%A7%8D%E2%80%8D%E2%99%82%EF%B8%8F%20${data.name}%3C/text%3E%3C/svg%3E'">
            <div class="detalle-info">
                <h1>${data.name}</h1>
                <button class="btn-favorito ${isFav ? 'activo' : ''}" 
                        onclick="toggleFavorito('${id}', 'personaje', '${data.name}')">
                    ${isFav ? '⭐ Favorito' : '☆ Añadir a Favoritos'}
                </button>
                
                ${frases[id] ? `<p class="frase-famosa">${frases[id]}</p>` : ''}
                
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-label">Altura:</span>
                        <span class="stat-value">${data.height} cm</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Peso:</span>
                        <span class="stat-value">${data.mass} kg</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Género:</span>
                        <span class="stat-value">${data.gender}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Año de nacimiento:</span>
                        <span class="stat-value">${data.birth_year}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Color de ojos:</span>
                        <span class="stat-value">${data.eye_color}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Color de cabello:</span>
                        <span class="stat-value">${data.hair_color}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Color de piel:</span>
                        <span class="stat-value">${data.skin_color}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    root.innerHTML = "";
    root.appendChild(detalle);
}