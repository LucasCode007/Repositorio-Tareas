const API_URL = "http://localhost:3000/api";

async function getTareas() {
  const res = await fetch(`${API_URL}/tareas`);
  return res.json();
}

async function postTarea(data) {
  const res = await fetch(`${API_URL}/tareas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function patchEstadoTarea(id, estado) {
  const res = await fetch(`${API_URL}/tareas/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado })
  });
  return res.json();
}

async function getMaterias() {
  const res = await fetch(`${API_URL}/materias`);
  return res.json();
}

async function crearInscripcion(data) {
  const res = await fetch(`${API_URL}/inscripciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function getInscripciones(usuarioId) {
  const res = await fetch(`${API_URL}/inscripciones/${usuarioId}`);
  return res.json();
}

async function eliminarInscripcion(id) {
  const res = await fetch(`${API_URL}/inscripciones/${id}`, {
    method: "DELETE"
  });
  return res.json();
}

//FUNCIONES DE ENTREGAS Y CALIFICACIONES
async function entregarTarea(tarea_id, estudiante_id, contenido) {
  const res = await fetch(`${API_URL}/entregas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tarea_id, estudiante_id, contenido })
  });
  return res.json();
}

async function obtenerEntregasDeTarea(tarea_id, solicitante_id) {
  const res = await fetch(`${API_URL}/entregas/tarea/${tarea_id}?solicitante_id=${solicitante_id}`);
  return res.json();
}

async function obtenerMisEntregas(estudiante_id) {
  const res = await fetch(`${API_URL}/entregas/estudiante/${estudiante_id}`);
  return res.json();
}

async function eliminarEntrega(entrega_id, estudiante_id) {
  const res = await fetch(`${API_URL}/entregas/${entrega_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estudiante_id })
  });
  return res.json();
}

async function calificarEntrega(entrega_id, docente_id, calificacion, retroalimentacion) {
  const res = await fetch(`${API_URL}/entregas/${entrega_id}/calificar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docente_id, calificacion, retroalimentacion })
  });
  return res.json();
}


// ─── US9: Reemplazar entrega ──────────────────────────────
async function reemplazarEntrega(entrega_id, estudiante_id, contenido) {
  const res = await fetch(`${API_URL}/entregas/${entrega_id}/reemplazar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estudiante_id, contenido })
  });
  return res.json();
// ─── TUS FUNCIONES DE COMENTARIOS ───
async function getComentariosTarea(tarea_id) {
  const res = await fetch(`${API_URL}/comentarios/tarea/${tarea_id}`);
  return res.json();
}

async function postComentario(data) {
  const res = await fetch(`${API_URL}/comentarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function getComentariosMateria(materia_id) {
  const res = await fetch(`${API_URL}/comentarios/materia/${materia_id}`);
  return res.json();
}