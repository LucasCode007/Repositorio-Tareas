// Solo visible para docentes
if (USUARIO.rol !== 'docente') {
  document.addEventListener('DOMContentLoaded', () => {
    const seccion = document.getElementById('modulo-calificaciones');
    if (seccion) seccion.style.display = 'none';
  });
}

let entregaSeleccionada = null;

// ─── Toast ───────────────────────────────────────────────
function mostrarToastCal(mensaje, color = '#323232') {
  const toast = document.getElementById('toast-calificaciones');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.style.background = color;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

// ─── Modal calificar ─────────────────────────────────────
function abrirModalCalificar(entrega) {
  entregaSeleccionada = entrega;
  document.getElementById('cal-nombre-estudiante').textContent = entrega.usuarios?.nombre ?? 'Estudiante';
  document.getElementById('cal-contenido').textContent = entrega.contenido;
  document.getElementById('input-nota').value = '';
  document.getElementById('input-retroalimentacion').value = '';
  document.getElementById('modal-calificar').style.display = 'flex';
}

function cerrarModalCalificar() {
  entregaSeleccionada = null;
  document.getElementById('modal-calificar').style.display = 'none';
}

async function confirmarCalificacion() {
  const nota = parseFloat(document.getElementById('input-nota').value);
  const retroalimentacion = document.getElementById('input-retroalimentacion').value.trim();

  if (isNaN(nota) || nota < 0 || nota > 100) {
    mostrarToastCal('La nota debe ser un número entre 0 y 100.', '#e53935');
    return;
  }

  const res = await calificarEntrega(entregaSeleccionada.id, USUARIO.id, nota, retroalimentacion);

  if (res.error) {
    mostrarToastCal(`Error: ${res.error}`, '#e53935');
  } else {
    cerrarModalCalificar();
    mostrarToastCal(`Entrega calificada con ${nota}/100`, '#2E7D32');
    setTimeout(() => cargarEntregasPorTarea(), 1000);
  }
}

// ─── Renderizar entregas por tarea ───────────────────────
function renderizarEntregasDocente(entregas) {
  const contenedor = document.getElementById('lista-entregas-docente');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (!entregas.length) {
    contenedor.innerHTML = '<p>No hay entregas para esta tarea.</p>';
    return;
  }

  entregas.forEach(entrega => {
    const card = document.createElement('div');
    card.className = 'card-tarea';
    card.innerHTML = `
      <p><strong>Estudiante:</strong> ${entrega.usuarios?.nombre ?? 'Desconocido'}</p>
      <p><strong>Email:</strong> ${entrega.usuarios?.email ?? '-'}</p>
      <p><strong>Entrega:</strong> ${entrega.contenido}</p>
      <p><strong>Estado:</strong> <span class="estado-badge estado-${entrega.estado}">${entrega.estado}</span></p>
      <p><strong>Nota:</strong> ${entrega.calificacion != null ? entrega.calificacion + '/100' : 'Sin calificar'}</p>
      ${entrega.retroalimentacion ? `<p><strong>Retroalimentación:</strong> ${entrega.retroalimentacion}</p>` : ''}
      <div class="acciones-estado">
        ${entrega.estado !== 'calificada' ? `<button onclick='abrirModalCalificar(${JSON.stringify(entrega)})'>Calificar</button>` : '<span style="color:green">✔ Calificada</span>'}
      </div>
      <hr>
    `;
    contenedor.appendChild(card);
  });
}

// ─── Cargar entregas de tarea seleccionada ───────────────
async function cargarEntregasPorTarea() {
  const select = document.getElementById('select-tarea-calificar');
  const tarea_id = select?.value;
  if (!tarea_id) return;

  const entregas = await obtenerEntregasDeTarea(tarea_id, USUARIO.id);

  if (entregas.error) {
    mostrarToastCal(`Error: ${entregas.error}`, '#e53935');
    return;
  }

  renderizarEntregasDocente(entregas);
}

// ─── Cargar selector de tareas ───────────────────────────
async function cargarSelectorTareas() {
  if (USUARIO.rol !== 'docente') return;

  const select = document.getElementById('select-tarea-calificar');
  if (!select) return;

  const tareas = await getTareas();
  select.innerHTML = '<option value="">-- Selecciona una tarea --</option>';
  tareas.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.titulo;
    select.appendChild(opt);
  });
}

// ─── Init ─────────────────────────────────────────────────
if (document.getElementById('modulo-calificaciones')) {
  cargarSelectorTareas();
}