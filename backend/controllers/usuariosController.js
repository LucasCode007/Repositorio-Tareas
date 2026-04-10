const supabase = require("../db");

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // verificar si ya existe
    const { data: existe } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email);

    if (existe.length > 0) {
      return res.status(400).json({
        error: "El usuario ya existe",
      });
    }

    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nombre,
          email,
          password,
          rol: rol || "estudiante",
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      mensaje: "Usuario creado",
      usuario: data[0],
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  crearUsuario,
};