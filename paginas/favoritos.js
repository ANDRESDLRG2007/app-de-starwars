// Generar HTML de favoritos
function generarListaFavoritos() {
    if (favoritos.length === 0) {
        return `
            <div class="sin-favoritos">
                <h2>⭐ Sin favoritos aún</h2>
                <p>Explora personajes, planetas y naves para añadirlos a tus favoritos</p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;">
                    <button style="background: var(--color-primary); color: var(--color-secondary); border: none; padding: 0.8rem 1.5rem; border-radius: 5px; cursor: pointer; font-weight: bold;" onclick="Personajes()">Ver Personajes</button>
                    <button style="background: var(--color-primary); color: var(--color-secondary); border: none; padding: 0.8rem 1.5rem; border-radius: 5px; cursor: pointer; font-weight: bold;" onclick="Planetas()">Ver Planetas</button>
                    <button style="background: var(--color-primary); color: var(--color-secondary); border: none; padding: 0.8rem 1.5rem; border-radius: 5px; cursor: pointer; font-weight: bold;" onclick="Naves()">Ver Naves</button>
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
        let tipo = "";
        
        if (fav.tipo === 'personaje') {
            imgUrl = `${IMG_BASE}/characters/${fav.uid}.jpg`;
            clickFunction = `DetallePersonaje('${fav.uid}')`;
            icono = "🧍‍♂️";
            tipo = 'characters';
        } else if (fav.tipo === 'planeta') {
            imgUrl = `${IMG_BASE}/planets/${fav.uid}.jpg`;
            clickFunction = `DetallePlaneta('${fav.uid}')`;
            icono = "🌍";
            tipo = 'planets';
        } else if (fav.tipo === 'nave') {
            imgUrl = `${IMG_BASE}/starships/${fav.uid}.jpg`;
            clickFunction = `DetalleNave('${fav.uid}')`;
            icono = "🚀";
            tipo = 'starships';
        }
        
        const placeholder = obtenerImagenPorDefecto(tipo, fav.nombre, fav.uid);
        
        listaHTML += `
        <div class="card-favorito">
            <button class="btn-eliminar-fav" onclick="eliminarYActualizar('${fav.uid}', '${fav.tipo}')">
                ✕
            </button>
            <div onclick="${clickFunction}" style="cursor: pointer;">
                <img src="${imgUrl}" alt="${fav.nombre}" onerror="this.src='${placeholder}'">
                <h3>${icono} ${fav.nombre}</h3>
                <p style="background: rgba(255, 232, 31, 0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; color: var(--color-primary); display: inline-block; margin-top: 0.5rem;">${fav.tipo}</p>
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
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">Tienes <strong style="color: var(--color-primary);">${favoritos.length}</strong> favorito(s)</p>
        ${favoritos.length > 0 ? '<button style="background: #d32f2f; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;" onclick="limpiarFavoritos()">🗑️ Limpiar todos</button>' : ''}
    `;
    
    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
    contenedorLista.id = "lista-favoritos";
    contenedorLista.innerHTML = generarListaFavoritos();
    
    root.appendChild(titulo);
    root.appendChild(contador);
    root.appendChild(contenedorLista);
}