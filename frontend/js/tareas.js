const contenedor = document.getElementById("tareas");

// Simulación temporal
const USUARIO = {
  id: "TU_ID_REAL",
  rol: "docente"
};

// Ocultar formulario si no es docente
if (USUARIO.rol !== "docente") {
  document.querySelector("#form-crear").style.display = "none";
}

// Cargar tareas
async function cargarTareas() {
  try {
    const tareas = await getTareas();

    contenedor.innerHTML = "";

    tareas.forEach((t) => {
      const div = document.createElement("div");
      div.className = "card-tarea";

      const estadoTexto = t.estado || "pendiente";

      div.innerHTML = `
        <h3>${t.titulo}</h3>
        <p>${t.descripcion || ""}</p>
        <p><strong>Nota máxima:</strong> ${t.nota_maxima ?? "-"}</p>
        <p><strong>Grupo:</strong> ${t.grupo || "-"}</p>
        <p><strong>Creador:</strong> ${t.usuarios?.nombre || "Desconocido"}</p>
        <p><strong>Estado:</strong> 
          <span class="estado-badge estado-${estadoTexto}">
            ${estadoTexto}
          </span>
        </p>

        <div class="acciones-estado">
          <button onclick="cambiarEstado('${t.id}', 'pendiente')">Pendiente</button>
          <button onclick="cambiarEstado('${t.id}', 'en_progreso')">En progreso</button>
          <button onclick="cambiarEstado('${t.id}', 'completada')">Completada</button>
        </div>

        <button class="btn-ver-detalles" onclick="abrirDetalle('${t.id}')">Ver Detalles Completos</button>

        <hr>
      `;

      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error("Error cargando tareas:", error);
  }
}

// Crear tarea
async function crearTarea() {
  try {
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const fecha_entrega = document.getElementById("fecha_entrega").value;
    const instrucciones = document.getElementById("instrucciones").value;
    const nota_maxima = document.getElementById("nota_maxima").value;
    const grupo = document.getElementById("grupo").value;

    if (!titulo) {
      alert("El título es obligatorio");
      return;
    }

    const res = await postTarea({
      titulo,
      descripcion,
      fecha_entrega,
      creador_id: USUARIO.id,
      instrucciones,
      nota_maxima: nota_maxima ? Number(nota_maxima) : null,
      grupo
    });

    if (res.error) {
      alert(res.error);
      return;
    }

    document.getElementById("titulo").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("fecha_entrega").value = "";
    document.getElementById("instrucciones").value = "";
    document.getElementById("nota_maxima").value = "";
    document.getElementById("grupo").value = "";

    cargarTareas();
  } catch (error) {
    console.error("Error creando tarea:", error);
  }
}

// Cambiar estado
async function cambiarEstado(id, estado) {
  try {
    const res = await patchEstadoTarea(id, estado);

    if (res.error) {
      alert(res.error);
      return;
    }

    cargarTareas();
  } catch (error) {
    console.error("Error cambiando estado:", error);
  }
}

// Inicial
cargarTareas();