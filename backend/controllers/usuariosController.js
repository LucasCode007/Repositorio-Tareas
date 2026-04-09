const supabase = require("../db");

// Crear usuario
const crearUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;

  const { data, error } = await supabase
    .from("usuarios")
    .insert([{ nombre, email, password }]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
};

module.exports = {
  crearUsuario,
};