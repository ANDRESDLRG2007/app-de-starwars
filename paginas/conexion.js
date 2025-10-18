// ================================================================
// 🌌 Star Wars Encyclopedia - conexion.js (con Especies y Vehículos)
// ================================================================

let personajes = [];
let planetas = [];
let naves = [];
let peliculas = [];
let especies = [];
let vehiculos = [];
let favoritos = [];
let imagenesStarWars = [];

const BASE_URL = 'https://www.swapi.tech/api';
const IMG_URL = 'https://akabab.github.io/starwars-api/api/all.json';

// =======================
// 🖼️ Cargar imágenes desde GitHub
// =======================
async function cargarImagenesStarWars() {
    try {
        const res = await fetch(IMG_URL);
        imagenesStarWars = await res.json();
        console.log(`✅ Imágenes cargadas (${imagenesStarWars.length})`);
    } catch (error) {
        console.error('❌ Error al cargar imágenes desde GitHub:', error);
        imagenesStarWars = [];
    }
}

// 🖼️ Generar atributo onerror con cascada completa (WebP → JPG → GitHub → SVG)
function generarAtributoOnerror(rutaJPG, imgGitHub, fallback) {
    if (imgGitHub) {
        // WebP → JPG → GitHub → Fallback
        return `onerror="this.onerror=function(){this.onerror=function(){this.onerror=null;this.src='${imgGitHub}';this.onerror=function(){this.src='${fallback}';}};this.src='${fallback}';}; this.src='${rutaJPG}';"`;
    } else {
        // WebP → JPG → Fallback directo
        return `onerror="this.onerror=function(){this.src='${fallback}';}; this.src='${rutaJPG}';"`;
    }
}

// =======================
// 🧩 Utilidades
// =======================
function normalizarNombreArchivo(nombre) {
    return nombre
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9_-]/g, '');
}

// ✅ Verifica si una imagen existe (usa GET si el HEAD falla)
async function verificarImagen(url) {
    try {
        // Primero intentamos con HEAD
        let respuesta = await fetch(url, { method: "HEAD" });

        // Si falla (algunos entornos bloquean HEAD), probamos con GET
        if (!respuesta.ok) {
            respuesta = await fetch(url);
        }

        // Devuelve true si la respuesta fue válida
        return respuesta.ok;
    } catch (error) {
        console.warn(`⚠️ No se pudo verificar la imagen: ${url}`, error);
        return false;
    }
}

// =======================
// 🖼️ Flujo GitHub → Local → Fallback (solo para personajes)
// =======================
async function obtenerImagen(nombre, categoria = "personajes") {
    const nombreNormalizado = normalizarNombreArchivo(nombre);
    const fallback = "img/fallback.webp";

    // Buscar en el dataset de Akabab
    const personajeAkabab = imagenesStarWars.find(
        img => img.name.toLowerCase() === nombre.toLowerCase()
    );

    // 1️⃣ Intentar con la URL de Akabab si existe
    if (personajeAkabab && personajeAkabab.image) {
        const url = personajeAkabab.image;

        const cargaValida = await verificarImagen(url);

        if (cargaValida) {
            console.log(`🟢 Imagen GitHub usada: ${nombre}`);
            return url;
        } else {
            console.warn(`⚠️ Imagen GitHub rota o bloqueada: ${nombre}`);
        }
    }

    // 2️⃣ Intentar versión local
    const rutaLocal = `img/${categoria}/${nombreNormalizado}.webp`;
    const existeLocal = await new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = rutaLocal;
    });

    if (existeLocal) {
        console.log(`🟠 Imagen local usada: ${nombre}`);
        return rutaLocal;
    }

    // 3️⃣ Si todo falla → fallback genérico
    console.error(`🔴 No se encontró imagen ni en Akabab ni local para: ${nombre}`);
    return fallback;
}

// =======================
// 🌌 PERSONAJES
// =======================
async function obtenerPersonajes() {
    try {
        const res = await fetch(`${BASE_URL}/people?page=1&limit=100`);
        const data = await res.json();

        personajes = await Promise.all(
            data.results.map(async (p) => {
                const imagen = await obtenerImagen(p.name, 'personajes');
                return { ...p, image: imagen };
            })
        );

        return personajes;
    } catch (error) {
        console.error('Error al obtener personajes:', error);
        return [];
    }
}

// =======================
// 🪐 PLANETAS
// =======================
async function obtenerPlanetas() {
    try {
        const res = await fetch(`${BASE_URL}/planets?page=1&limit=100`);
        const data = await res.json();

        planetas = data.results
            .filter(p => p.name.toLowerCase() !== "unknown")
            .map((p) => ({
                ...p,
                image: `img/planeta/${normalizarNombreArchivo(p.name)}.webp`
            }));

        return planetas;
    } catch (error) {
        console.error('Error al obtener planetas:', error);
        return [];
    }
}

// =======================
// 🚀 NAVES
// =======================
async function obtenerNaves() {
    try {
        const res = await fetch(`${BASE_URL}/starships?page=1&limit=100`);
        const data = await res.json();

        naves = await Promise.all(
            data.results.map(async (n) => {
                const imagen = await obtenerImagen(n.name, 'naves');
                return { ...n, image: imagen };
            })
        );

        return naves;
    } catch (error) {
        console.error('Error al obtener naves:', error);
        return [];
    }
}

// =======================
// 🎬 PELÍCULAS
// =======================
async function obtenerPeliculas() {
    try {
        const res = await fetch(`${BASE_URL}/films`);
        const data = await res.json();

        peliculas = data.result.map((f) => ({
            ...f,
            image: `img/films/${normalizarNombreArchivo(f.properties.title)}.webp`
        }));

        return peliculas;
    } catch (error) {
        console.error('Error al obtener películas:', error);
        return [];
    }
}

// =======================
// 👽 ESPECIES
// =======================
async function obtenerEspecies() {
    try {
        const res = await fetch(`${BASE_URL}/species?page=1&limit=100`);
        const data = await res.json();

        especies = data.results.map((e) => ({
            ...e,
            image: `img/especies/${normalizarNombreArchivo(e.name)}.webp`
        }));

        return especies;
    } catch (error) {
        console.error('Error al obtener especies:', error);
        return [];
    }
}

// =======================
// 🚗 VEHÍCULOS
// =======================
async function obtenerVehiculos() {
    try {
        const res = await fetch(`${BASE_URL}/vehicles?page=1&limit=100`);
        const data = await res.json();

        vehiculos = data.results.map((v) => ({
            ...v,
            image: `img/vehiculos/${normalizarNombreArchivo(v.name)}.webp`
        }));

        return vehiculos;
    } catch (error) {
        console.error('Error al obtener vehículos:', error);
        return [];
    }
}

// =======================
// 🧍 Obtener detalle de PERSONAJE
// =======================
async function obtenerDetallePersonaje(id) {
    try {
        const res = await fetch(`${BASE_URL}/people/${id}`);
        const data = await res.json();
        const personaje = data.result.properties;

        personaje.uid = id;
        personaje.name = personaje.name || 'Desconocido';
        personaje.image = await obtenerImagen(personaje.name, 'personajes');

        return personaje;
    } catch (error) {
        console.error(`❌ Error al obtener detalle del personaje ${id}:`, error);
        return null;
    }
}

// =======================
// 🪐 Obtener detalle de PLANETA
// =======================
async function obtenerDetallePlaneta(id) {
    try {
        const res = await fetch(`${BASE_URL}/planets/${id}`);
        const data = await res.json();
        const planeta = data.result.properties;

        planeta.uid = id;
        planeta.name = planeta.name || 'Desconocido';
        planeta.image = `img/planeta/${normalizarNombreArchivo(planeta.name)}.webp`;

        return planeta;
    } catch (error) {
        console.error(`❌ Error al obtener detalle del planeta ${id}:`, error);
        return null;
    }
}

// =======================
// 🚀 Obtener detalle de NAVE
// =======================
async function obtenerDetalleNave(id) {
    try {
        const res = await fetch(`${BASE_URL}/starships/${id}`);
        const data = await res.json();
        const nave = data.result.properties;

        nave.uid = id;
        nave.name = nave.name || 'Desconocido';
        nave.image = `img/naves/${normalizarNombreArchivo(nave.name)}.webp`;

        return nave;
    } catch (error) {
        console.error(`❌ Error al obtener detalle de la nave ${id}:`, error);
        return null;
    }
}

// =======================
// 🎬 Obtener detalle de PELÍCULA
// =======================
async function obtenerDetallePelicula(id) {
    try {
        const res = await fetch(`${BASE_URL}/films/${id}`);
        const data = await res.json();
        const pelicula = data.result.properties;

        pelicula.uid = id;
        pelicula.title = pelicula.title || 'Desconocida';
        pelicula.image = `img/films/${normalizarNombreArchivo(pelicula.title)}.webp`;

        return pelicula;
    } catch (error) {
        console.error(`❌ Error al obtener detalle de la película ${id}:`, error);
        return null;
    }
}

// =======================
// 👽 Obtener detalle de ESPECIE
// =======================
async function obtenerDetalleEspecie(id) {
    try {
        const res = await fetch(`${BASE_URL}/species/${id}`);
        const data = await res.json();
        const especie = data.result.properties;

        especie.uid = id;
        especie.name = especie.name || 'Desconocido';
        especie.image = `img/especies/${normalizarNombreArchivo(especie.name)}.webp`;

        return especie;
    } catch (error) {
        console.error(`❌ Error al obtener detalle de la especie ${id}:`, error);
        return null;
    }
}

// =======================
// 🚗 Obtener detalle de VEHÍCULO
// =======================
async function obtenerDetalleVehiculo(id) {
    try {
        const res = await fetch(`${BASE_URL}/vehicles/${id}`);
        const data = await res.json();
        const vehiculo = data.result.properties;

        vehiculo.uid = id;
        vehiculo.name = vehiculo.name || 'Desconocido';
        vehiculo.image = `img/vehiculos/${normalizarNombreArchivo(vehiculo.name)}.webp`;

        return vehiculo;
    } catch (error) {
        console.error(`❌ Error al obtener detalle del vehículo ${id}:`, error);
        return null;
    }
}

// =============================================================================
// ⭐ FAVORITOS
// =============================================================================

function cargarFavoritos() {
    if (!favoritos) favoritos = [];
    return favoritos;
}

function agregarFavorito(item) {
    const existe = favoritos.find(f => f.uid === item.uid && f.tipo === item.tipo);
    if (!existe) favoritos.push(item);
}

function eliminarFavorito(uid, tipo) {
    favoritos = favoritos.filter(f => !(f.uid === uid && f.tipo === tipo));
}

function esFavorito(uid, tipo) {
    return favoritos.some(f => f.uid === uid && f.tipo === tipo);
}

// =======================
// 🚀 Inicialización
// =======================
async function inicializarApp() {
    const root = document.getElementById("root");
    
    // Mostrar pantalla de carga
    root.innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner"></div>
            <h2 style="color: var(--color-primary); margin-top: 2rem;">Cargando Star Wars Encyclopedia...</h2>
            <p style="color: #aaa; margin-top: 1rem;">Conectando con la galaxia...</p>
        </div>
    `;
    
    console.log("🚀 Iniciando Star Wars Encyclopedia...");
    
    try {
        // Cargar todos los datos en paralelo
        await Promise.all([
            cargarImagenesStarWars(),
            obtenerPersonajes(),
            obtenerPlanetas(),
            obtenerNaves(),
            obtenerEspecies(),
            obtenerVehiculos(),
            obtenerPeliculas()
        ]);
        
        console.log("✅ App inicializada");
        console.log(`📊 Datos cargados: ${personajes.length} personajes, ${planetas.length} planetas, ${naves.length} naves, ${especies.length} especies, ${vehiculos.length} vehículos, ${peliculas.length} películas`);
        
        // Cargar Home después de obtener todos los datos
        Home();
    } catch (error) {
        console.error("❌ Error al inicializar la app:", error);
        root.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2 style="color: #ff4444;">Error al cargar la aplicación</h2>
                <p style="color: #aaa; margin-top: 1rem;">Por favor, recarga la página</p>
                <button onclick="location.reload()" style="margin-top: 2rem; padding: 1rem 2rem; background: var(--color-primary); color: var(--color-secondary); border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Recargar</button>
            </div>
        `;
    }
}

window.addEventListener("load", inicializarApp);