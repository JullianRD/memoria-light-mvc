// routes/itemRoutes.js
import express from "express";
import  itemController  from "../controllers/ItemController.js";

const router = express.Router(); 

// Définition des routes pour les items (pépites)
router.get("/", itemController.index);
router.post("/items", itemController.store)

export default router;
