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