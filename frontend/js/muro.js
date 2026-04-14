let comentarioPadreMuro = null; // Variable para saber a quién respondemos en el muro

async function abrirMuroMateria(materia_id, materia_nombre) {
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
        
        <div id="indicador-respuesta-muro" class="indicador-respuesta" style="display: none;">
          <span id="texto-respuesta-muro"></span>
          <button onclick="cancelarRespuestaMuro()" style="background: none; border: none; color: #721c24; cursor: pointer; font-weight: bold; font-size: 1.2em;">✖</button>
        </div>

        <div class="caja-escribir-comentario">
          <input type="text" id="input-comentario-muro" placeholder="Escribe un anuncio o pregunta para la clase...">
          <button class="btn-enviar-comentario" onclick="enviarComentarioMuro('${materia_id}')">Publicar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);
  cargarComentariosMuro(materia_id);
}

function cerrarMuro() {
  comentarioPadreMuro = null;
  const modal = document.getElementById("ventana-muro");
  if (modal) modal.remove();
}

//Funciones de respuesta para el muro
function prepararRespuestaMuro(idComentario, nombreUsuario) {
  comentarioPadreMuro = idComentario;
  document.getElementById("texto-respuesta-muro").textContent = `Respondiendo a ${nombreUsuario}`;
  document.getElementById("indicador-respuesta-muro").style.display = "flex";
  document.getElementById("input-comentario-muro").focus();
}

function cancelarRespuestaMuro() {
  comentarioPadreMuro = null;
  document.getElementById("indicador-respuesta-muro").style.display = "none";
}

//Cargar y agrupar comentarios del muro
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

    const padres = comentarios.filter(c => !c.comentario_padre_id);
    const hijos = comentarios.filter(c => c.comentario_padre_id);

    const dibujarComentarioMuro = (c, esHijo) => {
      const div = document.createElement("div");
      div.className = esHijo ? "comentario-item comentario-respuesta" : "comentario-item";
      const hora = new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const nombreUsuario = c.usuarios?.nombre || "Usuario";

      div.innerHTML = `
        <span class="comentario-autor">${nombreUsuario} <span style="color: gray; font-weight: normal; font-size: 0.8em;">• ${hora}</span></span>
        <span>${c.contenido}</span>
        ${!esHijo ? `<button class="btn-responder" onclick="prepararRespuestaMuro('${c.id}', '${nombreUsuario}')">Responder</button>` : ''}
      `;
      return div;
    };

    padres.forEach(padre => {
      contenedor.appendChild(dibujarComentarioMuro(padre, false));
      
      const susHijos = hijos.filter(h => h.comentario_padre_id === padre.id);
      susHijos.forEach(hijo => {
        contenedor.appendChild(dibujarComentarioMuro(hijo, true));
      });
    });
    
    contenedor.scrollTop = contenedor.scrollHeight;
  } catch (error) {
    contenedor.innerHTML = '<p style="color: red;">Error al cargar el muro.</p>';
  }
}

//Publicar comentario en el muro
async function enviarComentarioMuro(materia_id) {
  const input = document.getElementById("input-comentario-muro");
  const contenido = input.value.trim();

  if (!contenido) return;

  try {
    const idUsuario = USUARIO_INSCRIPCION.id; 

    const res = await postComentario({
      contenido,
      materia_id: materia_id,
      usuario_id: idUsuario,
      comentario_padre_id: comentarioPadreMuro // Se manda el padre
    });

    if (res.error) {
      alert("Error: " + res.error);
      return;
    }

    input.value = "";
    cancelarRespuestaMuro(); // Limpiamos el indicador
    cargarComentariosMuro(materia_id);
  } catch (error) {
    console.error("Error publicando en el muro:", error);
  }
}