// app.js (point numéro 1)
import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';
import itemRoutes from "./routes/itemRoutes.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename); 

const app = express()

// Middleware pour parser le BODY des formulaires (transforme les données du front en objet JSON utilisable dans le back)
app.use(express.urlencoded({extended: true}));


// Configuration EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", itemRoutes);

// démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur Memoria (ESM) lancé sur http://localhost:${PORT}`);
}); 