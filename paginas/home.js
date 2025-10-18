// =============================================================================
// 🏠 HOME - Página de inicio con dashboard
// =============================================================================

function Home() {
    const root = document.getElementById("root");
    root.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.className = "home-container";
    
    contenedor.innerHTML = `
        <div class="home-header">
            <h1 class="home-title">🌟 Star Wars Encyclopedia</h1>
            <p class="home-subtitle">Explora el universo de Star Wars</p>
        </div>

        <div class="home-grid">
            <div class="home-card" onclick="Personajes()">
                <div class="home-card-icon">🧍‍♂️</div>
                <h3>Personajes</h3>
                <p>Héroes, villanos y leyendas</p>
                <span class="home-card-count">${personajes.length || 0}</span>
            </div>

            <div class="home-card" onclick="Naves()">
                <div class="home-card-icon">🚀</div>
                <h3>Naves</h3>
                <p>Cazas y naves legendarias</p>
                <span class="home-card-count">${naves.length || 0}</span>
            </div>

            <div class="home-card" onclick="Planetas()">
                <div class="home-card-icon">🌍</div>
                <h3>Planetas</h3>
                <p>Mundos de la galaxia</p>
                <span class="home-card-count">${planetas.length || 0}</span>
            </div>

            <div class="home-card" onclick="Vehiculos()">
                <div class="home-card-icon">🚗</div>
                <h3>Vehículos</h3>
                <p>Transporte terrestre</p>
                <span class="home-card-count">${vehiculos.length || 0}</span>
            </div>

            <div class="home-card" onclick="Especies()">
                <div class="home-card-icon">👽</div>
                <h3>Especies</h3>
                <p>Razas de la galaxia</p>
                <span class="home-card-count">${especies.length || 0}</span>
            </div>

            <div class="home-card" onclick="Favoritos()">
                <div class="home-card-icon">⭐</div>
                <h3>Favoritos</h3>
                <p>Tus elementos guardados</p>
                <span class="home-card-count">${favoritos.length || 0}</span>
            </div>
        </div>

        <div class="home-footer">
            <p>"Que la Fuerza te acompañe"</p>
        </div>
    `;
    
    root.appendChild(contenedor);
}