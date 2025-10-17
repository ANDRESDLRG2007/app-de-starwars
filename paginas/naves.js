// Buscador de naves
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

// Filtrar naves por clase
function filtrarNaves(clase) {
    if (clase === 'todos') {
        actualizarListaNaves(naves);
    } else {
        actualizarListaNaves(naves);
    }
}

// Generar HTML de lista de naves
function generarListaNaves(arrayNaves) {
    let listaHTML = "";
    
    for (let i = 0; i < arrayNaves.length; i++) {
        const id = arrayNaves[i].uid;
        const nombre = arrayNaves[i].name;
        const imgUrl = `${IMG_BASE}/starships/${id}.jpg`;
        
        listaHTML += `
        <div class="card-nave" onclick="DetalleNave('${id}')">
            <img src="${imgUrl}" alt="${nombre}" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22300%22 height=%22200%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%9A%80%20${nombre}%3C/text%3E%3C/svg%3E'">
            <h3>${nombre}</h3>
            <p>ID: ${id}</p>
        </div>`;
    }
    
    return listaHTML;
}

// Actualizar lista de naves
function actualizarListaNaves(arrayNaves) {
    const contenedor = document.getElementById("lista-elementos");
    if (contenedor) {
        contenedor.innerHTML = generarListaNaves(arrayNaves);
    }
}

// Página principal de Naves
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
    
    const contenedorFiltros = document.createElement("div");
    contenedorFiltros.className = "filtros-container";
    
    const filtros = [
        { texto: "Todas", valor: "todos" },
        { texto: "Carguero", valor: "cargo" },
        { texto: "Cazas", valor: "fighter" },
        { texto: "Crucero", valor: "cruiser" },
        { texto: "Destructor", valor: "destroyer" }
    ];
    
    for (let i = 0; i < filtros.length; i++) {
        const btn = document.createElement("button");
        btn.className = "btn-filtro";
        btn.textContent = filtros[i].texto;
        btn.addEventListener("click", () => {
            filtrarNaves(filtros[i].valor);
        });
        contenedorFiltros.appendChild(btn);
    }
    
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
    root.appendChild(contenedorFiltros);
    root.appendChild(contenedorLista);
}

// Detalle de nave
async function DetalleNave(id) {
    const root = document.getElementById("root");
    root.innerHTML = "<div class='loading'>Cargando nave...</div>";
    
    const data = await obtenerDetalleNave(id);
    
    if (!data) {
        root.innerHTML = "<p>Error al cargar la nave</p>";
        return;
    }
    
    const imgUrl = `${IMG_BASE}/starships/${id}.jpg`;
    const isFav = esFavorito(id, 'nave');
    
    const detalle = document.createElement("div");
    detalle.className = "detalle-container nave-detalle";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Naves()">← Volver</button>
        
        <div class="detalle-header">
            <img src="${imgUrl}" alt="${data.name}" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%231a1a1a%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2218%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%9A%80%20${data.name}%3C/text%3E%3C/svg%3E'">
            <div class="detalle-info">
                <h1>${data.name}</h1>
                <button class="btn-favorito ${isFav ? 'activo' : ''}" 
                        onclick="toggleFavorito('${id}', 'nave', '${data.name}')">
                    ${isFav ? '⭐ Favorito' : '☆ Añadir a Favoritos'}
                </button>
                
                <p class="descripcion-nave">
                    "${data.name}" - ${data.starship_class}
                </p>
                
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-label">Modelo:</span>
                        <span class="stat-value">${data.model}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Fabricante:</span>
                        <span class="stat-value">${data.manufacturer}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Clase:</span>
                        <span class="stat-value">${data.starship_class}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Costo:</span>
                        <span class="stat-value">${data.cost_in_credits} créditos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Velocidad:</span>
                        <span class="stat-value">${data.max_atmosphering_speed}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Hiperpropulsor:</span>
                        <span class="stat-value">Clase ${data.hyperdrive_rating}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">MGLT:</span>
                        <span class="stat-value">${data.MGLT}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Longitud:</span>
                        <span class="stat-value">${data.length} metros</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Tripulación:</span>
                        <span class="stat-value">${data.crew}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Pasajeros:</span>
                        <span class="stat-value">${data.passengers}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Carga:</span>
                        <span class="stat-value">${data.cargo_capacity} kg</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Consumibles:</span>
                        <span class="stat-value">${data.consumables}</span>
                    </div>
                </div>
                
                <div class="nota-sonido">
                    💡 Tip: Imagina el sonido del motor de esta nave legendaria
                </div>
            </div>
        </div>
    `;
    
    root.innerHTML = "";
    root.appendChild(detalle);
}