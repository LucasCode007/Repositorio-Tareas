const supabase = require("../db");

// obtener materias de un estudiante
const getMaterias = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const { data, error } = await supabase
      .from("inscripciones")
      .select("id, fecha, materias(id, nombre, codigo)")
      .eq("usuario_id", usuario_id);

    if (error) throw error;

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// inscribir estudiante a una materia
const createInscripcion = async (req, res) => {
  try {
    const { usuario_id, materia_id } = req.body;

    if (!usuario_id || !materia_id) {
      return res.status(400).json({
        error: "usuario_id y materia_id son obligatorios",
      });
    }

    const { data, error } = await supabase
      .from("inscripciones")
      .insert([{ usuario_id, materia_id }])
      .select();

    if (error) throw error;

    res.status(201).json({
      mensaje: "Inscripcion creada correctamente",
      inscripcion: data[0],
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// eliminar inscripcion
const deleteInscripcion = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("inscripciones")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ mensaje: "Inscripcion eliminada correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// validar si el correo existe antes de inscribir
const validarCorreo = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email es obligatorio" });
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, email, rol")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Correo no encontrado" });
    }

    res.json({
      mensaje: "Correo encontrado",
      usuario: data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMaterias, createInscripcion, deleteInscripcion, validarCorreo };