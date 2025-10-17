// Buscador de planetas
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

// Filtrar planetas por clima
function filtrarPlanetas(clima) {
    if (clima === 'todos') {
        actualizarListaPlanetas(planetas);
    } else {
        actualizarListaPlanetas(planetas);
    }
}

// Generar HTML de lista de planetas
function generarListaPlanetas(arrayPlanetas) {
    let listaHTML = "";
    
    for (let i = 0; i < arrayPlanetas.length; i++) {
        const id = arrayPlanetas[i].uid;
        const nombre = arrayPlanetas[i].name;
        const imgUrl = `${IMG_BASE}/planets/${id}.jpg`;
        
        listaHTML += `
        <div class="card-planeta" onclick="DetallePlaneta('${id}')">
            <img src="${imgUrl}" alt="${nombre}" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%8C%8D%20${nombre}%3C/text%3E%3C/svg%3E'">
            <h3>${nombre}</h3>
            <p>ID: ${id}</p>
        </div>`;
    }
    
    return listaHTML;
}

// Actualizar lista de planetas
function actualizarListaPlanetas(arrayPlanetas) {
    const contenedor = document.getElementById("lista-elementos");
    if (contenedor) {
        contenedor.innerHTML = generarListaPlanetas(arrayPlanetas);
    }
}

// Página principal de Planetas
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
    
    const contenedorFiltros = document.createElement("div");
    contenedorFiltros.className = "filtros-container";
    
    const filtros = [
        { texto: "Todos", valor: "todos" },
        { texto: "Árido", valor: "arid" },
        { texto: "Templado", valor: "temperate" },
        { texto: "Tropical", valor: "tropical" },
        { texto: "Congelado", valor: "frozen" }
    ];
    
    for (let i = 0; i < filtros.length; i++) {
        const btn = document.createElement("button");
        btn.className = "btn-filtro";
        btn.textContent = filtros[i].texto;
        btn.addEventListener("click", () => {
            filtrarPlanetas(filtros[i].valor);
        });
        contenedorFiltros.appendChild(btn);
    }
    
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
    root.appendChild(contenedorFiltros);
    root.appendChild(contenedorLista);
}

// Detalle de planeta
async function DetallePlaneta(id) {
    const root = document.getElementById("root");
    root.innerHTML = "<div class='loading'>Cargando planeta...</div>";
    
    const data = await obtenerDetallePlaneta(id);
    
    if (!data) {
        root.innerHTML = "<p>Error al cargar el planeta</p>";
        return;
    }
    
    const imgUrl = `${IMG_BASE}/planets/${id}.jpg`;
    const isFav = esFavorito(id, 'planeta');
    
    const fondos = {
        'arid': 'linear-gradient(135deg, #d4a574, #8b6f47)',
        'temperate': 'linear-gradient(135deg, #4a90e2, #50c878)',
        'frozen': 'linear-gradient(135deg, #a8d8ea, #e3f2fd)',
        'tropical': 'linear-gradient(135deg, #2ecc71, #27ae60)',
    };
    
    const detalle = document.createElement("div");
    detalle.className = "detalle-container";
    
    const clima = data.climate ? data.climate.split(',')[0].trim() : '';
    if (fondos[clima]) {
        detalle.style.background = fondos[clima];
    }
    
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Planetas()">← Volver</button>
        
        <div class="detalle-header">
            <img src="${imgUrl}" alt="${data.name}" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%231a1a1a%22 width=%22300%22 height=%22300%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2218%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%8C%8D%20${data.name}%3C/text%3E%3C/svg%3E'">
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