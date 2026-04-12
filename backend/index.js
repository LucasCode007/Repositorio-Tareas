require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rutas
const usuariosRoutes = require("./routes/usuarios");
const tareasRoutes = require("./routes/tareas");
const entregasRoutes = require('./routes/entregasRoutes'); // ← MOVIDO ARRIBA (antes del listen)

// endpoints base
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/entregas", entregasRoutes); // ← MOVIDO ARRIBA + prefijo /api/

// ruta de prueba
app.get("/", (req, res) => {
  res.send("API de repositorio de tareas funcionando 🚀");
});

// levantar servidor
const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Servidor corriendo en puerto 3000`); // ← comilla backtick cerrada
});