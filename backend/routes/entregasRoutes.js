const express = require('express');
const router = express.Router();
const {
  crearEntrega,
  obtenerEntregasPorTarea,
  obtenerEntregasPorEstudiante
} = require('../controllers/entregasController');

router.post('/', crearEntrega);
router.get('/tarea/:tarea_id', obtenerEntregasPorTarea);
router.get('/estudiante/:estudiante_id', obtenerEntregasPorEstudiante);

module.exports = router;