const express = require("express");
const router = express.Router();
const {
  crearComentario,
  obtenerComentariosTarea,
  obtenerComentariosMateria,
} = require("../controllers/comentariosController");

// Crear (se usa el mismo para todo)
router.post("/", crearComentario);

// Comentarios de una tarea específica
router.get("/tarea/:tarea_id", obtenerComentariosTarea);

// Comentarios generales de la materia
router.get("/materia/:materia_id", obtenerComentariosMateria);

module.exports = router;