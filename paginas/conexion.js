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
                try {
                    // Obtener detalles completos de cada personaje
                    const detailRes = await fetch(`${BASE_URL}/people/${p.uid}`);
                    const detailData = await detailRes.json();
                    const props = detailData.result.properties;
                    
                    const imagen = await obtenerImagen(p.name, 'personajes');
                    return { 
                        uid: p.uid, 
                        name: props.name || p.name, 
                        image: imagen,
                        height: props.height,
                        mass: props.mass,
                        hair_color: props.hair_color,
                        skin_color: props.skin_color,
                        eye_color: props.eye_color,
                        birth_year: props.birth_year,
                        gender: props.gender
                    };
                } catch (error) {
                    console.error(`Error al obtener detalles del personaje ${p.name}:`, error);
                    const imagen = await obtenerImagen(p.name, 'personajes');
                    return {
                        uid: p.uid,
                        name: p.name,
                        image: imagen
                    };
                }
            })
        );

        console.log("✅ Personajes cargados con detalles:", personajes[0]);
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

        // Filtrar planetas desconocidos
        const planetasFiltrados = data.results.filter(p => p.name.toLowerCase() !== "unknown");

        planetas = await Promise.all(
            planetasFiltrados.map(async (p) => {
                try {
                    // Obtener detalles completos de cada planeta
                    const detailRes = await fetch(`${BASE_URL}/planets/${p.uid}`);
                    const detailData = await detailRes.json();
                    const props = detailData.result.properties;
                    
                    return {
                        uid: p.uid,
                        name: props.name || p.name,
                        image: `img/planeta/${normalizarNombreArchivo(p.name)}.webp`,
                        climate: props.climate,
                        terrain: props.terrain,
                        population: props.population,
                        diameter: props.diameter,
                        rotation_period: props.rotation_period,
                        orbital_period: props.orbital_period,
                        gravity: props.gravity,
                        surface_water: props.surface_water
                    };
                } catch (error) {
                    console.error(`Error al obtener detalles del planeta ${p.name}:`, error);
                    return {
                        uid: p.uid,
                        name: p.name,
                        image: `img/planeta/${normalizarNombreArchivo(p.name)}.webp`
                    };
                }
            })
        );

        console.log("✅ Planetas cargados con detalles:", planetas[0]);
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
                try {
                    // Obtener detalles completos de cada nave
                    const detailRes = await fetch(`${BASE_URL}/starships/${n.uid}`);
                    const detailData = await detailRes.json();
                    const props = detailData.result.properties;
                    
                    const imagen = await obtenerImagen(n.name, 'naves');
                    return { 
                        uid: n.uid, 
                        name: props.name || n.name, 
                        image: imagen,
                        model: props.model,
                        manufacturer: props.manufacturer,
                        starship_class: props.starship_class,
                        cost_in_credits: props.cost_in_credits,
                        length: props.length,
                        crew: props.crew,
                        passengers: props.passengers,
                        max_atmosphering_speed: props.max_atmosphering_speed,
                        hyperdrive_rating: props.hyperdrive_rating,
                        MGLT: props.MGLT,
                        cargo_capacity: props.cargo_capacity,
                        consumables: props.consumables
                    };
                } catch (error) {
                    console.error(`Error al obtener detalles de la nave ${n.name}:`, error);
                    const imagen = await obtenerImagen(n.name, 'naves');
                    return {
                        uid: n.uid,
                        name: n.name,
                        image: imagen
                    };
                }
            })
        );

        console.log("✅ Naves cargadas con detalles:", naves[0]);
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

        especies = await Promise.all(
            data.results.map(async (e) => {
                try {
                    // Obtener detalles completos de cada especie
                    const detailRes = await fetch(`${BASE_URL}/species/${e.uid}`);
                    const detailData = await detailRes.json();
                    const props = detailData.result.properties;
                    
                    return {
                        uid: e.uid,
                        name: props.name || e.name,
                        image: `img/especies/${normalizarNombreArchivo(e.name)}.webp`,
                        classification: props.classification,
                        designation: props.designation,
                        average_height: props.average_height,
                        average_lifespan: props.average_lifespan,
                        eye_colors: props.eye_colors,
                        hair_colors: props.hair_colors,
                        skin_colors: props.skin_colors,
                        language: props.language
                    };
                } catch (error) {
                    console.error(`Error al obtener detalles de la especie ${e.name}:`, error);
                    return {
                        uid: e.uid,
                        name: e.name,
                        image: `img/especies/${normalizarNombreArchivo(e.name)}.webp`
                    };
                }
            })
        );

        console.log("✅ Especies cargadas con detalles:", especies[0]);
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

        vehiculos = await Promise.all(
            data.results.map(async (v) => {
                try {
                    // Obtener detalles completos de cada vehículo
                    const detailRes = await fetch(`${BASE_URL}/vehicles/${v.uid}`);
                    const detailData = await detailRes.json();
                    const props = detailData.result.properties;
                    
                    return {
                        uid: v.uid,
                        name: props.name || v.name,
                        image: `img/vehiculos/${normalizarNombreArchivo(v.name)}.webp`,
                        model: props.model,
                        manufacturer: props.manufacturer,
                        vehicle_class: props.vehicle_class,
                        cost_in_credits: props.cost_in_credits,
                        length: props.length,
                        crew: props.crew,
                        passengers: props.passengers,
                        max_atmosphering_speed: props.max_atmosphering_speed,
                        cargo_capacity: props.cargo_capacity,
                        consumables: props.consumables
                    };
                } catch (error) {
                    console.error(`Error al obtener detalles del vehículo ${v.name}:`, error);
                    return {
                        uid: v.uid,
                        name: v.name,
                        image: `img/vehiculos/${normalizarNombreArchivo(v.name)}.webp`
                    };
                }
            })
        );

        console.log("✅ Vehículos cargados con detalles:", vehiculos[0]);
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
        // Primero buscar en el array cargado
        const personajeEnArray = personajes.find(p => p.uid === id);
        if (personajeEnArray && personajeEnArray.gender) {
            console.log("✅ Personaje encontrado en array:", personajeEnArray);
            return personajeEnArray;
        }

        // Si no está o no tiene detalles, hacer petición
        const res = await fetch(`${BASE_URL}/people/${id}`);
        const data = await res.json();
        const personaje = data.result.properties;

        const imagen = await obtenerImagen(personaje.name, 'personajes');

        return {
            uid: id,
            name: personaje.name || 'Desconocido',
            image: imagen,
            height: personaje.height,
            mass: personaje.mass,
            hair_color: personaje.hair_color,
            skin_color: personaje.skin_color,
            eye_color: personaje.eye_color,
            birth_year: personaje.birth_year,
            gender: personaje.gender
        };
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
        // Primero buscar en el array cargado
        const planetaEnArray = planetas.find(p => p.uid === id);
        if (planetaEnArray && planetaEnArray.climate) {
            console.log("✅ Planeta encontrado en array:", planetaEnArray);
            return planetaEnArray;
        }

        // Si no está o no tiene detalles, hacer petición
        const res = await fetch(`${BASE_URL}/planets/${id}`);
        const data = await res.json();
        const planeta = data.result.properties;

        return {
            uid: id,
            name: planeta.name || 'Desconocido',
            image: `img/planeta/${normalizarNombreArchivo(planeta.name)}.webp`,
            climate: planeta.climate,
            terrain: planeta.terrain,
            population: planeta.population,
            diameter: planeta.diameter,
            rotation_period: planeta.rotation_period,
            orbital_period: planeta.orbital_period,
            gravity: planeta.gravity,
            surface_water: planeta.surface_water
        };
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
        // Primero buscar en el array cargado
        const naveEnArray = naves.find(n => n.uid === id);
        if (naveEnArray && naveEnArray.starship_class) {
            console.log("✅ Nave encontrada en array:", naveEnArray);
            return naveEnArray;
        }

        // Si no está o no tiene detalles, hacer petición
        const res = await fetch(`${BASE_URL}/starships/${id}`);
        const data = await res.json();
        const nave = data.result.properties;

        const imagen = await obtenerImagen(nave.name, 'naves');

        return {
            uid: id,
            name: nave.name || 'Desconocido',
            image: imagen,
            model: nave.model,
            manufacturer: nave.manufacturer,
            starship_class: nave.starship_class,
            cost_in_credits: nave.cost_in_credits,
            length: nave.length,
            crew: nave.crew,
            passengers: nave.passengers,
            max_atmosphering_speed: nave.max_atmosphering_speed,
            hyperdrive_rating: nave.hyperdrive_rating,
            MGLT: nave.MGLT,
            cargo_capacity: nave.cargo_capacity,
            consumables: nave.consumables
        };
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