// ================================================================
// 🌌 Star Wars Encyclopedia - conexion.js (LAZY LOADING)
// ================================================================

let personajes = [];
let planetas = [];
let naves = [];
let peliculas = [];
let especies = [];
let vehiculos = [];
let favoritos = [];
let imagenesStarWars = [];

// Flags para saber si ya se cargaron los detalles
let personajesDetallesCargados = false;
let planetasDetallesCargados = false;
let navesDetallesCargados = false;
let especiesDetallesCargados = false;
let vehiculosDetallesCargados = false;

const BASE_URL = 'https://www.swapi.tech/api';
const IMG_URL = 'https://akabab.github.io/starwars-api/api/all.json';

// =======================
// 🖼️ Cargar imágenes desde GitHub
// =======================
async function cargarImagenesStarWars() {
    try {
        const res = await fetch(IMG_URL);
        imagenesStarWars = await res.json();
        console.log(`✅ Imágenes: ${imagenesStarWars.length}`);
    } catch (error) {
        console.error('❌ Error al cargar imágenes:', error);
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

// =======================
// 🖼️ Obtener imagen CON CACHÉ localStorage
// =======================
async function obtenerImagen(nombre, categoria = "personajes") {
    const key = `img_${categoria}_${nombre}`;
    const cache = localStorage.getItem(key);
    if (cache) return cache;
    
    const nombreNormalizado = normalizarNombreArchivo(nombre);
    const fallback = "img/fallback.webp";
    
    const personajeAkabab = imagenesStarWars.find(
        img => img.name.toLowerCase() === nombre.toLowerCase()
    );
    
    const url = personajeAkabab?.image || `img/${categoria}/${nombreNormalizado}.webp`;
    localStorage.setItem(key, url);
    return url;
}

// =======================
// 🌌 PERSONAJES - LISTA BÁSICA (sin detalles ni imágenes)
// =======================
async function obtenerPersonajesBasico() {
    try {
        const res = await fetch(`${BASE_URL}/people?page=1&limit=100`);
        const data = await res.json();

        personajes = data.results.map(p => ({
            uid: p.uid,
            name: p.name,
            image: null // Sin imagen aún
        }));

        console.log(`✅ Personajes (básico): ${personajes.length}`);
        return personajes;
    } catch (error) {
        console.error('❌ Error al obtener personajes:', error);
        return [];
    }
}

// =======================
// 🌌 PERSONAJES - CARGAR DETALLES COMPLETOS (con imágenes)
// =======================
async function cargarDetallesPersonajes() {
    if (personajesDetallesCargados) {
        console.log('✅ Detalles de personajes ya cargados');
        return personajes;
    }

    console.log('⏳ Cargando detalles de personajes...');
    
    try {
        personajes = await Promise.all(
            personajes.map(async (p) => {
                try {
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
                    const imagen = await obtenerImagen(p.name, 'personajes');
                    return {
                        uid: p.uid,
                        name: p.name,
                        image: imagen
                    };
                }
            })
        );

        personajesDetallesCargados = true;
        console.log(`✅ Detalles de personajes cargados: ${personajes.length}`);
        return personajes;
    } catch (error) {
        console.error('❌ Error al cargar detalles de personajes:', error);
        return personajes;
    }
}

// =======================
// 🪐 PLANETAS - LISTA BÁSICA
// =======================
async function obtenerPlanetasBasico() {
    try {
        const res = await fetch(`${BASE_URL}/planets?page=1&limit=100`);
        const data = await res.json();

        planetas = data.results
            .filter(p => p.name.toLowerCase() !== "unknown")
            .map(p => ({
                uid: p.uid,
                name: p.name,
                image: `img/planeta/${normalizarNombreArchivo(p.name)}.webp`
            }));

        console.log(`✅ Planetas (básico): ${planetas.length}`);
        return planetas;
    } catch (error) {
        console.error('❌ Error al obtener planetas:', error);
        return [];
    }
}

// =======================
// 🪐 PLANETAS - CARGAR DETALLES COMPLETOS
// =======================
async function cargarDetallesPlanetas() {
    if (planetasDetallesCargados) {
        console.log('✅ Detalles de planetas ya cargados');
        return planetas;
    }

    console.log('⏳ Cargando detalles de planetas...');
    
    try {
        planetas = await Promise.all(
            planetas.map(async (p) => {
                try {
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
                    return p;
                }
            })
        );

        planetasDetallesCargados = true;
        console.log(`✅ Detalles de planetas cargados: ${planetas.length}`);
        return planetas;
    } catch (error) {
        console.error('❌ Error al cargar detalles de planetas:', error);
        return planetas;
    }
}

// =======================
// 🚀 NAVES - LISTA BÁSICA
// =======================
async function obtenerNavesBasico() {
    try {
        const res = await fetch(`${BASE_URL}/starships?page=1&limit=100`);
        const data = await res.json();

        naves = data.results.map(n => ({
            uid: n.uid,
            name: n.name,
            image: null
        }));

        console.log(`✅ Naves (básico): ${naves.length}`);
        return naves;
    } catch (error) {
        console.error('❌ Error al obtener naves:', error);
        return [];
    }
}

// =======================
// 🚀 NAVES - CARGAR DETALLES COMPLETOS
// =======================
async function cargarDetallesNaves() {
    if (navesDetallesCargados) {
        console.log('✅ Detalles de naves ya cargados');
        return naves;
    }

    console.log('⏳ Cargando detalles de naves...');
    
    try {
        naves = await Promise.all(
            naves.map(async (n) => {
                try {
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
                    const imagen = await obtenerImagen(n.name, 'naves');
                    return {
                        uid: n.uid,
                        name: n.name,
                        image: imagen
                    };
                }
            })
        );

        navesDetallesCargados = true;
        console.log(`✅ Detalles de naves cargados: ${naves.length}`);
        return naves;
    } catch (error) {
        console.error('❌ Error al cargar detalles de naves:', error);
        return naves;
    }
}

// =======================
// 👽 ESPECIES - LISTA BÁSICA
// =======================
async function obtenerEspeciesBasico() {
    try {
        const res = await fetch(`${BASE_URL}/species?page=1&limit=100`);
        const data = await res.json();

        especies = data.results.map(e => ({
            uid: e.uid,
            name: e.name,
            image: `img/especies/${normalizarNombreArchivo(e.name)}.webp`
        }));

        console.log(`✅ Especies (básico): ${especies.length}`);
        return especies;
    } catch (error) {
        console.error('❌ Error al obtener especies:', error);
        return [];
    }
}

// =======================
// 👽 ESPECIES - CARGAR DETALLES COMPLETOS
// =======================
async function cargarDetallesEspecies() {
    if (especiesDetallesCargados) {
        console.log('✅ Detalles de especies ya cargados');
        return especies;
    }

    console.log('⏳ Cargando detalles de especies...');
    
    try {
        especies = await Promise.all(
            especies.map(async (e) => {
                try {
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
                    return e;
                }
            })
        );

        especiesDetallesCargados = true;
        console.log(`✅ Detalles de especies cargados: ${especies.length}`);
        return especies;
    } catch (error) {
        console.error('❌ Error al cargar detalles de especies:', error);
        return especies;
    }
}

// =======================
// 🚗 VEHÍCULOS - LISTA BÁSICA
// =======================
async function obtenerVehiculosBasico() {
    try {
        const res = await fetch(`${BASE_URL}/vehicles?page=1&limit=100`);
        const data = await res.json();

        vehiculos = data.results.map(v => ({
            uid: v.uid,
            name: v.name,
            image: `img/vehiculos/${normalizarNombreArchivo(v.name)}.webp`
        }));

        console.log(`✅ Vehículos (básico): ${vehiculos.length}`);
        return vehiculos;
    } catch (error) {
        console.error('❌ Error al obtener vehículos:', error);
        return [];
    }
}

// =======================
// 🚗 VEHÍCULOS - CARGAR DETALLES COMPLETOS
// =======================
async function cargarDetallesVehiculos() {
    if (vehiculosDetallesCargados) {
        console.log('✅ Detalles de vehículos ya cargados');
        return vehiculos;
    }

    console.log('⏳ Cargando detalles de vehículos...');
    
    try {
        vehiculos = await Promise.all(
            vehiculos.map(async (v) => {
                try {
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
                    return v;
                }
            })
        );

        vehiculosDetallesCargados = true;
        console.log(`✅ Detalles de vehículos cargados: ${vehiculos.length}`);
        return vehiculos;
    } catch (error) {
        console.error('❌ Error al cargar detalles de vehículos:', error);
        return vehiculos;
    }
}

// =======================
// 🎬 PELÍCULAS
// =======================
async function obtenerPeliculas() {
    try {
        const res = await fetch(`${BASE_URL}/films`);
        const data = await res.json();

        peliculas = data.result.map(f => ({
            uid: f.uid,
            title: f.properties.title,
            episode_id: f.properties.episode_id,
            director: f.properties.director,
            producer: f.properties.producer,
            release_date: f.properties.release_date,
            opening_crawl: f.properties.opening_crawl,
            image: `img/films/${normalizarNombreArchivo(f.properties.title)}.webp`
        }));

        console.log(`🎬 Películas cargadas: ${peliculas.length}`);
        return peliculas;
    } catch (error) {
        console.error('❌ Error al obtener películas:', error);
        return [];
    }
}

// =======================
// 🧍 Obtener detalle de PERSONAJE
// =======================
async function obtenerDetallePersonaje(id) {
    try {
        const personajeEnArray = personajes.find(p => p.uid === id);
        if (personajeEnArray && personajeEnArray.gender) {
            return personajeEnArray;
        }

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
        const planetaEnArray = planetas.find(p => p.uid === id);
        if (planetaEnArray && planetaEnArray.climate) {
            return planetaEnArray;
        }

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
        const naveEnArray = naves.find(n => n.uid === id);
        if (naveEnArray && naveEnArray.starship_class) {
            return naveEnArray;
        }

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
// 🎬 Obtener detalle de PELÍCULA con caché localStorage
// =======================
async function obtenerDetallePelicula(id) {
    const cacheKey = `pelicula_${id}`;
    const cache = localStorage.getItem(cacheKey);

    // Si ya está guardada en cache, la usamos directamente
    if (cache) {
        console.log(`🎥 Película ${id} cargada desde caché`);
        return JSON.parse(cache);
    }

    try {
        const res = await fetch(`${BASE_URL}/films/${id}`);
        const data = await res.json();
        const pelicula = data.result.properties;

        const peliculaObj = {
            uid: id,
            title: pelicula.title || 'Desconocida',
            episode_id: pelicula.episode_id,
            director: pelicula.director,
            producer: pelicula.producer,
            release_date: pelicula.release_date,
            opening_crawl: pelicula.opening_crawl,
            image: `img/films/${normalizarNombreArchivo(pelicula.title)}.webp`,
            imageGitHub: null, // podrías poner URL alternativa si la tuvieras
            imageFallback: 'img/fallback.webp'
        };

        // Guardar en cache local
        localStorage.setItem(cacheKey, JSON.stringify(peliculaObj));
        console.log(`✅ Película ${pelicula.title} guardada en caché`);

        return peliculaObj;
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

// =============================================================================
// 🔄 FUNCIÓN PARA LIMPIAR CACHÉ Y RECARGAR TODO
// =============================================================================
function limpiarCacheYRecargar() {
    console.log('🧹 Limpiando localStorage...');
    localStorage.clear();
    console.log('🔄 Recargando página...');
    location.reload();
}


// =======================
// 🚀 Inicialización - SOLO LISTAS BÁSICAS
// =======================
async function inicializarApp() {
    const root = document.getElementById("root");
    
    root.innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner"></div>
            <h2 style="color: var(--color-primary); margin-top: 2rem;">Cargando Star Wars Encyclopedia...</h2>
            <p style="color: #aaa; margin-top: 1rem;">Conectando con la galaxia...</p>
        </div>
    `;
    
    console.log("🚀 Iniciando Star Wars Encyclopedia...");
    
    try {
        // Solo cargar listas básicas (rápido)
        await Promise.all([
            cargarImagenesStarWars(),
            obtenerPersonajesBasico(),
            obtenerPlanetasBasico(),
            obtenerNavesBasico(),
            obtenerEspeciesBasico(),
            obtenerVehiculosBasico(),
            obtenerPeliculas()
        ]);
        
        console.log(`📊 Datos básicos: ${personajes.length} personajes, ${planetas.length} planetas, ${naves.length} naves, ${especies.length} especies, ${vehiculos.length} vehículos, ${peliculas.length} películas`);
        console.log('⚡ Carga inicial completa - Las imágenes se cargarán al entrar a cada sección');
        
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