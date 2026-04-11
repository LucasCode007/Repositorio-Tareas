const express = require('express')
const router = express.Router()
const { getMaterias, createMateria } = require('../controllers/materiasController')

// GET /api/materias
router.get('/', getMaterias)

// POST /api/materias
router.post('/', createMateria)

module.exports = router