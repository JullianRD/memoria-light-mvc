// routes/itemRoutes.js
import express from "express";
import itemController from "../controllers/ItemController.js";

const router = express.Router();

// Définition des routes pour les items (pépites)
router.get("/items", itemController.index);
// router.get("/items/new", itemController.);
router.get("/items/:id", itemController.show);
router.post("/items", itemController.store);
router.post("/items/:id/delete", itemController.destroy);

export default router;
