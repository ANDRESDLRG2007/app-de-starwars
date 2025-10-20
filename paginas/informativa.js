// Declaración global del audio
let starWarsAudio = new Audio("audios/B S O STAR WARS - bsocine.mp3");
starWarsAudio.loop = true;

function Informativa() {
    const root = document.getElementById("root");
    root.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.className = "pagina-informativa";

    contenedor.innerHTML = `
<div class="info-header">
    <h1>🌟 Sobre Star Wars Encyclopedia</h1>
    <p class="subtitulo">Tu guía completa del universo Star Wars</p>
    <button id="mute-btn" style="font-size:1.5rem; background:none; border:none; cursor:pointer;">🔇</button>
</div>

        
        <section class="info-seccion">
            <h2>🎬 ¿Qué es Star Wars?</h2>
            <p>
                Star Wars es una franquicia épica de ciencia ficción creada por George Lucas en 1977. 
                La saga nos transporta a "una galaxia muy, muy lejana" donde la Fuerza, el bien y el mal, 
                luchan en una batalla épica que ha capturado la imaginación de millones de fans en todo el mundo.
            </p>
            <p>
                Desde los Jedi y los Sith, hasta los cazarrecompensas y los droides, el universo Star Wars 
                está lleno de personajes inolvidables, planetas exóticos y naves legendarias.
            </p>
        </section>
        
        <section class="info-seccion">
            <h2>📱 Sobre esta App</h2>
            <p>
                Esta enciclopedia digital te permite explorar todos los elementos canónicos del universo Star Wars, 
                usando datos oficiales de <strong>SWAPI (The Star Wars API)</strong> y recursos multimedia adicionales.
            </p>
            
            <div class="caracteristicas">
                <div class="caracteristica">
                    <span class="icono">🧍‍♂️</span>
                    <h3>Personajes</h3>
                    <p>Explora héroes, villanos y personajes secundarios con información detallada</p>
                </div>
                
                <div class="caracteristica">
                    <span class="icono">🌍</span>
                    <h3>Planetas</h3>
                    <p>Descubre mundos desde el árido Tatooine hasta el helado Hoth</p>
                </div>
                
                <div class="caracteristica">
                    <span class="icono">🚀</span>
                    <h3>Naves</h3>
                    <p>Conoce naves legendarias como el Halcón Milenario y los X-Wing</p>
                </div>
                
                <div class="caracteristica">
                    <span class="icono">🎬</span>
                    <h3>Películas</h3>
                    <p>Revive las películas con opening crawls animados</p>
                </div>
                
                <div class="caracteristica">
                    <span class="icono">⭐</span>
                    <h3>Favoritos</h3>
                    <p>Guarda tus personajes, planetas y naves preferidos</p>
                </div>
            </div>
        </section>
        
        <section class="info-seccion">
            <h2>🔍 Cómo usar la app</h2>
            <ol class="lista-pasos">
                <li><strong>Navega</strong> - Usa el menú superior para cambiar entre secciones</li>
                <li><strong>Busca</strong> - Escribe en el buscador para encontrar elementos específicos</li>
                <li><strong>Filtra</strong> - Usa los botones de filtro para refinar los resultados</li>
                <li><strong>Explora</strong> - Haz clic en cualquier elemento para ver sus detalles</li>
                <li><strong>Guarda</strong> - Añade tus favoritos haciendo clic en la estrella ⭐</li>
            </ol>
        </section>
        
        <section class="info-seccion">
            <h2>🎯 Curiosidades Star Wars</h2>
            <div class="curiosidades">
                <div class="curiosidad">
                    <h3>💡 ¿Sabías que...?</h3>
                    <p>El sonido del sable de luz fue creado combinando el zumbido de un proyector 
                    de películas antiguo con la interferencia de un televisor.</p>
                </div>
                
                <div class="curiosidad">
                    <h3>🌟 La Fuerza</h3>
                    <p>"La Fuerza" es un campo de energía metafísico que une a todos los seres vivos 
                    de la galaxia. Los Jedi la usan para el bien, los Sith para el mal.</p>
                </div>
                
                <div class="curiosidad">
                    <h3>🎬 Orden de las películas</h3>
                    <p>La saga original (IV, V, VI) se estrenó primero (1977-1983), luego las precuelas 
                    (I, II, III) de 1999-2005, y finalmente las secuelas (VII, VIII, IX) de 2015-2019.</p>
                </div>
            </div>
        </section>
        
        <section class="info-seccion">
            <h2>📊 Fuente de datos</h2>
            <p>
                Los datos textuales provienen de <strong>SWAPI.tech</strong> (<code>https://www.swapi.tech/api/</code>), 
                una API REST gratuita y programáticamente accesible con información canónica del universo Star Wars.
            </p>
            <p class="info-api">
                🔗 API Base: <code>https://www.swapi.tech/api/</code><br>
                📚 Documentación: <a href="https://www.swapi.tech/documentation" target="_blank">swapi.tech/documentation</a>
            </p>

            <h3 style="margin-top:1rem;">🖼️ Imágenes y multimedia</h3>
            <p>
                Las imágenes se obtienen desde un repositorio público en <strong>GitHub</strong> que contiene recursos adicionales (sprites y retratos). 
                Ten en cuenta que el repositorio puede incluir archivos corruptos o referencias rotas; la app intenta:
            </p>
            <ul>
                <li>1) Obtener la imagen desde el dataset de terceros (Akabab) si está disponible.</li>
                <li>2) Usar la versión alojada en el repositorio de GitHub.</li>
                <li>3) Buscar una copia local en <code>img/</code> dentro del proyecto.</li>
                <li>4) Mostrar un <em>fallback</em> genérico (<code>img/fallback.webp</code>) si ninguna ruta válida está disponible.</li>
            </ul>
            <p class="nota-aviso">
                ⚠️ Por eso verás algunos avatares que no cargan correctamente en ciertas máquinas o navegadores — algunas imágenes en el repo están corruptas o las rutas locales difieren en mayúsculas/extensiones. Si detectas errores 404 o imágenes dañadas, revisa primero la carpeta <code>img/</code> y luego el repositorio en GitHub.
            </p>
        </section>

        <section class="info-seccion">
            <h2>🔧 Nota técnica rápida</h2>
            <p>
                Recomendaciones para desarrolladores: la app hace comprobación con <code>Image()</code> para validar URLs (más robusto frente a CORS que HEAD). 
                Mantén las rutas locales y nombres de archivos normalizados (sin mayúsculas ni caracteres especiales) para evitar 404 en servidores sensibles a mayúsculas.
            </p>
        </section>
        
        <section class="info-seccion cita-final">
            <blockquote>
                "Que la Fuerza te acompañe"
            </blockquote>
            <p class="autor">— Obi-Wan Kenobi</p>
        </section>
        
        <div class="info-footer">
            <p>Desarrollado con ❤️ para los fans de Star Wars</p>
            <p class="version">v1.0.1 - 2025</p>
        </div>
    `;

    root.appendChild(contenedor);

    // Reproducir la música al entrar
    starWarsAudio.currentTime = 0;
    starWarsAudio.play().catch(e => {
        console.log("Autoplay bloqueado:", e);
    });

    // Botón de mute
    const muteBtn = document.getElementById("mute-btn");
    muteBtn.addEventListener("click", () => {
        starWarsAudio.muted = !starWarsAudio.muted;
        muteBtn.textContent = starWarsAudio.muted ? "🔇" : "🔈";
    });
}

// ⚠️ IMPORTANTE: NO definir otras funciones de navegación aquí
// Las funciones Home(), Personajes(), Planetas(), etc. están definidas en sus propios archivos

// Función auxiliar para detener el audio cuando se sale de la página informativa
function detenerAudioInformativa() {
    if (starWarsAudio && !starWarsAudio.paused) {
        starWarsAudio.pause();
        starWarsAudio.currentTime = 0;
        starWarsAudio.muted = false;
    }
}

// También detenemos el audio de Vader si viene del Easter Egg
function detenerAudioVader() {
    if (typeof vaderAudio !== 'undefined' && vaderAudio && !vaderAudio.paused) {
        vaderAudio.pause();
        vaderAudio.currentTime = 0;
    }
}