/**
 * TODO_02 : Créer les endpoints d'accès à la view (compétence 7 -> REV )
 */

import { Item } from "../models/Item.js";

class ItemController {
  // GET /items -> Liste complète de toutes les pépites
  async index(req, res) {
    try {
      const items = await Item.findAll();
      // On envoie des OBJETS à la vue
      res.render("pages/items/index", { items: items });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur serveur");
    }
  }

  // GET /items/:id/edit -> Affiche le formulaire de modification
  async edit (req, res){
    try {
      const id = req.params.id;
      const item = await Item.findById(id);
      if (!item) {
        return res.status(404).send("Pépite non trouvée")
      }
      res.render("pages/items/edit", { item });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération de la pépite");
    }
  }

  // GET /items/:id
  async show(req, res) {
    try {
      console.log("Show controller :" + req.params.id);
      const id = req.params.id;
      const item = await Item.findById(id);
      console.log("Show controller item:", item);
      res.render("pages/items/show", { item: item });
    } catch (error) {
      console.error(error);
      res.status(404).send("La page est introuvable");
    }
  }

  // POST /items -> Enregistre la nouvelle pépite
  async store(req, res) {
    try {
      const data = req.body;
      await Item.create(data);
      res.status(201).redirect("/items");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la création : " + error.message);
    }
  }
// POST /items/:id/delete -> supprime une pépite
     async destroy(req, res) {
        try {
            const id = req.params.id
            await Item.delete(id);
            res.status(201).redirect('/items');
        } catch (error) {
                        console.error(error);
            res.status(500).send("Erreur lors de la suppression : " + error.message);
        }
    }
}

// On exporte une instance unique (Singleton pattern simplifié)
export default new ItemController();
