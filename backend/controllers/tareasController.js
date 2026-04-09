const supabase = require("../db");

// 🟢 Crear tarea
const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_entrega, creador_id } = req.body;

    // Validación
    if (!titulo || !creador_id) {
      return res.status(400).json({
        error: "Titulo y creador_id son obligatorios",
      });
    }

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

// 🔥 Obtener tareas CON nombre de usuario
const obtenerTareas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tareas")
      .select("id, titulo, usuarios(nombre, email)");

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