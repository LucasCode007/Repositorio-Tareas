const USUARIO_ORG = JSON.parse(localStorage.getItem("usuario")) || {
  id: "46b15198-b5d4-4455-994e-12e0382db3c9",
  rol: "docente"
};

// Ocultar módulo si no es docente
document.addEventListener("DOMContentLoaded", () => {
  const seccion = document.getElementById("modulo-organizacion-docente");

  if (USUARIO_ORG.rol !== "docente") {
    if (seccion) seccion.style.display = "none";
    return;
  }

  cargarTareasOrganizacion();
});

async function cargarTareasOrganizacion() {
  const select = document.getElementById("select-tarea-organizar");

  const tareas = await getTareas();

  select.innerHTML = '<option value="">-- Selecciona una tarea --</option>';

  tareas.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.titulo;
    select.appendChild(opt);
  });

  select.addEventListener("change", cargarEntregasOrganizadas);

  document
    .getElementById("filtro-estado")
    .addEventListener("change", cargarEntregasOrganizadas);
}

async function cargarEntregasOrganizadas() {
  const tarea_id = document.getElementById("select-tarea-organizar").value;
  const estadoFiltro = document.getElementById("filtro-estado").value;

  if (!tarea_id) return;

  let entregas = await obtenerEntregasDeTarea(tarea_id, USUARIO_ORG.id);

  if (entregas.error) {
    console.error(entregas.error);
    return;
  }

  // 🔥 ORDENAR POR NOMBRE
  entregas.sort((a, b) =>
    (a.usuarios?.nombre || "").localeCompare(b.usuarios?.nombre || "")
  );

  // 🔥 FILTRAR
  if (estadoFiltro) {
    entregas = entregas.filter((e) => e.estado === estadoFiltro);
  }

  renderizarOrganizacion(entregas);
}

function renderizarOrganizacion(entregas) {
  const cont = document.getElementById("lista-organizada");

  cont.innerHTML = "";

  if (!entregas.length) {
    cont.innerHTML = "<p>No hay resultados.</p>";
    return;
  }

  entregas.forEach((e) => {
    const div = document.createElement("div");
    div.className = "card-tarea";

    div.innerHTML = `
      <p><strong>Estudiante:</strong> ${e.usuarios?.nombre || "-"}</p>
      <p><strong>ID:</strong> ${e.estudiante_id}</p>
      <p><strong>Email:</strong> ${e.usuarios?.email || "-"}</p>
      <p><strong>Estado:</strong> ${e.estado}</p>
      <p><strong>Entrega:</strong> ${e.contenido || "-"}</p>
      <hr>
    `;

    cont.appendChild(div);
  });
}