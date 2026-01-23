// routes/itemRoutes.js
import express from "express";
import itemController from "../controllers/ItemController.js";

const router = express.Router();

// Définition des routes pour les items (pépites)
router.get("/items", itemController.index);
// router.get("/items/new", itemController.create)
router.post("/items", itemController.store);
router.get("/items/:id/edit", itemController.edit);
router.get("/items/:id", itemController.show);
router.post("/items/:id/delete", itemController.destroy);


export default router;
