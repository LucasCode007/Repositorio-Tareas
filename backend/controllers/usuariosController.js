const supabase = require("../db");

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // 🔴 Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // 🔴 Verificar si ya existe el usuario
    const { data: existe, error: errorConsulta } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email);

    if (errorConsulta) throw errorConsulta;

    if (existe.length > 0) {
      return res.status(400).json({
        error: "El usuario ya existe",
      });
    }

    // 🟢 Insertar usuario
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nombre, email, password }])
      .select();

    if (error) throw error;

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
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