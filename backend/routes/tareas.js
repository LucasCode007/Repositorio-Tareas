const express = require("express");
const router = express.Router();

const {
  crearTarea,
  obtenerTareas,
  cambiarEstadoTarea
} = require("../controllers/tareasController");

// crear tarea
router.post("/", crearTarea);

// listar tareas
router.get("/", obtenerTareas);

//actualizar estado de la tarea
router.patch("/:id/estado", cambiarEstadoTarea);

module.exports = router;