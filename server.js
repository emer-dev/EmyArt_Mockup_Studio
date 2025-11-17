import express from "express";
import path from "path";

const app = express();

// --- UBICACIÓN DEL PROYECTO ---
const __dirname = path.resolve();

// --- SERVIR ARCHIVOS DE /dist ---
app.use(express.static("dist"));

// --- SIEMPRE DEVOLVER index.html PARA RUTAS DEL FRONTEND ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- PUERTO (Render usa 10000) ---
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
