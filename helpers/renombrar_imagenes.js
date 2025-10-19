// ============================================================================
// 🪐 RENOMBRAR IMÁGENES Star Wars (personajes, planeta, naves, films)
// Detecta variantes, normaliza nombres y evita colisiones
// code node renombrar_imagenes.js

// ============================================================================
const fs = require('fs');
const path = require('path');

const carpetas = [
  'img/vehiculos','img/especies'
];

// 🔡 Igual que tu normalizador en conexión.js
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
    .replace(/[^a-z0-9_.-]/g, '');
}

carpetas.forEach(carpeta => {
  const dir = path.join(__dirname, carpeta);
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️ Carpeta no encontrada: ${carpeta}`);
    return;
  }

  console.log(`\n📁 Procesando carpeta: ${carpeta}`);
  const archivos = fs.readdirSync(dir);

  archivos.forEach(archivo => {
    const rutaVieja = path.join(dir, archivo);
    if (!fs.statSync(rutaVieja).isFile()) return;

    const ext = path.extname(archivo);
    const base = path.basename(archivo, ext);
    const nuevoNombre = normalizarNombreArchivo(base) + ext.toLowerCase();
    const rutaNueva = path.join(dir, nuevoNombre);

    if (archivo !== nuevoNombre) {
      if (fs.existsSync(rutaNueva)) {
        let i = 1;
        let rutaSufijo;
        do {
          rutaSufijo = path.join(dir, `${normalizarNombreArchivo(base)}_${i}${ext.toLowerCase()}`);
          i++;
        } while (fs.existsSync(rutaSufijo));
        fs.renameSync(rutaVieja, rutaSufijo);
        console.log(`🔁 ${archivo} → ${path.basename(rutaSufijo)} (colisión evitada)`);
      } else {
        fs.renameSync(rutaVieja, rutaNueva);
        console.log(`✅ ${archivo} → ${nuevoNombre}`);
      }
    }
  });
});

console.log('\n🌟 Renombrado completado.');
