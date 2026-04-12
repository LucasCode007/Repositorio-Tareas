// Abrir ventana modal con los detalles de la tarea
async function abrirDetalle(id) {
  try {
    // Reutilizamos la función de api.js para no crear endpoints nuevos en el backend
    const tareas = await getTareas();
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
      alert("No se pudo cargar la información de la tarea.");
      return;
    }

    // Lógica para verificar si el plazo venció (asumiendo que hoy es la fecha actual)
    const hoy = new Date();
    // Ponemos la hora a las 23:59 para que venza al final del día
    const fechaEntrega = tarea.fecha_entrega ? new Date(tarea.fecha_entrega + 'T23:59:59') : null;
    const estaVencida = fechaEntrega ? hoy > fechaEntrega : false;

    // Crear el contenedor oscuro del modal dinámicamente
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.id = "ventana-detalles";

    // Validar qué botones mostrar
    let botonesHTML = "";
    if (estaVencida) {
      botonesHTML = `
        <div class="seccion-detalle" style="background: #f8d7da; color: #721c24; border-color: #f5c6cb;">
          <strong>⚠️ El plazo de entrega ha vencido.</strong> Ya no puedes editar ni subir archivos.
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

    // Inyectar el contenido HTML en la ventana
    modalOverlay.innerHTML = `
      <div class="modal-content">
        <button class="btn-cerrar" onclick="cerrarDetalle()">X Cerrar</button>
        <h2>Detalles: ${tarea.titulo}</h2>
        
        <div class="seccion-detalle">
          <p><strong>Descripción:</strong><br> ${tarea.descripcion || "Sin descripción adicional."}</p>
        </div>

        <div class="seccion-detalle">
          <p><strong>Instrucciones del Docente:</strong><br> ${tarea.instrucciones || "No hay instrucciones específicas."}</p>
        </div>

        <div class="seccion-detalle">
          <p><strong>Archivos adjuntos:</strong><br> 
            <a href="#" style="color: blue;">documento_guia.pdf</a>
          </p>
        </div>

        <div class="seccion-detalle">
          <p><strong>Fecha límite:</strong> ${tarea.fecha_entrega || "Sin límite"} 
            ${estaVencida ? '<span style="color: red; font-weight: bold;">(VENCIDA)</span>' : ''}
          </p>
        </div>

        ${botonesHTML}
      </div>
    `;

    // Agregar la ventana al cuerpo de la página
    document.body.appendChild(modalOverlay);

  } catch (error) {
    console.error("Error al abrir detalles:", error);
  }
}

// Función para cerrar y destruir el modal
function cerrarDetalle() {
  const modal = document.getElementById("ventana-detalles");
  if (modal) {
    modal.remove();
  }
}