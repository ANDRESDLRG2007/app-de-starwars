// Generar HTML de lista de películas
function generarListaPeliculas(arrayPeliculas) {
    let listaHTML = "";
    
    for (let i = 0; i < arrayPeliculas.length; i++) {
        const id = arrayPeliculas[i].uid;
        const titulo = arrayPeliculas[i].properties.title;
        const episodio = arrayPeliculas[i].properties.episode_id;
        const imgUrl = `${IMG_BASE}/films/${id}.jpg`;
        
        listaHTML += `
        <div class="card-pelicula" onclick="DetallePelicula('${id}')">
            <img src="${imgUrl}" alt="${titulo}" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22450%22%3E%3Crect fill=%22%231a1a1a%22 width=%22300%22 height=%22450%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2216%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%8E%AC%20Episode%20${episodio}%3C/text%3E%3C/svg%3E'">
            <h3>Episodio ${episodio}</h3>
            <p>${titulo}</p>
        </div>`;
    }
    
    return listaHTML;
}

// Página principal de Películas
async function Peliculas() {
    const root = document.getElementById("root");
    root.innerHTML = "";
    
    const titulo = document.createElement("h1");
    titulo.className = "titulo-seccion";
    titulo.textContent = "🎬 Películas";
    
    const descripcion = document.createElement("p");
    descripcion.className = "descripcion-seccion";
    descripcion.textContent = "La saga completa de Star Wars. Haz clic en una película para ver su opening crawl animado.";
    
    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container peliculas-grid";
    contenedorLista.id = "lista-elementos";
    
    if (peliculas.length === 0) {
        contenedorLista.innerHTML = "<div class='loading'>Cargando películas...</div>";
        await obtenerPeliculas();
    }
    
    contenedorLista.innerHTML = generarListaPeliculas(peliculas);
    
    root.appendChild(titulo);
    root.appendChild(descripcion);
    root.appendChild(contenedorLista);
}

// Detalle de película con opening crawl animado
async function DetallePelicula(id) {
    const root = document.getElementById("root");
root.innerHTML = "<div class='loading'>Cargando película...</div>";
const data = await obtenerDetallePelicula(id);

if (!data) {
    root.innerHTML = "<p>Error al cargar la película</p>";
    return;
}

const imgUrl = `${IMG_BASE}/films/${id}.jpg`;

const detalle = document.createElement("div");
detalle.className = "detalle-container pelicula-detalle";
detalle.innerHTML = `
    <button class="btn-volver" onclick="Peliculas()">← Volver</button>
    
    <div class="detalle-header">
        <img src="${imgUrl}" alt="${data.title}" 
             onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22450%22%3E%3Crect fill=%22%231a1a1a%22 width=%22300%22 height=%22450%22/%3E%3Ctext fill=%22%23FFE81F%22 font-size=%2218%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E%F0%9F%8E%AC%20${data.title}%3C/text%3E%3C/svg%3E'">
        <div class="detalle-info">
            <h1>Episodio ${data.episode_id}</h1>
            <h2>${data.title}</h2>
            
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-label">Director:</span>
                    <span class="stat-value">${data.director}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Productor:</span>
                    <span class="stat-value">${data.producer}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Fecha de estreno:</span>
                    <span class="stat-value">${data.release_date}</span>
                </div>
            </div>
            
            <button class="btn-crawl" onclick="mostrarCrawl('${id}')">
                ▶ Ver Opening Crawl
            </button>
        </div>
    </div>
    
    <div id="crawl-container-${id}" class="crawl-hidden">
        <div class="crawl-content">
            <div class="crawl-text">
                <div class="crawl-episode">Episodio ${data.episode_id}</div>
                <div class="crawl-title">${data.title}</div>
                <p class="crawl-body">${data.opening_crawl}</p>
            </div>
        </div>
    </div>
`;

root.innerHTML = "";
root.appendChild(detalle);
}