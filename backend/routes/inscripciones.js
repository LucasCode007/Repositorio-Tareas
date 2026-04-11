const express = require("express");
const router = express.Router();
const { getMaterias, createInscripcion, deleteInscripcion, validarCorreo } = require("../controllers/inscripcionesController");

// obtener materias de un estudiante
router.get("/:usuario_id", getMaterias);

// inscribir estudiante
router.post("/", createInscripcion);

// eliminar inscripcion
router.delete("/:id", deleteInscripcion);

// validar correo
router.post("/validar-correo", validarCorreo);

module.exports = router;