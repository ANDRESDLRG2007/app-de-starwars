// =============================================================================
// 🎬 PELÍCULAS - Sistema con cascada de imágenes
// =============================================================================

// 🎞️ Generar HTML de lista de películas con cascada
function generarListaPeliculas(arrayPeliculas) {
    let listaHTML = "";

    for (let i = 0; i < arrayPeliculas.length; i++) {
        const id = arrayPeliculas[i].uid;
        const titulo = arrayPeliculas[i].title;
        const episodio = arrayPeliculas[i].episode_id;


        const imgWebP = arrayPeliculas[i].image;
        const imgJPG = arrayPeliculas[i].imageJPG;
        const imgGitHub = arrayPeliculas[i].imageGitHub;
        const imgFallback = arrayPeliculas[i].imageFallback;
     

        listaHTML += `
        <div class="card-pelicula" onclick="DetallePelicula('${id}')">
            <img src="${imgWebP}" alt="${titulo}" onerror="this.src='${imgJPG}'; this.onerror=function(){this.src='${imgGitHub}'; this.onerror=function(){this.src='${imgFallback}';}}">
            <h3>Episodio ${episodio}</h3>
            <p>${titulo}</p>
        </div>`;
    }

    return listaHTML;
}

// 📄 Página principal de Películas
async function Peliculas() {
    const root = document.getElementById("root");
    root.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.className = "titulo-seccion";
    titulo.textContent = "Películas";

    const descripcion = document.createElement("p");
    descripcion.style.textAlign = "center";
    descripcion.style.color = "#cccccc";
    descripcion.style.marginBottom = "2rem";
    descripcion.textContent =
        "La saga completa de Star Wars. Haz clic en una película para ver su información.";

    const contenedorLista = document.createElement("div");
    contenedorLista.className = "grid-container";
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

// 🎥 Detalle de película
async function DetallePelicula(id) {
    const root = document.getElementById("root");
    root.innerHTML = "<div class='loading'>Cargando película...</div>";

    const data = await obtenerDetallePelicula(id);

    if (!data) {
        root.innerHTML = "<p>Error al cargar la película</p>";
        return;
    }

    const imgLocal = data.image;
    const imgGitHub = data.imageGitHub;
    const imgFallback = data.imageFallback;
   

    const detalle = document.createElement("div");
    detalle.className = "detalle-container pelicula-detalle";
    detalle.innerHTML = `
        <button class="btn-volver" onclick="Peliculas()">← Volver</button>

        <div class="detalle-header">
             <img src="${imgLocal}" alt="${data.name}" onerror="this.src='${imgGitHub}'; this.onerror=function(){this.src='${imgFallback}';}">
            <div class="detalle-info">
                <h1>Episodio ${data.episode_id}</h1>
                <h2 style="color: #fff; margin-bottom: 1rem;">${data.title}</h2>

                <div class="stats">
                    <div class="stat-item"><span class="stat-label">Director:</span><span class="stat-value">${data.director}</span></div>
                    <div class="stat-item"><span class="stat-label">Productor:</span><span class="stat-value">${data.producer}</span></div>
                    <div class="stat-item"><span class="stat-label">Fecha de estreno:</span><span class="stat-value">${data.release_date}</span></div>
                </div>

                <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(255, 232, 31, 0.1); border-radius: 10px; border-left: 4px solid var(--color-primary);">
                    <h3 style="color: var(--color-primary); margin-bottom: 1rem;">📜 Opening Crawl</h3>
                    <p style="line-height: 1.8; color: #ccc; text-align: justify;">${data.opening_crawl}</p>
                </div>
            </div>
        </div>
    `;

    root.innerHTML = "";
    root.appendChild(detalle);
}