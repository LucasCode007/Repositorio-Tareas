require("dotenv").config();
const express = require("express");
const cors = require("cors");
const inscripcionesRoutes = require('./routes/inscripciones')

const app = express();


app.use(cors());
app.use(express.json());

const usuariosRoutes = require("./routes/usuarios");
const tareasRoutes = require("./routes/tareas");
const materiasRoutes = require('./routes/materias')

// endpoints base
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/materias", materiasRoutes);
app.use("/api/inscripciones", inscripcionesRoutes);

// ruta de prueba
app.get("/", (req, res) => {
  res.send("API de repositorio de tareas funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});