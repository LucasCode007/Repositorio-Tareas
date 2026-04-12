const API_URL = "http://localhost:3000/api";

async function getTareas() {
  const res = await fetch(`${API_URL}/tareas`);
  return res.json();
}

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

async function patchEstadoTarea(id, estado) {
  const res = await fetch(`${API_URL}/tareas/${id}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
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
    headers: {
      "Content-Type": "application/json"
    },
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