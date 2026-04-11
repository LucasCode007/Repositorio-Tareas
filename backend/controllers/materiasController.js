const supabase = require("../db");

// obtener todas las materias
const getMaterias = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("materias")
      .select("*");

    if (error) throw error;

    res.json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// crear una materia nueva
const createMateria = async (req, res) => {
  try {
    const { nombre, codigo } = req.body;

    if (!nombre || !codigo) {
      return res.status(400).json({
        error: "Nombre y codigo son obligatorios",
      });
    }

    const { data, error } = await supabase
      .from("materias")
      .insert([{ nombre, codigo }])
      .select();

    if (error) throw error;

    res.status(201).json({
      mensaje: "Materia creada correctamente",
      materia: data[0],
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { getMaterias, createMateria };
