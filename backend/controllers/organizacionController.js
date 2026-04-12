const supabase = require("../db");

// obtener tareas filtradas por materia
const getTareasPorMateria = async (req, res) => {
  try {
    const { materia_id } = req.query;

    if (!materia_id) {
      return res.status(400).json({ error: "materia_id es obligatorio" });
    }

    const { data, error } = await supabase
      .from("tareas")
      .select("id, titulo, descripcion, fecha_entrega, estado, materias(nombre, codigo)")
      .eq("materia_id", materia_id);

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ mensaje: "No existen tareas para esta materia" });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtener tareas filtradas por grupo
// filtrar tareas por grupo (texto)
const getTareasPorGrupo = async (req, res) => {
  try {
    const { grupo } = req.query;

    if (!grupo) {
      return res.status(400).json({ error: "grupo es obligatorio" });
    }

    const { data, error } = await supabase
      .from("tareas")
      .select("id, titulo, descripcion, fecha_entrega, estado, grupo")
      .eq("grupo", grupo);

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ mensaje: "No existen tareas para este grupo" });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// filtrar tareas por materia Y grupo
const getTareasPorMateriaYGrupo = async (req, res) => {
  try {
    const { materia_id, grupo } = req.query;

    if (!materia_id || !grupo) {
      return res.status(400).json({ error: "materia_id y grupo son obligatorios" });
    }

    const { data, error } = await supabase
      .from("tareas")
      .select("id, titulo, descripcion, fecha_entrega, estado, grupo, materias(nombre, codigo)")
      .eq("materia_id", materia_id)
      .eq("grupo", grupo);

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ mensaje: "No existen tareas para esta materia y grupo" });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// contar entregas recibidas vs estudiantes inscritos en una materia
const getConteoMateria = async (req, res) => {
  try {
    const { materia_id } = req.query;

    if (!materia_id) {
      return res.status(400).json({ error: "materia_id es obligatorio" });
    }

    // contar estudiantes inscritos
    const { data: inscritos, error: errorInscritos } = await supabase
      .from("inscripciones")
      .select("id")
      .eq("materia_id", materia_id);

    if (errorInscritos) throw errorInscritos;

    // contar tareas de esa materia
    const { data: tareas, error: errorTareas } = await supabase
      .from("tareas")
      .select("id")
      .eq("materia_id", materia_id);

    if (errorTareas) throw errorTareas;

    res.json({
      materia_id: materia_id,
      estudiantes_inscritos: inscritos.length,
      tareas_en_materia: tareas.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtener todos los grupos
const getGrupos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("grupos")
      .select("id, nombre, materias(nombre, codigo)");

    if (error) throw error;

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// crear un grupo
const createGrupo = async (req, res) => {
  try {
    const { nombre, materia_id, docente_id } = req.body;

    if (!nombre || !materia_id) {
      return res.status(400).json({ error: "nombre y materia_id son obligatorios" });
    }

    const { data, error } = await supabase
      .from("grupos")
      .insert([{ nombre, materia_id, docente_id }])
      .select();

    if (error) throw error;

    res.status(201).json({
      mensaje: "Grupo creado correctamente",
      grupo: data[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTareasPorMateria,
  getTareasPorGrupo,
  getTareasPorMateriaYGrupo,
  getConteoMateria,
  getGrupos,
  createGrupo
};