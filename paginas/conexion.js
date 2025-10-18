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
        console.log(`Imágenes cargadas (${imagenesStarWars.length})`);
    } catch (error) {
        console.error('Error al cargar imágenes desde GitHub:', error);
        imagenesStarWars = [];
    }
}

// 🔍 Buscar imagen asociada a un nombre (o usar placeholder)
function obtenerImagen(nombre, tipo, id) {
    if (!imagenesStarWars || imagenesStarWars.length === 0) {
        return obtenerImagenPorDefecto(tipo, nombre, id);
    }

    // Buscar coincidencia aproximada por nombre
    const imgData = imagenesStarWars.find(
        p => p.name.toLowerCase().includes(nombre.toLowerCase())
    );

    return imgData?.image || obtenerImagenPorDefecto(tipo, nombre, id);
}

// 🧱 Placeholder SVG
function obtenerImagenPorDefecto(tipo, nombre, id) {
    const configs = {
        'characters': { emoji: '👤', color: 'FFE81F', bg: '1a1a1a' },
        'planets': { emoji: '🌍', color: '4CAF50', bg: '0a1a0a' },
        'starships': { emoji: '🚀', color: '2196F3', bg: '0a0a1a' },
        'films': { emoji: '🎬', color: 'FF5722', bg: '1a0a0a' }
    };

    const config = configs[tipo] || configs['characters'];
    const nombreCorto = nombre.substring(0, 20);

    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g${id}' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23${config.bg}'/%3E%3Cstop offset='100%25' style='stop-color:%23000'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g${id})' width='400' height='400'/%3E%3Ccircle cx='200' cy='160' r='70' fill='%23${config.color}' opacity='0.15'/%3E%3Ctext fill='%23${config.color}' font-size='100' x='200' y='210' text-anchor='middle' dominant-baseline='middle'%3E${config.emoji}%3C/text%3E%3Ctext fill='%23${config.color}' font-size='20' x='200' y='300' text-anchor='middle' font-weight='bold'%3E${encodeURIComponent(nombreCorto)}%3C/text%3E%3C/svg%3E`;
}

// 🧩 Utilidad
function obtenerID(url) {
    const partes = url.split('/');
    return partes[partes.length - 2];
}

// 🌌 PERSONAJES
async function obtenerPersonajes() {
    try {
        const res = await fetch(`${BASE_URL}/people?page=1&limit=100`);
        const data = await res.json();
        personajes = data.results.map((p, index) => ({
            ...p,
            image: obtenerImagen(p.name, 'characters', index)
        }));
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
        personaje.image = obtenerImagen(personaje.name, 'characters', id);
        return personaje;
    } catch (error) {
        console.error('Error al obtener detalle personaje:', error);
        return null;
    }
}

// 🪐 PLANETAS
async function obtenerPlanetas() {
    try {
        const res = await fetch(`${BASE_URL}/planets?page=1&limit=100`);
        const data = await res.json();
        planetas = data.results.map((p, index) => ({
            ...p,
            image: obtenerImagen(p.name, 'planets', index)
        }));
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
        planeta.image = obtenerImagen(planeta.name, 'planets', id);
        return planeta;
    } catch (error) {
        console.error('Error al obtener detalle planeta:', error);
        return null;
    }
}

// 🚀 NAVES
async function obtenerNaves() {
    try {
        const res = await fetch(`${BASE_URL}/starships?page=1&limit=100`);
        const data = await res.json();
        naves = data.results.map((n, index) => ({
            ...n,
            image: obtenerImagen(n.name, 'starships', index)
        }));
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
        nave.image = obtenerImagen(nave.name, 'starships', id);
        return nave;
    } catch (error) {
        console.error('Error al obtener detalle nave:', error);
        return null;
    }
}

// 🎬 PELÍCULAS
async function obtenerPeliculas() {
    try {
        const res = await fetch(`${BASE_URL}/films`);
        const data = await res.json();
        peliculas = data.result?.map((f, index) => ({
            ...f,
            image: obtenerImagen(f.properties.title, 'films', index)
        })) || [];
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
        pelicula.image = obtenerImagen(pelicula.title, 'films', id);
        return pelicula;
    } catch (error) {
        console.error('Error al obtener detalle película:', error);
        return null;
    }
}

// ⭐ Favoritos
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

// 🚀 Inicialización
async function inicializarApp() {
    await cargarImagenesStarWars(); // Primero cargamos las imágenes
    cargarFavoritos();
    await obtenerPersonajes();
    Personajes();
}

// Ejecutar al cargar
inicializarApp();
