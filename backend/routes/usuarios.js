const express = require("express");
const router = express.Router();

const {
  crearUsuario,
} = require("../controllers/usuariosController");

router.post("/", crearUsuario);

module.exports = router;