const supabase = require("../db");


const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_entrega, creador_id,instrucciones,nota_maxima,grupo, materia_id} = req.body;

    if (!titulo || !creador_id) {
      return res.status(400).json({
        error: "Titulo y creador_id son obligatorios",
      });
    }

    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", creador_id)
      .single();

    if (errorUsuario || !usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    if (usuario.rol !== "docente") {
      return res.status(403).json({
        error: "Solo docentes pueden crear tareas",
      });
    }

    // 🟢 insertar tarea
    const { data, error } = await supabase
      .from("tareas")
      .insert([
        {
          titulo,
          descripcion,
          fecha_entrega,
          creador_id,
          instrucciones,
          nota_maxima,
          grupo,
          materia_id
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      mensaje: "Tarea creada correctamente",
      tarea: data[0],
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// 🟢 Obtener tareas (con usuario)
const obtenerTareas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tareas")
      .select("id,titulo,descripcion,fecha_entrega,instrucciones,nota_maxima,grupo,estado,usuarios(nombre,email),materias(id,nombre,codigo),materia_id");
    if (error) throw error;

    res.json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


//Cambiar estado de una tarea
const cambiarEstadoTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        error: "El estado es obligatorio"
      });
    }

    const { data, error } = await supabase
      .from("tareas")
      .update({ estado })
      .eq("id", id)
      .select();

    if (error) throw error;

    return res.json({
      mensaje: "Estado actualizado correctamente",
      tarea: data[0]
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

//editar tarea (solo docente) 

const updateTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      fecha_entrega,
      nota_maxima,
      instrucciones,
      docente_id
    } = req.body;

    if (!docente_id) {
      return res.status(400).json({ error: "docente_id es obligatorio." });
    }

    // validar usuario
    const { data: usuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id, rol")
      .eq("id", docente_id)
      .single();

    if (errorUsuario || !usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    if (usuario.rol !== "docente") {
      return res.status(403).json({
        error: "Solo los docentes pueden editar tareas."
      });
    }

    // verificar que la tarea exista
    const { data: tareaExistente, error: errorTarea } = await supabase
      .from("tareas")
      .select("id")
      .eq("id", id)
      .single();

    if (errorTarea || !tareaExistente) {
      return res.status(404).json({ error: "Tarea no encontrada." });
    }

    const camposActualizar = {};

    if (titulo !== undefined) camposActualizar.titulo = titulo;
    if (descripcion !== undefined) camposActualizar.descripcion = descripcion;
    if (fecha_entrega !== undefined) camposActualizar.fecha_entrega = fecha_entrega;
    if (nota_maxima !== undefined) camposActualizar.nota_maxima = nota_maxima;
    if (instrucciones !== undefined) camposActualizar.instrucciones = instrucciones;

    if (Object.keys(camposActualizar).length === 0) {
      return res.status(400).json({
        error: "No hay campos para actualizar."
      });
    }

    const { data, error } = await supabase
      .from("tareas")
      .update(camposActualizar)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      mensaje: "Tarea actualizada correctamente.",
      tarea: data
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  crearTarea,
  obtenerTareas,
  cambiarEstadoTarea,
  updateTarea
};