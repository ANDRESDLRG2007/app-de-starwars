// Página informativa sobre Star Wars y la app
function Informativa() {
    const root = document.getElementById("root");
    root.innerHTML = "";
    
    const contenedor = document.createElement("div");
    contenedor.className = "pagina-informativa";
    
    contenedor.innerHTML = `
        <div class="info-header">
            <h1>🌟 Sobre Star Wars Encyclopedia</h1>
            <p class="subtitulo">Tu guía completa del universo Star Wars</p>
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
                usando datos oficiales de <strong>SWAPI (The Star Wars API)</strong>.
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
                Todos los datos provienen de <strong>SWAPI.tech</strong>, una API REST gratuita y 
                programáticamente accesible con información canónica del universo Star Wars.
            </p>
            <p class="info-api">
                🔗 API Base: <code>https://www.swapi.tech/api/</code><br>
                📚 Documentación: <a href="https://www.swapi.tech/documentation" target="_blank">swapi.tech/documentation</a>
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
            <p class="version">v1.0.0 - 2025</p>
        </div>
    `;
    
    root.appendChild(contenedor);
}