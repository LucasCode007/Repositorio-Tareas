const { enviarCorreo } = require('../emailService');
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
}; // ← aquí cierra correctamente

const calificarEntrega = async (req, res) => {
  const { id } = req.params;
  const { docente_id, calificacion, retroalimentacion } = req.body;

  if (!docente_id || calificacion === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  if (calificacion < 0 || calificacion > 100) {
    return res.status(400).json({ error: 'La calificación debe estar entre 0 y 100.' });
  }

  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', docente_id)
    .single();

  if (errorUsuario || !usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  if (usuario.rol !== 'docente') {
    return res.status(403).json({ error: 'Solo los docentes pueden calificar entregas.' });
  }

  const { data: entrega, error: errorEntrega } = await supabase
    .from('entregas')
    .select('id, estado, estudiante_id')
    .eq('id', id)
    .single();

  if (errorEntrega || !entrega) {
    return res.status(404).json({ error: 'Entrega no encontrada.' });
  }

  const { data, error } = await supabase
    .from('entregas')
    .update({
      calificacion,
      retroalimentacion: retroalimentacion || null,
      estado: 'calificada',
      fecha_calificacion: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Obtener email del estudiante para notificarle
  const { data: estudiante } = await supabase
    .from('usuarios')
    .select('nombre, email')
    .eq('id', entrega.estudiante_id)
    .single();

  if (estudiante) {
    await enviarCorreo({
      destinatario: estudiante.email,
      asunto: '¡Tu tarea ha sido calificada!',
      mensaje: `
        <h2>Hola ${estudiante.nombre},</h2>
        <p>Tu entrega ha sido calificada.</p>
        <p><strong>Nota:</strong> ${calificacion}/100</p>
        <p><strong>Retroalimentación:</strong> ${retroalimentacion || 'Sin comentarios.'}</p>
        <br>
        <p>Ingresa al sistema para ver los detalles.</p>
      `
    });
  }

  res.json({ mensaje: 'Entrega calificada correctamente.', entrega: data });
};

module.exports = {
  crearEntrega,
  obtenerEntregasPorTarea,
  obtenerEntregasPorEstudiante,
  calificarEntrega
};