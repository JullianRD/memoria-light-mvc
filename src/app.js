// app.js
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import Routes from "./routes/Routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware pour parser le BODY des formulaires
app.use(express.urlencoded({ extended: true }));

// Configuration EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Configuration des fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", Routes);

// Démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Memoroa (ESM) lancé sur http://localhost:${PORT}`);
});
