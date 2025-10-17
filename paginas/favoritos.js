// Toggle favorito (agregar/quitar)
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

// Generar HTML de favoritos
function generarListaFavoritos() {
    if (favoritos.length === 0) {
        return `
            <div class="sin-favoritos">
                <h2>⭐ Sin favoritos aún</h2>
                <p>Explora personajes, planetas y naves para añadirlos a tus favoritos</p>
                <div class="accesos-rapidos">
                    <button onclick="Personajes()">Ver Personajes</button>
                    <button onclick="Planetas()">Ver Planetas</button>
                    <button onclick="Naves()">Ver Naves</button>
                </div>
            </div>
        `;
    }
    
    let listaHTML = "";
    
    for (let i = 0; i < favoritos.length; i++) {
        const fav = favoritos[i];
        let imgUrl = "";
        let clickFunction = "";
        let icono = "";
        let placeholder = "";
        
        if (fav.tipo === 'personaje') {
            imgUrl = `${IMG_BASE}/characters/${fav.uid}.jpg`;
            clickFunction = `DetallePersonaje('${fav.uid}')`;
            icono = "🧍‍♂️";
            placeholder = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%A7%8D%E2%80%8D%E2%99%82%EF%B8%8F%20${fav.nombre}%3C/text%3E%3C/svg%3E`;
        } else if (fav.tipo === 'planeta') {
            imgUrl = `${IMG_BASE}/planets/${fav.uid}.jpg`;
            clickFunction = `DetallePlaneta('${fav.uid}')`;
            icono = "🌍";
            placeholder = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%8C%8D%20${fav.nombre}%3C/text%3E%3C/svg%3E`;
        } else if (fav.tipo === 'nave') {
            imgUrl = `${IMG_BASE}/starships/${fav.uid}.jpg`;
            clickFunction = `DetalleNave('${fav.uid}')`;
            icono = "🚀";
            placeholder = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%9A%80%20${fav.nombre}%3C/text%3E%3C/svg%3E`;
        }
        
        listaHTML += `
        <div class="card-favorito">
            <button class="btn-eliminar-fav" onclick="eliminarYActualizar('${fav.uid}', '${fav.tipo}')">
                ✕
            </button>
            <div onclick="${clickFunction}" style="cursor: pointer;">
                <img src="${imgUrl}" alt="${fav.nombre}" 
                     onerror="this.onerror=null; this.src='${placeholder}'">
                <h3>${icono} ${fav.nombre}</h3>
                <p class="tipo-favorito">${fav.tipo}</p>
            </div>
        </div>`;
    }
    
    return listaHTML;
}

// Eliminar favorito y actualizar vista
function eliminarYActualizar(uid, tipo) {
    eliminarFavorito(uid, tipo);
    Favoritos();
}

// Limpiar todos los favoritos
function limpiarFavoritos() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
        favoritos = [];
        Favoritos();
    }
}

// Página principal de Favoritos
function Favoritos() {
    const root = document.getElementById("root");
    root.innerHTML = "";
    
    const titulo = document.createElement("h1");
    titulo.className = "titulo-seccion";
    titulo.textContent = "⭐ Mis Favoritos";
    
    const contador = document.createElement("div");
    contador.className = "contador-favoritos";
    contador.innerHTML = `
        <p>Tienes <strong>${favoritos.length}</strong> favorito(s)</p>
        ${favoritos.length > 0 ? '<button class="btn-limpiar" onclick="limpiarFavoritos()">🗑️ Limpiar todos</button>' : ''}
    `;
    
    const contenedorFiltros = document.createElement("div");
    contenedorFiltros.className = "filtros-container";
    
    const filtros = [
        { texto: "Todos", tipo: "todos" },
        { texto: "🧍‍♂️ Personajes", tipo: "personaje" },
        { texto: "🌍 Planetas", tipo: "planeta" },
        { texto: "🚀 Naves", tipo: "nave" }
    ];
    
    for (let i = 0; i < filtros.length; i++) {
        const btn = document.createElement("button");
        btn.className = "btn-filtro";
        btn.textContent = filtros[i].texto;
        btn.addEventListener("click", () => {
            filtrarFavoritosPorTipo(filtros[i].tipo);
        });
        contenedorFiltros.appendChild(btn);
    }
    
    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container favoritos-grid";
    contenedorLista.id = "lista-favoritos";
    contenedorLista.innerHTML = generarListaFavoritos();
    
    root.appendChild(titulo);
    root.appendChild(contador);
    if (favoritos.length > 0) {
        root.appendChild(contenedorFiltros);
    }
    root.appendChild(contenedorLista);
}

// Filtrar favoritos por tipo
function filtrarFavoritosPorTipo(tipo) {
    const contenedor = document.getElementById("lista-favoritos");
    
    if (tipo === "todos") {
        contenedor.innerHTML = generarListaFavoritos();
        return;
    }
    
    const favoritosFiltrados = favoritos.filter(f => f.tipo === tipo);
    
    if (favoritosFiltrados.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-favoritos">
                <p>No tienes favoritos de tipo: ${tipo}</p>
            </div>
        `;
        return;
    }
    
    let listaHTML = "";
    
    for (let i = 0; i < favoritosFiltrados.length; i++) {
        const fav = favoritosFiltrados[i];
        let imgUrl = "";
        let clickFunction = "";
        let icono = "";
        let placeholder = "";
        
        if (fav.tipo === 'personaje') {
            imgUrl = `${IMG_BASE}/characters/${fav.uid}.jpg`;
            clickFunction = `DetallePersonaje('${fav.uid}')`;
            icono = "🧍‍♂️";
            placeholder = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%A7%8D%E2%80%8D%E2%99%82%EF%B8%8F%20${fav.nombre}%3C/text%3E%3C/svg%3E`;
        } else if (fav.tipo === 'planeta') {
            imgUrl = `${IMG_BASE}/planets/${fav.uid}.jpg`;
            clickFunction = `DetallePlaneta('${fav.uid}')`;
            icono = "🌍";
            placeholder = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%8C%8D%20${fav.nombre}%3C/text%3E%3C/svg%3E`;
        } else if (fav.tipo === 'nave') {
            imgUrl = `${IMG_BASE}/starships/${fav.uid}.jpg`;
            clickFunction = `DetalleNave('${fav.uid}')`;
            icono = "🚀";
            placeholder = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%9A%80%20${fav.nombre}%3C/text%3E%3C/svg%3E`;
        }
        
        listaHTML += `
        <div class="card-favorito">
            <button class="btn-eliminar-fav" onclick="eliminarYActualizar('${fav.uid}', '${fav.tipo}')">
                ✕
            </button>
            <div onclick="${clickFunction}" style="cursor: pointer;">
                <img src="${imgUrl}" alt="${fav.nombre}" 
                     onerror="this.onerror=null; this.src='${placeholder}'">
                <h3>${icono} ${fav.nombre}</h3>
                <p class="tipo-favorito">${fav.tipo}</p>
            </div>
        </div>`;
    }
    
    contenedor.innerHTML = listaHTML;
}