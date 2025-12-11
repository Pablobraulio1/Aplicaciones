import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sirve los archivos de tu carpeta principal
app.use(express.static(__dirname));

// Envía index.html por defecto
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Puerto para Median / Render / Vercel
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
