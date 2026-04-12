const supabase = require("../db");

//Crear un comentario (sirve para ambos casos)
const crearComentario = async (req, res) => {
  try {
    const { contenido, usuario_id, tarea_id, materia_id, comentario_padre_id } = req.body;

    if (!contenido || !usuario_id || (!tarea_id && !materia_id)) {
      return res.status(400).json({
        error: "Contenido, usuario_id y al menos un destino (tarea o materia) son obligatorios",
      });
    }

    const { data, error } = await supabase
      .from("comentarios")
      .insert([
        {
          contenido,
          usuario_id,
          tarea_id: tarea_id || null, // Si no hay tarea, es null
          materia_id: materia_id || null, // Si no hay materia, es null
          comentario_padre_id: comentario_padre_id || null,
        },
      ])
      .select("*, usuarios(nombre)");

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtener comentarios de una TAREA (para la ventana de detalles)
const obtenerComentariosTarea = async (req, res) => {
  try {
    const { tarea_id } = req.params;

    const { data, error } = await supabase
      .from("comentarios")
      .select("*, usuarios(nombre)")
      .eq("tarea_id", tarea_id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtener comentarios de una MATERIA (para el muro principal)
const obtenerComentariosMateria = async (req, res) => {
  try {
    const { materia_id } = req.params;

    const { data, error } = await supabase
      .from("comentarios")
      .select("*, usuarios(nombre)")
      .eq("materia_id", materia_id)
      .is("tarea_id", null) // Solo traemos los que NO son de tareas
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearComentario,
  obtenerComentariosTarea,
  obtenerComentariosMateria,
};