const supabase = require("../db");

// 🟢 Crear tarea (SOLO DOCENTES)
const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_entrega, creador_id } = req.body;

    if (!titulo || !creador_id) {
      return res.status(400).json({
        error: "Titulo y creador_id son obligatorios",
      });
    }

    // 🔥 verificar rol del usuario
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
      .select("id,titulo,descripcion,fecha_entrega,usuarios(nombre,email)");

    if (error) throw error;

    res.json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  crearTarea,
  obtenerTareas,
};