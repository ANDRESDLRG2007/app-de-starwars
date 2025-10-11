// Datos globales
let personajes = [];
let planetas = [];
let naves = [];
let peliculas = [];
let favoritos = [];

// Base URL de SWAPI
const BASE_URL = 'https://www.swapi.tech/api';
const IMG_BASE = 'https://starwars-visualguide.com/assets/img';

// Función para obtener ID de la URL
function obtenerID(url) {
    const partes = url.split('/');
    return partes[partes.length - 2];
}

// Conexión para obtener lista de personajes
async function obtenerPersonajes() {
    try {
        const res = await fetch(`${BASE_URL}/people?page=1&limit=100`);
        const data = await res.json();
        personajes = data.results || [];
        return personajes;
    } catch (error) {
        console.error('Error al obtener personajes:', error);
        return [];
    }
}

// Conexión para obtener detalle de personaje
async function obtenerDetallePersonaje(id) {
    try {
        const res = await fetch(`${BASE_URL}/people/${id}`);
        const data = await res.json();
        return data.result.properties;
    } catch (error) {
        console.error('Error al obtener detalle:', error);
        return null;
    }
}

// Conexión para obtener lista de planetas
async function obtenerPlanetas() {
    try {
        const res = await fetch(`${BASE_URL}/planets?page=1&limit=100`);
        const data = await res.json();
        planetas = data.results || [];
        return planetas;
    } catch (error) {
        console.error('Error al obtener planetas:', error);
        return [];
    }
}

// Conexión para obtener detalle de planeta
async function obtenerDetallePlaneta(id) {
    try {
        const res = await fetch(`${BASE_URL}/planets/${id}`);
        const data = await res.json();
        return data.result.properties;
    } catch (error) {
        console.error('Error al obtener detalle planeta:', error);
        return null;
    }
}

// Conexión para obtener lista de naves
async function obtenerNaves() {
    try {
        const res = await fetch(`${BASE_URL}/starships?page=1&limit=100`);
        const data = await res.json();
        naves = data.results || [];
        return naves;
    } catch (error) {
        console.error('Error al obtener naves:', error);
        return [];
    }
}

// Conexión para obtener detalle de nave
async function obtenerDetalleNave(id) {
    try {
        const res = await fetch(`${BASE_URL}/starships/${id}`);
        const data = await res.json();
        return data.result.properties;
    } catch (error) {
        console.error('Error al obtener detalle nave:', error);
        return null;
    }
}

// Conexión para obtener lista de películas
async function obtenerPeliculas() {
    try {
        const res = await fetch(`${BASE_URL}/films`);
        const data = await res.json();
        peliculas = data.result || [];
        return peliculas;
    } catch (error) {
        console.error('Error al obtener películas:', error);
        return [];
    }
}

// Conexión para obtener detalle de película
async function obtenerDetallePelicula(id) {
    try {
        const res = await fetch(`${BASE_URL}/films/${id}`);
        const data = await res.json();
        return data.result.properties;
    } catch (error) {
        console.error('Error al obtener detalle película:', error);
        return null;
    }
}

// Gestión de favoritos (sin localStorage)
function cargarFavoritos() {
    // Inicializar array vacío en memoria
    if (!favoritos) {
        favoritos = [];
    }
    return favoritos;
}

function agregarFavorito(item) {
    const existe = favoritos.find(f => f.uid === item.uid && f.tipo === item.tipo);
    if (!existe) {
        favoritos.push(item);
    }
}

function eliminarFavorito(uid, tipo) {
    favoritos = favoritos.filter(f => !(f.uid === uid && f.tipo === tipo));
}

function esFavorito(uid, tipo) {
    return favoritos.some(f => f.uid === uid && f.tipo === tipo);
}

// Inicialización
async function inicializarApp() {
    cargarFavoritos();
    await obtenerPersonajes();
    Personajes();
}

// Ejecutar al cargar
inicializarApp();