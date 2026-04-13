// Abrir el muro de la materia como un modal
async function abrirMuroMateria(materia_id, materia_nombre) {
  // Reutilizamos la estructura oscura del modal que creaste en modal.css
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.id = "ventana-muro";

  modalOverlay.innerHTML = `
    <div class="modal-content">
      <button class="btn-cerrar" onclick="cerrarMuro()">X Cerrar</button>
      <h2>Muro de la Clase: ${materia_nombre}</h2>
      <p style="color: gray; font-size: 0.9em; margin-bottom: 15px;">Espacio general para dudas y anuncios de la materia.</p>

      <div class="seccion-comentarios">
        <div id="lista-comentarios-muro" class="lista-comentarios" style="max-height: 300px;">
          <p style="color: gray; font-size: 0.9em; text-align: center;">Cargando comentarios...</p>
        </div>
        
        <div class="caja-escribir-comentario">
          <input type="text" id="input-comentario-muro" placeholder="Escribe un anuncio o pregunta para la clase...">
          <button class="btn-enviar-comentario" onclick="enviarComentarioMuro('${materia_id}')">Publicar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);
  
  // Cargar los comentarios al abrir
  cargarComentariosMuro(materia_id);
}

// Cargar la lista de comentarios del muro
async function cargarComentariosMuro(materia_id) {
  const contenedor = document.getElementById("lista-comentarios-muro");
  if (!contenedor) return;

  try {
    const comentarios = await getComentariosMateria(materia_id);
    contenedor.innerHTML = "";

    if (comentarios.length === 0) {
      contenedor.innerHTML = '<p style="color: gray; font-size: 0.9em; text-align: center;">Aún no hay publicaciones en el muro. ¡Sé el primero!</p>';
      return;
    }

    comentarios.forEach(c => {
      const div = document.createElement("div");
      div.className = "comentario-item";
      const hora = new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      div.innerHTML = `
        <span class="comentario-autor">${c.usuarios?.nombre || "Usuario"} <span style="color: gray; font-weight: normal; font-size: 0.8em;">• ${hora}</span></span>
        <span>${c.contenido}</span>
      `;
      contenedor.appendChild(div);
    });
    
    // Auto-scroll
    contenedor.scrollTop = contenedor.scrollHeight;
  } catch (error) {
    contenedor.innerHTML = '<p style="color: red;">Error al cargar el muro.</p>';
  }
}

// Publicar un nuevo comentario en la materia
async function enviarComentarioMuro(materia_id) {
  const input = document.getElementById("input-comentario-muro");
  const contenido = input.value.trim();

  if (!contenido) return;

  try {
    // Tomamos el usuario simulado que está definido en inscripciones.js
    const idUsuario = USUARIO_INSCRIPCION.id; 

    // Ojo aquí: mandamos materia_id, pero NO enviamos tarea_id
    const res = await postComentario({
      contenido,
      materia_id: materia_id,
      usuario_id: idUsuario
    });

    if (res.error) {
      alert("Error: " + res.error);
      return;
    }

    input.value = "";
    cargarComentariosMuro(materia_id);
  } catch (error) {
    console.error("Error publicando en el muro:", error);
  }
}

// Cerrar el modal del muro
function cerrarMuro() {
  const modal = document.getElementById("ventana-muro");
  if (modal) modal.remove();
}