const express = require('express');
const router = express.Router();
const {
  crearEntrega,
  obtenerEntregasPorTarea,
  obtenerEntregasPorEstudiante,
  eliminarEntrega,
  calificarEntrega
} = require('../controllers/entregasController');

router.post('/', crearEntrega);
router.get('/tarea/:tarea_id', obtenerEntregasPorTarea);
router.get('/estudiante/:estudiante_id', obtenerEntregasPorEstudiante);
router.delete('/:id', eliminarEntrega);
router.patch('/:id/calificar', calificarEntrega);

module.exports = router;