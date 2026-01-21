// routes/itemRoutes.js
import express from "express";
import  itemController  from "../controllers/ItemController.js";

const router = express.Router(); 

// Définition des routes
router.get("/", itemController.index);

export default router;
