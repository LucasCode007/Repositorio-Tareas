const API_URL = "http://localhost:3000/api";

// GET tareas
async function getTareas() {
  const res = await fetch(`${API_URL}/tareas`);
  return res.json();
}

// POST tarea
async function postTarea(data) {
  const res = await fetch(`${API_URL}/tareas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}



// Entregar una tarea
async function entregarTarea(tarea_id, estudiante_id, contenido) {
  const res = await fetch(`${API_URL}/entregas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tarea_id, estudiante_id, contenido })
  });
  return res.json();
}

// Obtener entregas de una tarea (docente)
async function obtenerEntregasDeTarea(tarea_id, solicitante_id) {
  const res = await fetch(`${API_URL}/entregas/tarea/${tarea_id}?solicitante_id=${solicitante_id}`);
  return res.json();
}

// Obtener mis entregas (estudiante)
async function obtenerMisEntregas(estudiante_id) {
  const res = await fetch(`${API_URL}/entregas/estudiante/${estudiante_id}`);
  return res.json();
}