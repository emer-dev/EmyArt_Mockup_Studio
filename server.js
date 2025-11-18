import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

// Servir la app (dist)
app.use(express.static("dist"));

// Cualquier ruta → cargar index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor sin licencia activo en puerto ${PORT}`);
});
