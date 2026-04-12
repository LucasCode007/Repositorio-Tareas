const express = require("express");
const router = express.Router();
const {
  getTareasPorMateria,
  getTareasPorGrupo,
  getTareasPorMateriaYGrupo,
  getConteoMateria,
  getGrupos,
  createGrupo
} = require("../controllers/organizacionController");

// filtrar tareas por materia
router.get("/tareas/materia", getTareasPorMateria);

// filtrar tareas por grupo
router.get("/tareas/grupo", getTareasPorGrupo);

// contar entregas vs estudiantes inscritos
router.get("/conteo", getConteoMateria);

// obtener todos los grupos
router.get("/grupos", getGrupos);

// filtrar por materia y grupo
router.get("/tareas/filtro", getTareasPorMateriaYGrupo);

// crear grupo
router.post("/grupos", createGrupo);

module.exports = router;