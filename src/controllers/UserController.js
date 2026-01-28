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
      res.render("pages/users/index", { users: users });
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
      const user = await User.findById(id);
      console.log("Show controller user:", user);
      res.render("pages/users/show", { user: user });
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

      if (!updateUser) {
        return res.status(404).send("Utilisateur non trouvé")
      }

      res.redirect("pages/users/news"); // Redirige vers l'utilisateur modifié
      // res.redirect("/users");    
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la mise à jour de l'utilisateur : " + error.message);
    }
  }

  // POST /items -> Enregistre le nouveau tag
async store(req, res) {
  try {
    const { email, passwordHash, pseudo } = req.body;

    await User.create({
      email,
      passwordHash,
      pseudo,
      role: "user" // 🔒 valeur valide de role_enum
    });

    res.redirect("/users");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la création : " + error.message);
  }
}
  async destroy(req, res) {
    try {
      const { id } = req.params;
      console.log("🗑️ Suppression de l'utilisateur ID:", id);

      // Suppression en base de données
      // User.delete() retourne l'objet supprimé ou null
      const deletedUser = await User.destroy(id);

      if (!deletedUser) {
        console.log("⚠️ Utilisateur non trouvé pour suppression");
        return res.status(404).render("pages/errors/404", {
          title: "Utilisateur introuvable",
          message: "Impossible de supprimer un utilisateur qui n'existe pas.",
        });
      }

      console.log("✅ Utilisateur supprimé:", deletedUser.pseudo);

      // Redirection vers la liste (PRG pattern)
      // ⚠️ Si l'utilisateur supprime SON propre compte, il faut aussi détruire la session
      // TODO_AUTH : req.session.destroy() ou res.clearCookie('token')
      res.redirect("/users");
    } catch (error) {
      console.error("❌ Erreur dans destroy():", error);
      res.status(500).send("Erreur lors de la suppression : " + error.message);
    }
  }
}

// On exporte une instance unique (Singleton pattern simplifié)
export default new UserController();
