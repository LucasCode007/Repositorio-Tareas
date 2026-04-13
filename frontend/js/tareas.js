const contenedor = document.getElementById("tareas");

// Simulación temporal
const USUARIO = JSON.parse(localStorage.getItem("usuario")) || {
  id: "46b15198-b5d4-4455-994e-12e0382db3c9",
  rol: "docente"
};

// Ocultar formulario si no es docente
if (USUARIO.rol !== "docente") {
  const formCrear = document.querySelector("#form-crear");
  if (formCrear) formCrear.style.display = "none";
}

// Modal simple para entregar tarea
let tareaSeleccionada = null;

function mostrarToast(mensaje) {
  alert(mensaje);
}

function abrirModalEntrega(tarea) {
  tareaSeleccionada = tarea;

  const modalExistente = document.getElementById("modal-entrega");
  if (modalExistente) {
    modalExistente.style.display = "flex";
    document.getElementById("modal-titulo-tarea").textContent = tarea.titulo;
    document.getElementById("input-contenido-entrega").value = "";
    return;
  }

  const modal = document.createElement("div");
  modal.id = "modal-entrega";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <button class="btn-cerrar" onclick="cerrarModalEntrega()">X Cerrar</button>
      <h2 id="modal-titulo-tarea">${tarea.titulo}</h2>
      <textarea id="input-contenido-entrega" rows="6" placeholder="Escribe tu entrega aquí..."></textarea>
      <br><br>
      <button class="btn-accion" onclick="confirmarEntregaDesdeTareas()">Enviar entrega</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function cerrarModalEntrega() {
  const modal = document.getElementById("modal-entrega");
  if (modal) {
    modal.style.display = "none";
  }
}

async function confirmarEntregaDesdeTareas() {
  const input = document.getElementById("input-contenido-entrega");
  const contenido = input?.value.trim();

  if (!contenido) {
    mostrarToast("Escribe algo antes de enviar.");
    return;
  }

  const res = await entregarTarea(
    tareaSeleccionada.id,
    USUARIO.id,
    contenido
  );

  if (res.error) {
    mostrarToast(res.error);
    return;
  }

  cerrarModalEntrega();
  mostrarToast("Tarea entregada correctamente.");
  cargarTareas();
}

// Cargar tareas según rol
async function cargarTareas() {
  try {
    const tareas = await getTareas();
    contenedor.innerHTML = "";

    let tareasAMostrar = tareas;

    // Si es estudiante, solo ve tareas de materias inscritas
    if (USUARIO.rol === "estudiante") {
      const inscripciones = await getInscripciones(USUARIO.id);

      const materiasInscritas = inscripciones
        .map((ins) => ins.materias?.id)
        .filter(Boolean);

      tareasAMostrar = tareas.filter((t) =>
        materiasInscritas.includes(t.materia_id)
      );
    }

    if (!tareasAMostrar.length) {
      contenedor.innerHTML = "<p>No hay tareas disponibles.</p>";
      return;
    }

    let misEntregas = [];
    if (USUARIO.rol === "estudiante") {
      misEntregas = await obtenerMisEntregas(USUARIO.id);
    }

    tareasAMostrar.forEach((t) => {
      const div = document.createElement("div");
      div.className = "card-tarea";

      const estadoTexto = t.estado || "pendiente";
      const miEntrega = USUARIO.rol === "estudiante"
        ? misEntregas.find((e) => e.tarea_id === t.id)
        : null;

      div.innerHTML = `
        <h3>${t.titulo}</h3>
        <p>${t.descripcion || ""}</p>
        <p><strong>Materia:</strong> ${t.materias?.nombre || "Sin materia"}</p>
        <p><strong>Grupo:</strong> ${t.grupo || "-"}</p>
        <p><strong>Nota máxima:</strong> ${t.nota_maxima ?? "-"}</p>
        <p><strong>Creador:</strong> ${t.usuarios?.nombre || "Desconocido"}</p>
        <p><strong>Estado:</strong>
          <span class="estado-badge estado-${estadoTexto}">
            ${estadoTexto}
          </span>
        </p>

        ${
          USUARIO.rol === "docente"
            ? `
              <div class="acciones-estado">
                <button onclick="cambiarEstado('${t.id}', 'pendiente')">Pendiente</button>
                <button onclick="cambiarEstado('${t.id}', 'en_progreso')">En progreso</button>
                <button onclick="cambiarEstado('${t.id}', 'completada')">Completada</button>
              </div>
            `
            : ""
        }

        ${
          USUARIO.rol === "estudiante"
            ? `
              <p><strong>Mi entrega:</strong> ${miEntrega ? "Ya entregada" : "Pendiente"}</p>
              ${
                !miEntrega
                  ? `<button class="btn-entregar" onclick='abrirModalEntrega(${JSON.stringify(t)})'>Entregar tarea</button>`
                  : ""
              }
            `
            : ""
        }

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

//editar tarea
let tareaEditando = null;

function abrirModalEditar(tarea) {
  tareaEditando = tarea;

  document.getElementById("edit-titulo").value = tarea.titulo || "";
  document.getElementById("edit-descripcion").value = tarea.descripcion || "";
  document.getElementById("edit-fecha_entrega").value = tarea.fecha_entrega || "";
  document.getElementById("edit-nota_maxima").value = tarea.nota_maxima ?? "";
  document.getElementById("edit-instrucciones").value = tarea.instrucciones || "";

  document.getElementById("modal-editar-tarea").style.display = "flex";
}

function cerrarModalEditar() {
  tareaEditando = null;
  document.getElementById("modal-editar-tarea").style.display = "none";
}

async function guardarEdicionTarea() {
  if (!tareaEditando) return;

  const body = {
    docente_id: USUARIO.id,
    titulo: document.getElementById("edit-titulo").value,
    descripcion: document.getElementById("edit-descripcion").value,
    fecha_entrega: document.getElementById("edit-fecha_entrega").value,
    nota_maxima: document.getElementById("edit-nota_maxima").value
      ? Number(document.getElementById("edit-nota_maxima").value)
      : null,
    instrucciones: document.getElementById("edit-instrucciones").value
  };

  const res = await putTarea(tareaEditando.id, body);

  if (res.error) {
    alert(res.error);
    return;
  }

  cerrarModalEditar();
  alert("Tarea actualizada correctamente");
  cargarTareas();
}

// Inicial
cargarTareas();