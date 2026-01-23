// routes/itemRoutes.js
import express from "express";
import itemController from "../controllers/ItemController.js";
import tagController from "../controllers/TagController.js";

const router = express.Router();

// Définition des routes pour les items (pépites)
router.get("/items", itemController.index);
// router.get("/items/new", itemController.create)
router.post("/items", itemController.store);
router.get("/items/:id/edit", itemController.edit);
router.get("/items/:id", itemController.show);
router.post("/:id/update", itemController.update);
router.post("/items/:id/delete", itemController.destroy);

//Définition des routes pour les tags
router.get("/tags", tagController.index);
router.post("/tags", tagController.store);
router.get("/tags/:id/edit", tagController.edit);
router.get("/tags/:id", tagController.show);
router.post("/:id/update", tagController.update);
router.post("/tags/:id/delete", tagController.destroy);

export default router;
