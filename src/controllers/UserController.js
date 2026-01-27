/**
 * TODO_02 : Créer les endpoints d'accès à la view (compétence 7 -> REV )
 */

import { User } from "../models/Users.js";

class UserController {
  // GET /items -> Liste complète de tout les users
  async index(req, res) {
    try {
      const users = await User.findAll();
      // On envoie des OBJETS à la vue
      res.render("pages/tags/index", { users: users });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur serveur");
    }
  }

  // GET /users/:id/user -> Affiche le formulaire de modification
  async edit (req, res){
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send("Utilisateur non trouvé")
      }
      res.render("pages/users/edit", { user });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération de l'utilisateur");
    }
  }

  // GET /items/:id
  async show(req, res) {
    try {
      console.log("Show controller :" + req.params.id);
      const id = req.params.id;
      const user = await Tag.findById(id);
      console.log("Show controller tag:", user);
      res.render("pages/tags/show", { user: user });
    } catch (error) {
      console.error(error);
      res.status(404).send("La page est introuvable");
    }
  }

  //POST /items/:id/update -> Enregistre les modifications 
  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;

      // Vérifier si la mise à jour du site à réussi
      const updatedUser = await User.update(id, data);

      if (!updateTag) {
        return res.status(404).send("Utilisateur non trouvé")
      }

      res.redirect(`/users/${id}`); // Redirige vers l'utilisateur modifié
      // res.redirect("/users");    
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la mise à jour de l'utilisateur : " + error.message);
    }
  }

  // POST /items -> Enregistre le nouveau tag
  async store(req, res) {
    try {
      console.log("REQ.BODY =", req.body);
      const data = req.body;
      await User.create(data);
      res.status(201).redirect("/Users");
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
            res.status(201).redirect('/users');
        } catch (error) {
                        console.error(error);
            res.status(500).send("Erreur lors de la suppression : " + error.message);
        }
    }
}

// On exporte une instance unique (Singleton pattern simplifié)
export default new UserController();
