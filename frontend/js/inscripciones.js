const contenedorMaterias = document.getElementById("lista-materias");
const contenedorInscripciones = document.getElementById("lista-inscripciones");

const USUARIO_INSCRIPCION = {
  id: "d097a79b-e0af-43a9-86f8-ffbb3576f793",
  rol: "estudiante"
};

async function cargarMaterias() {
  try {
    const materias = await getMaterias();
    contenedorMaterias.innerHTML = "";

    if (!materias.length) {
      contenedorMaterias.innerHTML = "<p>No hay materias disponibles.</p>";
      return;
    }

    materias.forEach((m) => {
      const div = document.createElement("div");
      div.className = "card-materia";

      div.innerHTML = `
        <h3>${m.nombre}</h3>
        <p><strong>Código:</strong> ${m.codigo}</p>
        <button onclick="inscribirme('${m.id}')">Inscribirme</button>
      `;

      contenedorMaterias.appendChild(div);
    });
  } catch (error) {
    console.error("Error cargando materias:", error);
  }
}

async function cargarInscripciones() {
  try {
    const inscripciones = await getInscripciones(USUARIO_INSCRIPCION.id);
    contenedorInscripciones.innerHTML = "";

    if (!inscripciones.length) {
      contenedorInscripciones.innerHTML = "<p>No estás inscrito en ninguna materia.</p>";
      return;
    }

    inscripciones.forEach((i) => {
      const materia = i.materias;

      const div = document.createElement("div");
      div.className = "card-inscripcion";

      div.innerHTML = `
        <h3>${materia?.nombre || "Materia"}</h3>
        <p><strong>Código:</strong> ${materia?.codigo || "-"}</p>
        <p><strong>Fecha:</strong> ${i.fecha || "-"}</p>

        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <button style="background: #17a2b8; color: white;" onclick="abrirMuroMateria('${materia?.id}', '${materia?.nombre}')">💬 Ver Muro de la Clase</button>

        <button onclick="borrarInscripcion('${i.id}')" style="background: #dc3545; color: white;">Eliminar</button>
        </div>
      `;

      contenedorInscripciones.appendChild(div);
    });
  } catch (error) {
    console.error("Error cargando inscripciones:", error);
  }
}

async function inscribirme(materiaId) {
  try {
    const inscripciones = await getInscripciones(USUARIO_INSCRIPCION.id);

    const yaInscrito = inscripciones.some(i => i.materias?.id === materiaId);

    if (yaInscrito) {
      alert("Ya estás inscrito en esta materia");
      return;
    }

    const res = await crearInscripcion({
      usuario_id: USUARIO_INSCRIPCION.id,
      materia_id: materiaId
    });

    if (res.error) {
      alert(res.error);
      return;
    }

    cargarMaterias();
    cargarInscripciones();
  } catch (error) {
    console.error("Error creando inscripción:", error);
  }
}

async function borrarInscripcion(id) {
  try {
    const res = await eliminarInscripcion(id);

    if (res.error) {
      alert(res.error);
      return;
    }

    cargarMaterias();
    cargarInscripciones();
  } catch (error) {
    console.error("Error eliminando inscripción:", error);
  }
}

cargarMaterias();
cargarInscripciones();