// minijuego.js

async function Minijuego() {
    const root = document.getElementById("root");
    root.innerHTML = ""; // limpiar

    // Título
    const titulo = document.createElement("h1");
    titulo.className = "titulo-seccion";
    titulo.textContent = "🎮 Minijuego de Star Wars";
    root.appendChild(titulo);

    // Info de instrucciones
    const instrucciones = document.createElement("p");
    instrucciones.textContent = "Adivina el personaje previo seleccionado al azar de Star Wars. Tienes 5 intentos.";
    root.appendChild(instrucciones);

    // Botón para empezar
    const btnStart = document.createElement("button");
    btnStart.textContent = "Iniciar juego";
    root.appendChild(btnStart);

    btnStart.addEventListener("click", () => iniciarJuego(root));
}

async function iniciarJuego(root) {
    root.innerHTML = ""; // limpiar todo
    // Elegir al azar un personaje (por ejemplo) de la API
    let targetData;
    try {
        // escoger un id aleatorio de personajes, p.ej entre 1 y 83 (depende de la API)
        const randomId = Math.floor(Math.random() * 83) + 1;
        const res = await fetch(`https://www.swapi.tech/api/people/${randomId}`);
        const json = await res.json();
        if (!json || !json.result) {
            throw new Error("No se pudo obtener personaje");
        }
        targetData = json.result.properties;
        targetData.uid = json.result.uid;
        targetData.name = json.result.name;
        // Si tienes una imagen en tu conexion.js, supongamos que targetData.image = …
        // Si no, puedes usar un fallback.
    } catch (err) {
        root.innerHTML = "<p>Error al cargar el juego. Intenta de nuevo.</p>";
        console.error(err);
        return;
    }

    // Mostrar pista inicial (por ejemplo: género, altura)
    const pistaDiv = document.createElement("div");
    pistaDiv.className = "pista";
    pistaDiv.innerHTML = `
        <p><strong>Pista:</strong> Género: ${targetData.gender || "desconocido"}</p>
        <p><strong>Pista:</strong> Altura: ${targetData.height} cm (aprox)</p>
    `;
    root.appendChild(pistaDiv);

    // Campo de input y botón para adivinar
    const formDiv = document.createElement("div");
    formDiv.className = "intento-form";
    formDiv.innerHTML = `
        <input type="text" id="guessInput" placeholder="Escribe el nombre aquí">
        <button id="guessBtn">Adivinar</button>
        <p id="feedback"></p>
        <p>Intentos restantes: <span id="intentosRestantes">5</span></p>
    `;
    root.appendChild(formDiv);

    let intentos = 5;
    const feedbackP = formDiv.querySelector("#feedback");
    const inputGuess = formDiv.querySelector("#guessInput");
    const btnGuess = formDiv.querySelector("#guessBtn");
    const intentosSpan = formDiv.querySelector("#intentosRestantes");

    btnGuess.addEventListener("click", () => {
        const guess = inputGuess.value.trim().toLowerCase();
        if (!guess) {
            feedbackP.textContent = "Por favor escribe algo.";
            return;
        }
        if (guess === targetData.name.toLowerCase()) {
            // Ganó
            mostrarResultado(root, targetData, true);
        } else {
            intentos--;
            if (intentos <= 0) {
                mostrarResultado(root, targetData, false);
            } else {
                feedbackP.textContent = `¡No es correcto! Intenta de nuevo.`;
                intentosSpan.textContent = intentos;
            }
        }
        inputGuess.value = "";
        inputGuess.focus();
    });
}

function mostrarResultado(root, targetData, gano) {
    root.innerHTML = ""; // limpiar

    const resultadoDiv = document.createElement("div");
    resultadoDiv.className = "resultado-juego";

    if (gano) {
        resultadoDiv.innerHTML = `<h2>🎉 ¡Correcto!</h2><p>El personaje era: <strong>${targetData.name}</strong></p>`;
    } else {
        resultadoDiv.innerHTML = `<h2>😞 Fin de los intentos</h2><p>El personaje era: <strong>${targetData.name}</strong></p>`;
    }

    // Mostrar imagen si se tiene
    const img = document.createElement("img");
    img.src = targetData.image || "img/fallback.webp";
    img.alt = targetData.name;
    img.onerror = () => { img.src = "img/fallback.webp"; };
    resultadoDiv.appendChild(img);

    // Mostrar algunos detalles interesantes
    const detalles = document.createElement("div");
    detalles.className = "detalles";
    detalles.innerHTML = `
        <p>Altura: ${targetData.height} cm</p>
        <p>Género: ${targetData.gender || "desconocido"}</p>
        <p>Color de ojos: ${targetData.eye_color || "desconocido"}</p>
    `;
    resultadoDiv.appendChild(detalles);

    // Botón para jugar de nuevo
    const volverBtn = document.createElement("button");
    volverBtn.textContent = "Jugar de nuevo";
    volverBtn.addEventListener("click", () => Minijuego());
    resultadoDiv.appendChild(volverBtn);

    root.appendChild(resultadoDiv);
}
