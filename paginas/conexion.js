// Datos globales
let personajes = [];
let planetas = [];
let naves = [];
let peliculas = [];
let favoritos = [];
let imagenesStarWars = []; // ← contendrá los datos con imágenes de GitHub

// URLs base
const BASE_URL = 'https://www.swapi.tech/api';
const IMG_URL = 'https://akabab.github.io/starwars-api/api/all.json';

// 🖼️ Cargar imágenes desde GitHub API
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

// =============================================================================
// 🎯 SISTEMA DE CASCADA DE IMÁGENES
// =============================================================================
// Prioridad: Local → GitHub → Placeholder SVG

// 🔡 Normalizar nombre para archivo
function normalizarNombreArchivo(nombre) {
    return nombre
        .toLowerCase()
        .replace(/\s+/g, '_')  // Espacios → guiones bajos
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9_-]/g, ''); // Eliminar caracteres especiales
}

// 🗂️ Construir ruta de imagen local
function construirRutaLocal(nombre, tipo, extension = 'webp') {
    const nombreArchivo = normalizarNombreArchivo(nombre);
    
    const carpetas = {
        'characters': 'img/personajes',
        'planets': 'img/planetas',
        'starships': 'img/naves',
        'films': 'img/peliculas'
    };
    
    const carpeta = carpetas[tipo] || carpetas['characters'];
    return `${carpeta}/${nombreArchivo}.${extension}`;
}

// 🎯 Función principal: Obtener imagen con cascada completa
function obtenerImagen(nombre, tipo, id) {
    const rutaWebP = construirRutaLocal(nombre, tipo, 'webp');
    const rutaJPG = construirRutaLocal(nombre, tipo, 'jpg');
    const imgGitHub = obtenerImagenGitHub(nombre);
    const fallback = obtenerImagenPorDefecto(tipo, nombre, id);
    
    return {
        src: rutaWebP,  // Intentar primero WebP (más común)
        jpg: rutaJPG,   // Fallback a JPG
        github: imgGitHub,  // Fallback a GitHub
        fallback: fallback  // Fallback final
    };
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

// =============================================================================
// 🧩 UTILIDADES
// =============================================================================

function obtenerID(url) {
    const partes = url.split('/');
    return partes[partes.length - 2];
}

// =============================================================================
// 🌌 PERSONAJES
// =============================================================================

async function obtenerPersonajes() {
    try {
        const res = await fetch(`${BASE_URL}/people?page=1&limit=100`);
        const data = await res.json();
        personajes = data.results.map((p, index) => {
            const imgs = obtenerImagen(p.name, 'characters', index);
            return {
                ...p,
                image: imgs.src,
                imageJPG: imgs.jpg,
                imageGitHub: imgs.github,
                imageFallback: imgs.fallback
            };
        });
        return personajes;
    } catch (error) {
        console.error('Error al obtener personajes:', error);
        return [];
    }
}

async function obtenerDetallePersonaje(id) {
    try {
        const res = await fetch(`${BASE_URL}/people/${id}`);
        const data = await res.json();
        const personaje = data.result.properties;
        const imgs = obtenerImagen(personaje.name, 'characters', id);
        personaje.image = imgs.src;
        personaje.imageJPG = imgs.jpg;
        personaje.imageGitHub = imgs.github;
        personaje.imageFallback = imgs.fallback;
        return personaje;
    } catch (error) {
        console.error('Error al obtener detalle personaje:', error);
        return null;
    }
}

// =============================================================================
// 🪐 PLANETAS
// =============================================================================

async function obtenerPlanetas() {
    try {
        const res = await fetch(`${BASE_URL}/planets?page=1&limit=100`);
        const data = await res.json();
        planetas = data.results.map((p, index) => {
            const imgs = obtenerImagen(p.name, 'planets', index);
            return {
                ...p,
                image: imgs.src,
                imageJPG: imgs.jpg,
                imageGitHub: imgs.github,
                imageFallback: imgs.fallback
            };
        });
        return planetas;
    } catch (error) {
        console.error('Error al obtener planetas:', error);
        return [];
    }
}

async function obtenerDetallePlaneta(id) {
    try {
        const res = await fetch(`${BASE_URL}/planets/${id}`);
        const data = await res.json();
        const planeta = data.result.properties;
        const imgs = obtenerImagen(planeta.name, 'planets', id);
        planeta.image = imgs.src;
        planeta.imageJPG = imgs.jpg;
        planeta.imageGitHub = imgs.github;
        planeta.imageFallback = imgs.fallback;
        return planeta;
    } catch (error) {
        console.error('Error al obtener detalle planeta:', error);
        return null;
    }
}

// =============================================================================
// 🚀 NAVES
// =============================================================================

async function obtenerNaves() {
    try {
        const res = await fetch(`${BASE_URL}/starships?page=1&limit=100`);
        const data = await res.json();
        naves = data.results.map((n, index) => {
            const imgs = obtenerImagen(n.name, 'starships', index);
            return {
                ...n,
                image: imgs.src,
                imageGitHub: imgs.github,
                imageFallback: imgs.fallback
            };
        });
        return naves;
    } catch (error) {
        console.error('Error al obtener naves:', error);
        return [];
    }
}

async function obtenerDetalleNave(id) {
    try {
        const res = await fetch(`${BASE_URL}/starships/${id}`);
        const data = await res.json();
        const nave = data.result.properties;
        const imgs = obtenerImagen(nave.name, 'starships', id);
        nave.image = imgs.src;
        nave.imageGitHub = imgs.github;
        nave.imageFallback = imgs.fallback;
        return nave;
    } catch (error) {
        console.error('Error al obtener detalle nave:', error);
        return null;
    }
}

// =============================================================================
// 🎬 PELÍCULAS
// =============================================================================

async function obtenerPeliculas() {
    try {
        const res = await fetch(`${BASE_URL}/films`);
        const data = await res.json();
        peliculas = data.result?.map((f, index) => {
            const imgs = obtenerImagen(f.properties.title, 'films', index);
            return {
                ...f,
                image: imgs.src,
                imageGitHub: imgs.github,
                imageFallback: imgs.fallback
            };
        }) || [];
        return peliculas;
    } catch (error) {
        console.error('Error al obtener películas:', error);
        return [];
    }
}

async function obtenerDetallePelicula(id) {
    try {
        const res = await fetch(`${BASE_URL}/films/${id}`);
        const data = await res.json();
        const pelicula = data.result.properties;
        const imgs = obtenerImagen(pelicula.title, 'films', id);
        pelicula.image = imgs.src;
        pelicula.imageGitHub = imgs.github;
        pelicula.imageFallback = imgs.fallback;
        return pelicula;
    } catch (error) {
        console.error('Error al obtener detalle película:', error);
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

// =============================================================================
// 🚀 INICIALIZACIÓN
// =============================================================================

async function inicializarApp() {
    console.log('🚀 Iniciando Star Wars Encyclopedia...');
    await cargarImagenesStarWars(); // Primero cargamos las imágenes
    cargarFavoritos();
    await obtenerPersonajes();
    console.log('✅ App inicializada');
    Personajes();
}

// Ejecutar al cargar
inicializarApp();