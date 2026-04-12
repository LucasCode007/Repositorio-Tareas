const express = require('express');
const router = express.Router();
const {
  crearEntrega,
  obtenerEntregasPorTarea,
  obtenerEntregasPorEstudiante,
  calificarEntrega,
  eliminarEntrega
} = require('../controllers/entregasController');

router.post('/', crearEntrega);
router.get('/tarea/:tarea_id', obtenerEntregasPorTarea);
router.get('/estudiante/:estudiante_id', obtenerEntregasPorEstudiante);
router.patch('/:id/calificar', calificarEntrega);
router.delete('/:id', eliminarEntrega);

module.exports = router;