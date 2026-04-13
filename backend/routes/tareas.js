const express = require("express");
const router = express.Router();

const {
  crearTarea,
  obtenerTareas,
  cambiarEstadoTarea,
  updateTarea  
} = require("../controllers/tareasController");

// crear tarea
router.post("/", crearTarea);

// listar tareas
router.get("/", obtenerTareas);

//actualizar estado de la tarea
router.patch("/:id/estado", cambiarEstadoTarea);

//actualizar estado de la tarea editada 
router.put("/:id", updateTarea);

module.exports = router;