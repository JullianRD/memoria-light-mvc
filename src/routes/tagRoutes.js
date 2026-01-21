// routes/itemRoutes.js
import express from "express";
import  tagController  from "../controllers/tagController.js";

const router = express.Router(); 

// Définition des routes pour les tag (lié aux pépites)
router.get("/", tagController.index);
router.post("/tag", tagController.store)

export default router;




                        // <!-- <span class="badge">
                        //     <%= tag.tagName %>
                        // </span> -->
