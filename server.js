import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const __dirname = path.resolve();
const LICENSE_FILE = path.join(__dirname, "license.json");

// --- FUNCIÓN PARA VALIDAR LICENCIA ---
function validarLicencia(keyIngresado) {
  if (!fs.existsSync(LICENSE_FILE)) {
    return { valid: false, message: "license.json no encontrado" };
  }

  const data = JSON.parse(fs.readFileSync(LICENSE_FILE, "utf8"));

  if (data.licenseKey !== keyIngresado) {
    return { valid: false, message: "Licencia inválida" };
  }

  const hoy = new Date();
  const fechaExpira = new Date(data.validUntil);

  if (hoy > fechaExpira) {
    return { valid: false, message: "Licencia expirada" };
  }

  return {
    valid: true,
    entry: data
  };
}

// --- ENDPOINT QUE TU FRONTEND NECESITA ---
app.post("/api/validate-license", (req, res) => {
  const { license } = req.body;

  const result = validarLicencia(license);

  if (!result.valid) {
    return res.json({
      valid: false,
      entry: result.entry || null
    });
  }

  return res.json({
    valid: true,
    entry: result.entry
  });
});

// --- SERVIR ARCHIVOS DE LA APP ---
app.use(express.static("dist"));

// --- PUERTO RENDER ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
