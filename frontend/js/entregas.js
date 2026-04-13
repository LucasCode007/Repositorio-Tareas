const usuarioActual = JSON.parse(localStorage.getItem("usuario")) || {
  id: "62ab5bd7-fb96-4f07-bc71-c269289b796c",
  rol: "estudiante"
};

function mostrarToast(mensaje, color = "#323232") {
  const toast = document.getElementById("toast-entregas");
  if (!toast) return;

  toast.textContent = mensaje;
  toast.style.background = color;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

async function handleEliminarEntrega(entrega_id) {
  if (!confirm("¿Seguro que quieres eliminar tu entrega?")) return;

  const res = await eliminarEntrega(entrega_id, usuarioActual.id);

  if (res.error) {
    mostrarToast(`Error: ${res.error}`, "#e53935");
    return;
  }

  mostrarToast("Entrega eliminada.", "#F57F17");

  setTimeout(() => {
    cargarMisEntregas();
  }, 1000);
}

function renderizarMisEntregas(misEntregas) {
  const contenedor = document.getElementById("lista-entregas");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (!misEntregas.length) {
    contenedor.innerHTML = "<p>Aún no realizaste entregas.</p>";
    return;
  }

  misEntregas.forEach((entrega) => {
    const tarea = entrega.tareas || {};
    const estado = entrega.estado || "pendiente";

    const card = document.createElement("div");
    card.className = "entrega-card";

    card.innerHTML = `
      <div class="entrega-card-header">
        <h3>${tarea.titulo || "Tarea"}</h3>
        <span class="badge badge-${estado}">
          ${estado.charAt(0).toUpperCase() + estado.slice(1)}
        </span>
      </div>

      <p><strong>Contenido:</strong> ${entrega.contenido || "-"}</p>

      <p><strong>Fecha de entrega:</strong> ${
        entrega.fecha_entrega
          ? new Date(entrega.fecha_entrega).toLocaleDateString()
          : "Sin fecha"
      }</p>

      <p><strong>Materia:</strong> ${tarea.materias?.nombre || "Sin materia"}</p>
      <p><strong>Grupo:</strong> ${tarea.grupo || "-"}</p>

      ${
        entrega.calificacion != null
          ? `<p><strong>Nota:</strong> ${entrega.calificacion}/100</p>`
          : ""
      }

      ${
        entrega.retroalimentacion
          ? `<p><strong>Retroalimentación:</strong> ${entrega.retroalimentacion}</p>`
          : ""
      }

      <div class="entrega-acciones">
        ${!entrega ? `<button class="btn-entregar" onclick='abrirModalEntrega(${JSON.stringify(tarea)})'>Entregar</button>` : ''}
        ${entrega && estado !== 'calificada' ? `
       <button class="btn-eliminar-entrega" onclick="handleEliminarEntrega('${entrega.id}')">Eliminar</button>
       <button class="btn-reemplazar" onclick="abrirModalReemplazar('${entrega.id}')">Reemplazar</button>
       ` : ''}
      </div>
    `;

    contenedor.appendChild(card);
  });
}

async function cargarMisEntregas() {
  try {
    const misEntregas = await obtenerMisEntregas(usuarioActual.id);

    if (!Array.isArray(misEntregas)) {
      mostrarToast("Error cargando entregas.", "#e53935");
      return;
    }

    renderizarMisEntregas(misEntregas);
  } catch (error) {
    console.error("Error cargando entregas:", error);
    mostrarToast("Error cargando entregas.", "#e53935");
  }
}

// Solo carga si existe el contenedor
if (document.getElementById("lista-entregas")) {
  cargarMisEntregas();
}

let entregaAReemplazar = null;

function abrirModalReemplazar(entrega_id) {
  entregaAReemplazar = entrega_id;
  document.getElementById('input-contenido-reemplazar').value = '';
  document.getElementById('modal-reemplazar').style.display = 'flex';
}

function cerrarModalReemplazar() {
  entregaAReemplazar = null;
  document.getElementById('modal-reemplazar').style.display = 'none';
}

async function confirmarReemplazo() {
  const contenido = document.getElementById('input-contenido-reemplazar').value.trim();
  if (!contenido) {
    mostrarToast('Escribe algo antes de enviar.', '#e53935');
    return;
  }

  const res = await reemplazarEntrega(entregaAReemplazar, usuarioActual.id, contenido);

  if (res.error) {
    mostrarToast(`Error: ${res.error}`, '#e53935');
  } else {
    cerrarModalReemplazar();
    mostrarToast('Entrega reemplazada correctamente.', '#1565C0');
    setTimeout(() => cargarMisEntregas(), 1000);
  }
}