const contenedor = document.getElementById("tareas");

// 🔥 SIMULACIÓN (luego esto vendrá del login)
const USUARIO = {
  id: "5db07d3f-47a7-4969-b9d7-8f255b6570de", // ⚠️ pon el id de un usuario real
  rol: "docente" // cambia a "estudiante" para probar bloqueo
};

if (USUARIO.rol !== "docente") {
  document.querySelector("#form-crear").style.display = "none";
}

// 🟢 cargar tareas
async function cargarTareas() {
  try {
    const tareas = await getTareas();

    contenedor.innerHTML = "";

    tareas.forEach(t => {
      const div = document.createElement("div");

      div.innerHTML = `
        <h3>${t.titulo}</h3>
        <p>${t.descripcion || ""}</p>

        <p><strong>Instrucciones:</strong> ${t.instrucciones || "Sin instrucciones"}</p>
        <p><strong>Nota máxima:</strong> ${t.nota_maxima || "-"}</p>
        <p><strong>Grupo:</strong> ${t.grupo || "-"}</p>

        <p><strong>Creador:</strong> ${t.usuarios?.nombre}</p>
        <hr>
      `;
      contenedor.appendChild(div);
    });

  } catch (error) {
    console.error("Error cargando tareas:", error);
  }
}

// 🟢 crear tarea
async function crearTarea() {
  try {
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;

    if (!titulo) {
      alert("El título es obligatorio");
      return;
    }

    const res = await postTarea({
      titulo,
      descripcion,
      creador_id: USUARIO.id
    });

    if (res.error) {
      alert(res.error);
      return;
    }

    // limpiar inputs
    document.getElementById("titulo").value = "";
    document.getElementById("descripcion").value = "";

    cargarTareas();

  } catch (error) {
    console.error("Error creando tarea:", error);
  }
}

// 🚀 inicial
cargarTareas();