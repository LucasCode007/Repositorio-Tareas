const express = require("express");
const router = express.Router();

const {
  crearTarea,
  obtenerTareas,
} = require("../controllers/tareasController");

// crear tarea
router.post("/", crearTarea);

// listar tareas
router.get("/", obtenerTareas);

module.exports = router;