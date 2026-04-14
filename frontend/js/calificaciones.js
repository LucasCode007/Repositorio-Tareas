// Ocultar módulo si no es docente
document.addEventListener("DOMContentLoaded", () => {
  const seccion = document.getElementById("modulo-calificaciones");
  if (USUARIO.rol !== "docente" && seccion) {
    seccion.style.display = "none";
    return;
  }

  if (seccion) {
    cargarSelectorTareas();
  }
});

let entregaSeleccionada = null;

function mostrarToastCal(mensaje, color = "#323232") {
  const toast = document.getElementById("toast-calificaciones");
  if (!toast) return;

  toast.textContent = mensaje;
  toast.style.background = color;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function abrirModalCalificar(entrega) {
  entregaSeleccionada = entrega;

  document.getElementById("cal-nombre-estudiante").textContent =
    entrega.usuarios?.nombre ?? "Estudiante";

  document.getElementById("cal-contenido").textContent =
    entrega.contenido ?? "-";

  document.getElementById("input-nota").value =
    entrega.calificacion ?? "";

  document.getElementById("input-retroalimentacion").value =
    entrega.retroalimentacion ?? "";

  document.getElementById("modal-calificar").style.display = "flex";
}

function cerrarModalCalificar() {
  entregaSeleccionada = null;
  document.getElementById("modal-calificar").style.display = "none";
}

async function confirmarCalificacion() {
  if (!entregaSeleccionada) {
    mostrarToastCal("No hay entrega seleccionada.", "#e53935");
    return;
  }

  const nota = parseFloat(document.getElementById("input-nota").value);
  const retroalimentacion = document
    .getElementById("input-retroalimentacion")
    .value
    .trim();

  if (isNaN(nota) || nota < 0 || nota > 100) {
    mostrarToastCal("La nota debe ser un número entre 0 y 100.", "#e53935");
    return;
  }

  const res = await calificarEntrega(
    entregaSeleccionada.id,
    USUARIO.id,
    nota,
    retroalimentacion
  );

  if (res.error) {
    mostrarToastCal(`Error: ${res.error}`, "#e53935");
    return;
  }

  cerrarModalCalificar();
  mostrarToastCal(`Entrega calificada con ${nota}/100`, "#2E7D32");

  setTimeout(() => {
    cargarEntregasPorTarea();
  }, 800);
}

function renderizarEntregasDocente(entregas) {
  const contenedor = document.getElementById("lista-entregas-docente");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (!entregas.length) {
    contenedor.innerHTML = "<p>No hay entregas para esta tarea.</p>";
    return;
  }

  entregas.forEach((entrega) => {
    const card = document.createElement("div");
    card.className = "card-tarea";

    card.innerHTML = `
      <p><strong>Estudiante:</strong> ${entrega.usuarios?.nombre ?? "Desconocido"}</p>
      <p><strong>Email:</strong> ${entrega.usuarios?.email ?? "-"}</p>
      <p><strong>Entrega:</strong> ${entrega.contenido ?? "-"}</p>
      <p><strong>Estado:</strong> 
        <span class="estado-badge estado-${entrega.estado}">
          ${entrega.estado}
        </span>
      </p>
      <p><strong>Nota:</strong> ${
        entrega.calificacion != null ? `${entrega.calificacion}/100` : "Sin calificar"
      }</p>
      ${
        entrega.retroalimentacion
          ? `<p><strong>Retroalimentación:</strong> ${entrega.retroalimentacion}</p>`
          : ""
      }
      <div class="acciones-estado">
        ${
          entrega.estado !== "calificada"
            ? `<button onclick='abrirModalCalificar(${JSON.stringify(entrega)})'>Calificar</button>`
            : `<span style="color:green">✔ Calificada</span>`
        }
      </div>
      <hr>
    `;

    contenedor.appendChild(card);
  });
}

async function cargarEntregasPorTarea() {
  const select = document.getElementById("select-tarea-calificar");
  const tarea_id = select?.value;
  const contenedor = document.getElementById("lista-entregas-docente");

  if (!contenedor) return;

  if (!tarea_id) {
    contenedor.innerHTML = "<p>Selecciona una tarea.</p>";
    return;
  }

  const entregas = await obtenerEntregasDeTarea(tarea_id, USUARIO.id);

  if (entregas.error) {
    mostrarToastCal(`Error: ${entregas.error}`, "#e53935");
    contenedor.innerHTML = "<p>Error cargando entregas.</p>";
    return;
  }

  renderizarEntregasDocente(entregas);
}

async function cargarSelectorTareas() {
  const select = document.getElementById("select-tarea-calificar");
  if (!select) return;

  const tareas = await getTareas();

  if (!Array.isArray(tareas)) {
    mostrarToastCal("No se pudieron cargar las tareas.", "#e53935");
    return;
  }

  select.innerHTML = '<option value="">-- Selecciona una tarea --</option>';

  tareas.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.titulo;
    select.appendChild(opt);
  });

  select.addEventListener("change", cargarEntregasPorTarea);
}