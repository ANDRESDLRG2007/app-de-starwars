// =============================================================================
// 🏠 HOME - Página de inicio SIN contadores
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
                <div class="home-card-image">
                    <img src="img/personajes/darth_vader.webp" alt="Darth Vader" onerror="this.src='img/fallback.webp'">
                </div>
                <h3>Personajes</h3>
                <p>Héroes, villanos y leyendas</p>
            </div>

            <div class="home-card" onclick="Naves()">
                <div class="home-card-image">
                    <img src="img/naves/death_star.webp" alt="Death Star" onerror="this.src='img/fallback.webp'">
                </div>
                <h3>Naves</h3>
                <p>Cazas y naves legendarias</p>
            </div>

            <div class="home-card" onclick="Planetas()">
                <div class="home-card-image">
                    <img src="img/planeta/alderaan.webp" alt="Alderaan" onerror="this.src='img/fallback.webp'">
                </div>
                <h3>Planetas</h3>
                <p>Mundos de la galaxia</p>
            </div>

            <div class="home-card" onclick="Vehiculos()">
                <div class="home-card-image">
                    <img src="img/vehiculos/t-16_skyhopper.webp" alt="T-16 Skyhopper" onerror="this.src='img/fallback.webp'">
                </div>
                <h3>Vehículos</h3>
                <p>Transporte terrestre</p>
            </div>

            <div class="home-card" onclick="Especies()">
                <div class="home-card-image">
                    <img src="img/especies/droid.webp" alt="Droid" onerror="this.src='img/fallback.webp'">
                </div>
                <h3>Especies</h3>
                <p>Razas de la galaxia</p>
            </div>

            <div class="home-card" onclick="Favoritos()">
                <div class="home-card-image home-card-icon-star">
                    <span>⭐</span>
                </div>
                <h3>Favoritos</h3>
                <p>Tus elementos guardados</p>
            </div>
        </div>

        <div class="home-footer">
            <p>"Que la Fuerza te acompañe"</p>
        </div>
    `;
    
    root.appendChild(contenedor);
}