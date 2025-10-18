// ================================================================
// 🌌 Star Wars Encyclopedia - conexion.js (corregido)
// ================================================================

let personajes = [];
let planetas = [];
let naves = [];
let peliculas = [];
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

// ✅ Verificar imagen sin CORS usando objeto Image
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

        planetas = data.results.map((p) => ({
            ...p,
            image: `img/planetas/${normalizarNombreArchivo(p.name)}.webp`
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

        naves = data.results.map((n) => ({
            ...n,
            image: `img/naves/${normalizarNombreArchivo(n.name)}.webp`
        }));

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
            image: `img/peliculas/${normalizarNombreArchivo(f.properties.title)}.webp`
        }));

        return peliculas;
    } catch (error) {
        console.error('Error al obtener películas:', error);
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
        planeta.image = `img/planetas/${normalizarNombreArchivo(planeta.name)}.webp`;

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
        pelicula.image = `img/peliculas/${normalizarNombreArchivo(pelicula.title)}.webp`;

        return pelicula;
    } catch (error) {
        console.error(`❌ Error al obtener detalle de la película ${id}:`, error);
        return null;
    }
}


// =======================
// 🚀 Inicialización
// =======================
async function inicializarApp() {
    console.log("🚀 Iniciando Star Wars Encyclopedia...");
    await cargarImagenesStarWars();
    await obtenerPersonajes();
    console.log("✅ App inicializada");
    Personajes();
}

window.addEventListener("load", inicializarApp);
