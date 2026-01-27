/**
 * TODO_02 : Créer les endpoints d'accès à la view (compétence 7 -> REV )
 */

import { Tag } from "../models/Tags.js";

class TagController {
  // GET /items -> Liste complète de toutes les pépites
  async index(req, res) {
    try {
      const tags = await Tag.findAll();
      // On envoie des OBJETS à la vue
      res.render("pages/tags/index", { tags: tags });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur serveur");
    }
  }

  // GET /items/:id/edit -> Affiche le formulaire de modification
  async edit (req, res){
    try {
      const id = req.params.id;
      const tag = await Tag.findById(id);
      if (!tag) {
        return res.status(404).send("Pépite non trouvée")
      }
      res.render("pages/tags/edit", { tag });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération du tag");
    }
  }

  // GET /items/:id
  async show(req, res) {
    try {
      console.log("Show controller :" + req.params.id);
      const id = req.params.id;
      const tag = await Tag.findById(id);
      console.log("Show controller tag:", tag);
      res.render("pages/tags/show", { tag: tag });
    } catch (error) {
      console.error(error);
      res.status(404).send("La page est introuvable");
    }
  }

  //POST /items/:id/update -> Enregistre les modifications 
  async updateTag(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;

      // Vérifier si la mise à jour du site à réussi
      const updateTag = await Tag.update(id, data);

      if (!updateTag) {
        return res.status(404).send("Pépite non trouvée")
      }

      res.redirect(`/tags/${id}`); // Redirige vers la pépite modifiée
      // res.redirect("/items");    
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la mise à jour du tag : " + error.message);
    }
  }

  // POST /items -> Enregistre le nouveau tag
  async store(req, res) {
    try {
      console.log("REQ.BODY =", req.body);
      const data = req.body;
      await Tag.create(data);
      res.status(201).redirect("/tags");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la création : " + error.message);
    }
  }
// POST /items/:id/delete -> supprime un tag
     async destroy(req, res) {
        try {
            const id = req.params.id
            await Tag.destroy(id);
            res.status(201).redirect('/tags');
        } catch (error) {
                        console.error(error);
            res.status(500).send("Erreur lors de la suppression : " + error.message);
        }
    }
}

// On exporte une instance unique (Singleton pattern simplifié)
export default new TagController();
