const supabase = require('../db');


const crearEntrega = async (req, res) => {
  const { tarea_id, estudiante_id, contenido } = req.body;

  if (!tarea_id || !estudiante_id || !contenido) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', estudiante_id)
    .single();

  if (errorUsuario || !usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  if (usuario.rol !== 'estudiante') {
    return res.status(403).json({ error: 'Solo los estudiantes pueden entregar tareas.' });
  }

 
  const { data: tarea, error: errorTarea } = await supabase
    .from('tareas')
    .select('id, fecha_entrega')
    .eq('id', tarea_id)
    .single();

  if (errorTarea || !tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }


  const { data, error } = await supabase
    .from('entregas')
    .insert([{ tarea_id, estudiante_id, contenido }])
    .select()
    .single();

  if (error) {
    
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya entregaste esta tarea.' });
    }
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ mensaje: 'Tarea entregada correctamente.', entrega: data });
};


const obtenerEntregasPorTarea = async (req, res) => {
  const { tarea_id } = req.params;
  const { solicitante_id } = req.query;

 
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', solicitante_id)
    .single();

  if (errorUsuario || !usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  if (usuario.rol !== 'docente') {
    return res.status(403).json({ error: 'Solo los docentes pueden ver todas las entregas.' });
  }

  const { data, error } = await supabase
    .from('entregas')
    .select(`
      id,
      contenido,
      fecha_entrega,
      estado,
      usuarios:estudiante_id (nombre, email)
    `)
    .eq('tarea_id', tarea_id)
    .order('fecha_entrega', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};


const obtenerEntregasPorEstudiante = async (req, res) => {
  const { estudiante_id } = req.params;

  const { data, error } = await supabase
    .from('entregas')
    .select(`
      id,
      contenido,
      fecha_entrega,
      estado,
      tareas:tarea_id (titulo, fecha_entrega)
    `)
    .eq('estudiante_id', estudiante_id)
    .order('fecha_entrega', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

module.exports = { crearEntrega, obtenerEntregasPorTarea, obtenerEntregasPorEstudiante };