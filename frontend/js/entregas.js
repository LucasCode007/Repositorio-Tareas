// Usuario simulado — reemplazar cuando implementen auth real
const usuarioActual = JSON.parse(localStorage.getItem('usuario')) || {
  id: '5e17caaf-c866-4e0f-ab2a-d33c3b844821',
  rol: 'estudiante',
  nombre: 'Estudiante'
};

let tareaSeleccionada = null;

// ─── Toast ───────────────────────────────────────────────
function mostrarToast(mensaje, color = '#323232') {
  const toast = document.getElementById('toast-entregas');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.style.background = color;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

// ─── Modal ───────────────────────────────────────────────
function abrirModalEntrega(tarea) {
  tareaSeleccionada = tarea;
  document.getElementById('modal-titulo-tarea').textContent = tarea.titulo;
  document.getElementById('input-contenido-entrega').value = '';
  document.getElementById('modal-entrega').style.display = 'flex';
}

function cerrarModalEntrega() {
  tareaSeleccionada = null;
  document.getElementById('modal-entrega').style.display = 'none';
}

async function confirmarEntrega() {
  const contenido = document.getElementById('input-contenido-entrega').value.trim();
  if (!contenido) {
    mostrarToast('Escribe algo antes de enviar.', '#e53935');
    return;
  }

  const res = await entregarTarea(tareaSeleccionada.id, usuarioActual.id, contenido);

  if (res.error) {
    mostrarToast(`Error: ${res.error}`, '#e53935');
  } else {
    cerrarModalEntrega();
    mostrarToast('¡Tarea entregada correctamente!', '#2E7D32');
    setTimeout(() => cargarEntregas(), 1000);
  }
}

// ─── Eliminar ─────────────────────────────────────────────
async function handleEliminarEntrega(entrega_id) {
  if (!confirm('¿Seguro que quieres eliminar tu entrega?')) return;

  const res = await eliminarEntrega(entrega_id, usuarioActual.id);

  if (res.error) {
    mostrarToast(`Error: ${res.error}`, '#e53935');
  } else {
    mostrarToast('Entrega eliminada.', '#F57F17');
    setTimeout(() => cargarEntregas(), 1000);
  }
}

// ─── Renderizar ───────────────────────────────────────────
function renderizarEntregas(tareas, misEntregas) {
  const contenedor = document.getElementById('lista-entregas');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (!tareas.length) {
    contenedor.innerHTML = '<p>No hay tareas disponibles.</p>';
    return;
  }

  tareas.forEach(tarea => {
    const entrega = misEntregas.find(e => e.tarea_id === tarea.id);
    const estado = entrega ? entrega.estado : 'pendiente';

    const card = document.createElement('div');
    card.className = 'entrega-card';
    card.innerHTML = `
      <div class="entrega-card-header">
        <h3>${tarea.titulo}</h3>
        <span class="badge badge-${estado}">${estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
      </div>
      <p>${tarea.descripcion ?? ''}</p>
      <small>Fecha límite: ${new Date(tarea.fecha_entrega).toLocaleDateString()}</small>
      ${entrega ? `<p><strong>Tu entrega:</strong> ${entrega.contenido}</p>` : ''}
      ${entrega?.calificacion != null ? `<p><strong>Nota:</strong> ${entrega.calificacion}/100</p>` : ''}
      ${entrega?.retroalimentacion ? `<p><strong>Retroalimentación:</strong> ${entrega.retroalimentacion}</p>` : ''}
      <div class="entrega-acciones">
        ${!entrega ? `<button class="btn-entregar" onclick='abrirModalEntrega(${JSON.stringify(tarea)})'>Entregar</button>` : ''}
        ${entrega && estado !== 'calificada' ? `<button class="btn-eliminar-entrega" onclick="handleEliminarEntrega('${entrega.id}')">Eliminar entrega</button>` : ''}
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// ─── Cargar ───────────────────────────────────────────────
async function cargarEntregas() {
  const [tareas, misEntregas] = await Promise.all([
    getTareas(),
    obtenerMisEntregas(usuarioActual.id)
  ]);
  renderizarEntregas(tareas, misEntregas);
}

// Solo carga si el módulo está visible en el HTML
if (document.getElementById('lista-entregas')) {
  cargarEntregas();
}