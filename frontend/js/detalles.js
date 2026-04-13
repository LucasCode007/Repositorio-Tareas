
let comentarioPadreTarea = null; // Variable para saber si estamos respondiendo

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

    // LÓGICA ROL DOCENTE
    if (USUARIO.rol === "docente") {
  if (estaVencida) {
    botonesHTML = `
      <div class="seccion-detalle" style="background: #f8d7da; color: #721c24; border-color: #f5c6cb;">
        <strong>⚠️ El plazo de entrega ha vencido.</strong>
      </div>
      <button class="btn-accion" style="background:#ffc107; color:black;" onclick='cerrarDetalle(); abrirModalEditar(${JSON.stringify(tarea)})'>
        Editar tarea
      </button>
    `;
  } else {
    botonesHTML = `
      <button class="btn-accion" onclick="alert('Función de subir archivo en desarrollo')">
        Subir / Reemplazar Archivo
      </button>
      <button class="btn-accion" style="background:#ffc107; color:black;" onclick='cerrarDetalle(); abrirModalEditar(${JSON.stringify(tarea)})'>
        Editar tarea
      </button>
    `;
  }
}

    // LÓGICA ROL ESTUDIANTE
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
          
          <div id="indicador-respuesta-tarea" class="indicador-respuesta" style="display: none;">
            <span id="texto-respuesta-tarea"></span>
            <button onclick="cancelarRespuestaTarea()" style="background: none; border: none; color: #721c24; cursor: pointer; font-weight: bold; font-size: 1.2em;">✖</button>
          </div>

          <div class="caja-escribir-comentario">
            <input type="text" id="input-nuevo-comentario" placeholder="Escribe una duda o comentario...">
            <button class="btn-enviar-comentario" onclick="enviarComentario('${tarea.id}')">Enviar</button>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(modalOverlay);
    cargarComentarios(tarea.id);

  } catch (error) {
    console.error("Error al abrir detalles:", error);
  }
}

function cerrarDetalle() {
  comentarioPadreTarea = null; // Limpiar al cerrar
  const modal = document.getElementById("ventana-detalles");
  if (modal) modal.remove();
}

//Funciones para manejar a quién le respondemos
function prepararRespuestaTarea(idComentario, nombreUsuario) {
  comentarioPadreTarea = idComentario;
  document.getElementById("texto-respuesta-tarea").textContent = `Respondiendo a ${nombreUsuario}`;
  document.getElementById("indicador-respuesta-tarea").style.display = "flex";
  document.getElementById("input-nuevo-comentario").focus();
}

function cancelarRespuestaTarea() {
  comentarioPadreTarea = null;
  document.getElementById("indicador-respuesta-tarea").style.display = "none";
}

//Dibujar comentarios separados por padres e hijos
// 🟢 Función para organizar y dibujar los hilos de forma recursiva
async function cargarComentarios(tarea_id) {
  const contenedor = document.getElementById("lista-comentarios-modal");
  if (!contenedor) return;

  try {
    const todosLosComentarios = await getComentariosTarea(tarea_id);
    contenedor.innerHTML = ""; 

    if (todosLosComentarios.length === 0) {
      contenedor.innerHTML = '<p style="color: gray; text-align: center;">No hay comentarios aún.</p>';
      return;
    }

    // 1. Crear un mapa para acceso rápido
    const mapa = {};
    todosLosComentarios.forEach(c => {
      mapa[c.id] = { ...c, respuestas: [] };
    });

    // 2. Construir el árbol de hilos
    const raiz = [];
    todosLosComentarios.forEach(c => {
      if (c.comentario_padre_id && mapa[c.comentario_padre_id]) {
        mapa[c.comentario_padre_id].respuestas.push(mapa[c.id]);
      } else {
        raiz.push(mapa[c.id]);
      }
    });

    // 3. Función recursiva para dibujar
    function dibujarArbol(lista, nivel = 0) {
      lista.forEach(c => {
        const div = document.createElement("div");
        div.className = nivel > 0 ? "comentario-item comentario-respuesta" : "comentario-item";
        
        // Limitar la identación máxima para que no se salga de la pantalla en móviles
        const margin = nivel > 0 ? 20 : 0;
        div.style.marginLeft = `${margin}px`;

        const hora = new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const nombreAutor = c.usuarios?.nombre || "Usuario";

        div.innerHTML = `
          <div class="comentario-autor">${nombreAutor} <span style="font-weight:normal; color:gray; font-size:0.8em;">• ${hora}</span></div>
          <span class="comentario-texto">${c.contenido}</span>
          <button class="btn-responder" onclick="prepararRespuestaTarea('${c.id}', '${nombreAutor}')">Responder</button>
        `;
        
        contenedor.appendChild(div);

        // Si tiene respuestas, las dibujamos justo debajo (Recursión)
        if (c.respuestas.length > 0) {
          dibujarArbol(c.respuestas, nivel + 1);
        }
      });
    }

    dibujarArbol(raiz);
    contenedor.scrollTop = contenedor.scrollHeight;

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = '<p style="color: red;">Error al cargar comentarios.</p>';
  }
}

//Enviar comentario
async function enviarComentario(tarea_id) {
  const input = document.getElementById("input-nuevo-comentario");
  const contenido = input.value.trim();

  if (!contenido) return;

  try {
    const idUsuario = USUARIO.id; 

    const res = await postComentario({
      contenido,
      tarea_id,
      usuario_id: idUsuario,
      comentario_padre_id: comentarioPadreTarea
    });

    if (res.error) {
      alert("Error: " + res.error);
      return;
    }

    input.value = "";
    cancelarRespuestaTarea();
    cargarComentarios(tarea_id);

  } catch (error) {
    console.error("Error enviando comentario:", error);
  }
}