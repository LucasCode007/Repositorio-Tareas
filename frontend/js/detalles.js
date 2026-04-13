// 🔥 ARCHIVO FUSIONADO: detalles.js (Entregas de tus compañeros + Tus Comentarios)

async function abrirDetalle(id) {
  try {
    const tareas = await getTareas();
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
      alert("No se pudo cargar la información de la tarea.");
      return;
    }

    const hoy = new Date();
    const fechaEntrega = tarea.fecha_entrega ? new Date(tarea.fecha_entrega + "T23:59:59") : null;
    const estaVencida = fechaEntrega ? hoy > fechaEntrega : false;

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.id = "ventana-detalles";

    let botonesHTML = "";

    // LÓGICA DE TUS COMPAÑEROS (Rol Docente)
    if (USUARIO.rol === "docente") {
      if (estaVencida) {
        botonesHTML = `
          <div class="seccion-detalle" style="background: #f8d7da; color: #721c24; border-color: #f5c6cb;">
            <strong>⚠️ El plazo de entrega ha vencido.</strong>
          </div>
          <button class="btn-accion btn-deshabilitado" disabled>Subir Archivo (Bloqueado)</button>
          <button class="btn-accion btn-deshabilitado" disabled>Editar Tarea (Bloqueado)</button>
        `;
      } else {
        botonesHTML = `
          <button class="btn-accion" onclick="alert('Función de subir archivo en desarrollo')">Subir / Reemplazar Archivo</button>
          <button class="btn-accion" style="background: #ffc107; color: black;" onclick="alert('Función de editar tarea en desarrollo')">Editar Tarea</button>
        `;
      }
    }

    // LÓGICA DE TUS COMPAÑEROS (Rol Estudiante)
    if (USUARIO.rol === "estudiante") {
      botonesHTML = estaVencida
        ? `
          <div class="seccion-detalle" style="background: #f8d7da; color: #721c24; border-color: #f5c6cb;">
            <strong>⚠️ El plazo de entrega ha vencido.</strong> Ya no puedes entregar esta tarea.
          </div>
        `
        : `
          <button class="btn-accion" onclick='cerrarDetalle(); abrirModalEntrega(${JSON.stringify(tarea)})'>
            Entregar tarea
          </button>
        `;
    }

    // ESTRUCTURA MODAL (Fusionada)
    modalOverlay.innerHTML = `
      <div class="modal-content">
        <button class="btn-cerrar" onclick="cerrarDetalle()">X Cerrar</button>
        <h2>Detalles: ${tarea.titulo}</h2>
        
        <div class="seccion-detalle">
          <p><strong>Descripción:</strong><br> ${tarea.descripcion || "Sin descripción adicional."}</p>
        </div>

        <div class="seccion-detalle">
          <p><strong>Materia:</strong> ${tarea.materias?.nombre || "Sin materia"}</p>
          <p><strong>Grupo:</strong> ${tarea.grupo || "-"}</p>
        </div>

        <div class="seccion-detalle">
          <p><strong>Instrucciones del Docente:</strong><br> ${tarea.instrucciones || "No hay instrucciones específicas."}</p>
        </div>

        <div class="seccion-detalle">
          <p><strong>Fecha límite:</strong> ${tarea.fecha_entrega || "Sin límite"}
            ${estaVencida ? '<span style="color: red; font-weight: bold;"> (VENCIDA)</span>' : ""}
          </p>
        </div>

        ${botonesHTML}

        <div class="seccion-comentarios">
          <h3 style="margin-bottom: 10px; font-size: 1.1em;">💬 Comentarios</h3>
          
          <div id="lista-comentarios-modal" class="lista-comentarios">
            <p style="color: gray; font-size: 0.9em; text-align: center;">Cargando comentarios...</p>
          </div>
          
          <div class="caja-escribir-comentario">
            <input type="text" id="input-nuevo-comentario" placeholder="Escribe una duda o comentario...">
            <button class="btn-enviar-comentario" onclick="enviarComentario('${tarea.id}')">Enviar</button>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(modalOverlay);

    // 🔥 TU LLAMADA A LA BASE DE DATOS
    cargarComentarios(tarea.id);

  } catch (error) {
    console.error("Error al abrir detalles:", error);
  }
}

function cerrarDetalle() {
  const modal = document.getElementById("ventana-detalles");
  if (modal) {
    modal.remove();
  }
}

// 🔥 TUS FUNCIONES DE COMENTARIOS INTACTAS
async function cargarComentarios(tarea_id) {
  const contenedor = document.getElementById("lista-comentarios-modal");
  if (!contenedor) return;

  try {
    const comentarios = await getComentariosTarea(tarea_id);
    contenedor.innerHTML = ""; 

    if (comentarios.length === 0) {
      contenedor.innerHTML = '<p style="color: gray; font-size: 0.9em; text-align: center;">No hay comentarios aún. ¡Sé el primero!</p>';
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

    contenedor.scrollTop = contenedor.scrollHeight;

  } catch (error) {
    contenedor.innerHTML = '<p style="color: red;">Error al cargar comentarios.</p>';
  }
}

async function enviarComentario(tarea_id) {
  const input = document.getElementById("input-nuevo-comentario");
  const contenido = input.value.trim();

  if (!contenido) return;

  try {
    const idUsuario = USUARIO.id; 

    const res = await postComentario({
      contenido,
      tarea_id,
      usuario_id: idUsuario
    });

    if (res.error) {
      alert("Error: " + res.error);
      return;
    }

    input.value = "";
    cargarComentarios(tarea_id);

  } catch (error) {
    console.error("Error enviando comentario:", error);
  }
}