// =============================================================================
// 🎮 MINIJUEGO - Adivina el personaje de Star Wars (Tipo Pokedle)
// =============================================================================

let juegoActivo = {
    personajeSecreto: null,
    intentos: [],
    maxIntentos: 6,
    ganado: false,
    perdido: false
};

// 🎲 Iniciar nuevo juego
async function iniciarNuevoJuego() {
    // Asegurarse de que los personajes estén cargados
    if (personajes.length === 0) {
        console.log("⏳ Cargando personajes para el juego...");
        await obtenerPersonajes();
    }

    // Seleccionar personaje aleatorio que tenga todas las propiedades
    const personajesValidos = personajes.filter(p => 
        p.gender && p.height && p.eye_color && p.hair_color && p.mass
    );
    
    if (personajesValidos.length === 0) {
        console.error("❌ No hay personajes válidos para el juego");
        alert("Error: No se pudieron cargar los personajes. Por favor, recarga la página.");
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * personajesValidos.length);
    juegoActivo.personajeSecreto = personajesValidos[randomIndex];
    juegoActivo.intentos = [];
    juegoActivo.ganado = false;
    juegoActivo.perdido = false;
    
    console.log("🎯 Personaje secreto:", juegoActivo.personajeSecreto.name); // DEBUG - Quitar en producción
    console.log("📊 Total personajes válidos:", personajesValidos.length);
    
    Minijuego();
}

// 🎮 Página principal del minijuego
async function Minijuego() {
    const root = document.getElementById("root");
    root.innerHTML = "";

    // Si no hay personajes cargados, cargarlos primero
    if (!personajes || personajes.length === 0) {
        root.innerHTML = "<div class='loading'>Cargando datos del juego...</div>";
        await obtenerPersonajes();
        
        // Verificar que se hayan cargado correctamente
        if (!personajes || personajes.length === 0) {
            root.innerHTML = "<p style='color: red; text-align: center; padding: 2rem;'>Error al cargar los personajes. Por favor, recarga la página.</p>";
            return;
        }
    }

    // Si es la primera vez o no hay personaje secreto, iniciar juego
    if (!juegoActivo.personajeSecreto) {
        await iniciarNuevoJuego();
        return;
    }

    const contenedor = document.createElement("div");
    contenedor.className = "minijuego-container";
    
    // Header del juego
    const header = document.createElement("div");
    header.className = "minijuego-header";
    header.innerHTML = `
        <h1>🎮 Adivina el Personaje de Star Wars</h1>
        <p class="instrucciones">🟢 = Correcto | 🔴 = Incorrecto | Tienes ${juegoActivo.maxIntentos} intentos</p>
        <div class="intentos-contador">
            <span class="intentos-label">Intentos:</span>
            <span class="intentos-numero">${juegoActivo.intentos.length}/${juegoActivo.maxIntentos}</span>
        </div>
    `;
    
    // Input de búsqueda con autocompletado
    const buscadorContainer = document.createElement("div");
    buscadorContainer.className = "buscador-game-container";
    
    if (!juegoActivo.ganado && !juegoActivo.perdido) {
        buscadorContainer.innerHTML = `
            <div class="input-wrapper">
                <input 
                    type="text" 
                    id="buscador-personaje" 
                    class="buscador-game" 
                    placeholder="Escribe el nombre del personaje..."
                    autocomplete="off"
                >
                <div id="sugerencias" class="sugerencias-list"></div>
            </div>
        `;
    }
    
    // Área de imagen (oculta hasta ganar)
    const imagenContainer = document.createElement("div");
    imagenContainer.className = "imagen-secreta-container";
    
    if (juegoActivo.ganado) {
        imagenContainer.innerHTML = `
            <div class="imagen-revelada">
                <img src="${juegoActivo.personajeSecreto.image}" 
                     alt="${juegoActivo.personajeSecreto.name}"
                     onerror="this.src='img/fallback.webp'">
            </div>
        `;
    } else if (juegoActivo.perdido) {
        imagenContainer.innerHTML = `
            <div class="imagen-revelada perdida">
                <img src="${juegoActivo.personajeSecreto.image}" 
                     alt="${juegoActivo.personajeSecreto.name}"
                     onerror="this.src='img/fallback.webp'">
                <p class="texto-perdida">Era: ${juegoActivo.personajeSecreto.name}</p>
            </div>
        `;
    } else {
        imagenContainer.innerHTML = `
            <div class="imagen-oculta">
                <div class="interrogacion">?</div>
                <p>La imagen se revelará cuando adivines</p>
            </div>
        `;
    }
    
    // Tabla de intentos
    const intentosContainer = document.createElement("div");
    intentosContainer.className = "intentos-container";
    intentosContainer.innerHTML = generarTablaIntentos();
    
    // Mensaje de resultado
    const mensajeContainer = document.createElement("div");
    mensajeContainer.className = "mensaje-container";
    
    if (juegoActivo.ganado) {
        mensajeContainer.innerHTML = `
            <div class="mensaje-victoria">
                <h2>🎉 ¡VICTORIA!</h2>
                <p>Adivinaste: <strong>${juegoActivo.personajeSecreto.name}</strong></p>
                <p>En ${juegoActivo.intentos.length} intento(s)</p>
                <button class="btn-nuevo-juego" onclick="iniciarNuevoJuego()">🔄 Jugar de nuevo</button>
            </div>
        `;
    } else if (juegoActivo.perdido) {
        mensajeContainer.innerHTML = `
            <div class="mensaje-derrota">
                <h2>😢 Game Over</h2>
                <p>El personaje era: <strong>${juegoActivo.personajeSecreto.name}</strong></p>
                <button class="btn-nuevo-juego" onclick="iniciarNuevoJuego()">🔄 Intentar de nuevo</button>
            </div>
        `;
    }
    
    // Agregar todo al contenedor
    contenedor.appendChild(header);
    contenedor.appendChild(imagenContainer);
    contenedor.appendChild(buscadorContainer);
    contenedor.appendChild(mensajeContainer);
    contenedor.appendChild(intentosContainer);
    
    root.appendChild(contenedor);
    
    // Agregar event listeners después de renderizar
    if (!juegoActivo.ganado && !juegoActivo.perdido) {
        setTimeout(() => {
            const input = document.getElementById("buscador-personaje");
            if (input) {
                input.addEventListener("input", handleBusqueda);
                input.focus();
            }
        }, 100);
    }
}

// 🔍 Manejar búsqueda con autocompletado
function handleBusqueda(e) {
    const texto = e.target.value.toLowerCase();
    const sugerenciasDiv = document.getElementById("sugerencias");
    
    if (texto.length < 2) {
        sugerenciasDiv.innerHTML = "";
        sugerenciasDiv.style.display = "none";
        return;
    }
    
    const coincidencias = personajes.filter(p => 
        p.name.toLowerCase().includes(texto) && 
        p.gender && p.height && p.eye_color
    ).slice(0, 8);
    
    if (coincidencias.length === 0) {
        sugerenciasDiv.innerHTML = "<div class='sugerencia-item'>No se encontraron personajes</div>";
        sugerenciasDiv.style.display = "block";
        return;
    }
    
    let sugerenciasHTML = "";
    for (let i = 0; i < coincidencias.length; i++) {
        sugerenciasHTML += `
            <div class="sugerencia-item" onclick="seleccionarPersonaje('${coincidencias[i].uid}')">
                <img src="${coincidencias[i].image}" onerror="this.src='img/fallback.webp'">
                <span>${coincidencias[i].name}</span>
            </div>
        `;
    }
    
    sugerenciasDiv.innerHTML = sugerenciasHTML;
    sugerenciasDiv.style.display = "block";
}

// ✅ Seleccionar personaje del autocompletado
function seleccionarPersonaje(uid) {
    const personaje = personajes.find(p => p.uid === uid);
    
    if (!personaje) return;
    
    // Verificar si ya se intentó este personaje
    const yaIntentado = juegoActivo.intentos.some(i => i.uid === personaje.uid);
    if (yaIntentado) {
        alert("Ya intentaste con este personaje");
        return;
    }
    
    // Agregar intento
    juegoActivo.intentos.push(personaje);
    
    // Verificar si ganó
    if (personaje.uid === juegoActivo.personajeSecreto.uid) {
        juegoActivo.ganado = true;
    }
    
    // Verificar si perdió
    if (juegoActivo.intentos.length >= juegoActivo.maxIntentos && !juegoActivo.ganado) {
        juegoActivo.perdido = true;
    }
    
    // Limpiar input y sugerencias
    const input = document.getElementById("buscador-personaje");
    const sugerencias = document.getElementById("sugerencias");
    if (input) input.value = "";
    if (sugerencias) {
        sugerencias.innerHTML = "";
        sugerencias.style.display = "none";
    }
    
    // Re-renderizar
    Minijuego();
}

// 📊 Generar tabla de intentos
function generarTablaIntentos() {
    if (juegoActivo.intentos.length === 0) {
        return `
            <div class="sin-intentos">
                <p>Escribe el nombre de un personaje para comenzar</p>
            </div>
        `;
    }
    
    let tablaHTML = `
        <div class="tabla-intentos">
            <div class="tabla-header">
                <div class="celda-header">Personaje</div>
                <div class="celda-header">Género</div>
                <div class="celda-header">Altura</div>
                <div class="celda-header">Peso</div>
                <div class="celda-header">Color Ojos</div>
                <div class="celda-header">Color Pelo</div>
            </div>
    `;
    
    for (let i = juegoActivo.intentos.length - 1; i >= 0; i--) {
        const intento = juegoActivo.intentos[i];
        const secreto = juegoActivo.personajeSecreto;
        
        const generoMatch = intento.gender === secreto.gender;
        const alturaMatch = compararAltura(intento.height, secreto.height);
        const pesoMatch = compararPeso(intento.mass, secreto.mass);
        const ojosMatch = compararColor(intento.eye_color, secreto.eye_color);
        const peloMatch = compararColor(intento.hair_color, secreto.hair_color);
        
        tablaHTML += `
            <div class="tabla-fila">
                <div class="celda-personaje">
                    <img src="${intento.image}" onerror="this.src='img/fallback.webp'">
                    <span>${intento.name}</span>
                </div>
                <div class="celda ${generoMatch ? 'correcto' : 'incorrecto'}">
                    ${intento.gender || 'N/A'}
                </div>
                <div class="celda ${alturaMatch ? 'correcto' : 'incorrecto'}">
                    ${intento.height || 'N/A'} cm
                    ${!alturaMatch ? getFlechaAltura(intento.height, secreto.height) : ''}
                </div>
                <div class="celda ${pesoMatch ? 'correcto' : 'incorrecto'}">
                    ${intento.mass || 'N/A'} kg
                    ${!pesoMatch ? getFlechaPeso(intento.mass, secreto.mass) : ''}
                </div>
                <div class="celda ${ojosMatch ? 'correcto' : 'incorrecto'}">
                    ${intento.eye_color || 'N/A'}
                </div>
                <div class="celda ${peloMatch ? 'correcto' : 'incorrecto'}">
                    ${intento.hair_color || 'N/A'}
                </div>
            </div>
        `;
    }
    
    tablaHTML += `</div>`;
    return tablaHTML;
}

// 🔍 Funciones de comparación
function compararAltura(altura1, altura2) {
    const h1 = parseInt(altura1) || 0;
    const h2 = parseInt(altura2) || 0;
    return Math.abs(h1 - h2) <= 5;
}

function compararPeso(peso1, peso2) {
    const p1 = parseInt(peso1?.replace(/,/g, '')) || 0;
    const p2 = parseInt(peso2?.replace(/,/g, '')) || 0;
    return Math.abs(p1 - p2) <= 5;
}

function compararColor(color1, color2) {
    return color1?.toLowerCase() === color2?.toLowerCase();
}

function getFlechaAltura(altura1, altura2) {
    const h1 = parseInt(altura1) || 0;
    const h2 = parseInt(altura2) || 0;
    if (h1 < h2) return ' ⬆️';
    if (h1 > h2) return ' ⬇️';
    return '';
}

function getFlechaPeso(peso1, peso2) {
    const p1 = parseInt(peso1?.replace(/,/g, '')) || 0;
    const p2 = parseInt(peso2?.replace(/,/g, '')) || 0;
    if (p1 < p2) return ' ⬆️';
    if (p1 > p2) return ' ⬇️';
    return '';
}