/**
 * TODO_02 : Créer les endpoints d'accès à la view (compétence 7 -> REV )
 */

import { Share } from "../models/Shares.js";

class ShareController {
  // GET /items -> Liste complète de toutes les pépites
  async index(req, res) {
    try {
      const shares = await Share.findAll();
      // On envoie des OBJETS à la vue
      res.render("pages/items/index", { shares: shares });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur serveur");
    }
  }

  // GET /items/:id
  async show(req, res) {
    try {
      console.log("Show controller :" + req.params.id);
      const id = req.params.id;
      const share = await Share.findById(id);
      console.log("Show controller share:", share);
      res.render("pages/items/show", { share: share });
    } catch (error) {
      console.error(error);
      res.status(404).send("La page est introuvable");
    }
  }

  // POST /items -> Enregistre le nouveau tag
  async store(req, res) {
    try {
      console.log("REQ.BODY =", req.body);
      const data = req.body;
      await Share.create(data);
      res.status(201).redirect("/items");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la création : " + error.message);
    }
  }
}

// On exporte une instance unique (Singleton pattern simplifié)
export default new ShareController();
