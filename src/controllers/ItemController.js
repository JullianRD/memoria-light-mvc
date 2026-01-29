/**
 * @fileoverview Contrôleur pour la gestion des Items (Pépites)
 *
 * 🎯 RÔLE DU CONTRÔLEUR :
 * Le contrôleur fait le lien entre les routes et les modèles.
 * Il contient la logique métier de l'application :
 * - Récupère les données de la requête (req.body, req.params)
 * - Appelle les méthodes du modèle (Item.findAll(), Item.create()...)
 * - Prépare la réponse (rendu de vue ou redirection)
 * - Gère les erreurs
 *
 * 🏗️ ARCHITECTURE MVC :
 * - Model (Item.js) : Accès aux données (SQL)
 * - View (EJS) : Affichage HTML
 * - Controller (ItemController.js) : Logique métier (ce fichier)
 *
 * 📋 MÉTHODES CRUD IMPLÉMENTÉES :
 * - index()   : Liste toutes les pépites (READ all)
 * - show()    : Affiche une pépite (READ one)
 * - edit()    : Affiche le formulaire de modification
 * - update()  : Enregistre les modifications (UPDATE)
 * - store()   : Crée une nouvelle pépite (CREATE)
 * - destroy() : Supprime une pépite (DELETE)
 *
 * TODO_02 : Créer les endpoints d'accès à la view (compétence 7 -> REV)
 */

// Import du modèle Item pour interagir avec la base de données
import { Item } from "../models/Item.js";

/**
 * @class ItemController
 * @description Contrôleur gérant toutes les opérations CRUD sur les Items
 *
 * Ce contrôleur utilise le pattern "Resource Controller" :
 * Chaque méthode correspond à une action standard (index, show, store, etc.)
 */
class ItemController {
  /**
   * 📋 Liste toutes les pépites (READ all)
   *
   * @async
   * @method index
   * @param {Object} req - Objet requête Express
   * @param {Object} res - Objet réponse Express
   * @returns {Promise<void>} Rendu de la vue "items/index" avec la liste des pépites
   *
   * @description
   * Route associée : GET /items
   *
   * Flux d'exécution :
   * 1. Récupère toutes les pépites depuis la BDD via Item.findAll()
   * 2. Passe les données à la vue EJS "pages/items/index"
   * 3. La vue affiche la liste sous forme de tableau ou de cartes
   *
   * @example
   * // Dans le navigateur :
   * // http://localhost:3000/items
   *
   * @throws {Error} 500 - Erreur serveur si la requête BDD échoue
   */
  async index(req, res) {
    try {
      // Appel du modèle pour récupérer toutes les pépites
      // Item.findAll() retourne un tableau d'objets
      const items = await Item.findAll();

      // Rendu de la vue EJS avec les données
      // La vue aura accès à la variable "items" dans le template
      res.render("pages/items/index", { items: items });
      // Équivalent court : res.render("pages/items/index", { items });
    } catch (error) {
      // En cas d'erreur (BDD inaccessible, requête SQL invalide...)
      console.error("❌ Erreur dans index():", error);

      // Retourne une erreur 500 (Internal Server Error) au client
      res.status(500).send("Erreur serveur");
    }
  }

  /**
   * 📝 Affiche le formulaire de modification d'une pépite
   *
   * @async
   * @method edit
   * @param {Object} req - Objet requête Express
   * @param {string} req.params.id - ID de la pépite à modifier
   * @param {Object} res - Objet réponse Express
   * @returns {Promise<void>} Rendu de la vue "items/edit" avec les données de la pépite
   *
   * @description
   * Route associée : GET /items/:id/edit
   *
   * Flux d'exécution :
   * 1. Récupère l'ID depuis l'URL (req.params.id)
   * 2. Cherche la pépite en BDD via Item.findById()
   * 3. Si trouvée : affiche le formulaire pré-rempli
   * 4. Si non trouvée : erreur 404
   *
   * @example
   * // Dans le navigateur :
   * // http://localhost:3000/items/42/edit
   * // Affiche le formulaire pour modifier la pépite n°42
   *
   * @throws {Error} 404 - Pépite non trouvée
   * @throws {Error} 500 - Erreur serveur
   */
  async edit(req, res) {
    try {
      // Extraction de l'ID depuis les paramètres d'URL
      // Exemple : /items/42/edit => id = "42"
      const id = req.params.id;

      // Recherche de la pépite en base de données
      const item = await Item.findById(id);

      // Si la pépite n'existe pas, retourner une erreur 404
      if (!item) {
        return res.status(404).send("Pépite non trouvée");
      }

      // Affichage du formulaire avec les données actuelles
      // La vue aura accès à "item" pour pré-remplir les champs
      res.render("pages/items/edit", { item });
    } catch (error) {
      console.error("❌ Erreur dans edit():", error);
      res.status(500).send("Erreur lors de la récupération de la pépite");
    }
  }

  /**
   * 💾 Enregistre les modifications d'une pépite (UPDATE)
   *
   * @async
   * @method update
   * @param {Object} req - Objet requête Express
   * @param {string} req.params.id - ID de la pépite à modifier
   * @param {Object} req.body - Données du formulaire (title, content, etc.)
   * @param {Object} res - Objet réponse Express
   * @returns {Promise<void>} Redirection vers la page de la pépite modifiée
   *
   * @description
   * Route associée : POST /items/:id/update
   *
   * Flux d'exécution :
   * 1. Récupère l'ID depuis l'URL
   * 2. Récupère les nouvelles données depuis le formulaire (req.body)
   * 3. Met à jour en BDD via Item.update()
   * 4. Redirige vers la page de détail de la pépite
   *
   * Note sur les formulaires HTML :
   * - Les formulaires HTML ne supportent que GET et POST
   * - Pour simuler PUT/PATCH, on utilise POST avec une route spéciale
   * - Alternative : utiliser method-override middleware
   *
   * @example
   * // Formulaire HTML :
   * // <form method="POST" action="/items/42/update">
   * //   <input name="title" value="Nouveau titre">
   * //   <button type="submit">Enregistrer</button>
   * // </form>
   *
   * @throws {Error} 404 - Pépite non trouvée
   * @throws {Error} 500 - Erreur lors de la mise à jour
   */
 async update(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedItem = await Item.update(id, data);
    if (!updatedItem) {
      return res.status(404).send("Item not found");
    }
    res.redirect(`/items/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating item: " + error.message);
  }
}


  /**
   * 👁️ Affiche les détails d'une pépite (READ one)
   *
   * @async
   * @method show
   * @param {Object} req - Objet requête Express
   * @param {string} req.params.id - ID de la pépite à afficher
   * @param {Object} res - Objet réponse Express
   * @returns {Promise<void>} Rendu de la vue "items/show" avec les détails
   *
   * @description
   * Route associée : GET /items/:id
   *
   * Flux d'exécution :
   * 1. Récupère l'ID depuis l'URL
   * 2. Cherche la pépite en BDD
   * 3. Affiche une page de détail avec toutes les informations
   *
   * @example
   * // Dans le navigateur :
   * // http://localhost:3000/items/42
   * // Affiche les détails de la pépite n°42
   *
   * @throws {Error} 404 - Pépite non trouvée
   */
  async show(req, res) {
    try {
      // Logs de débogage (à supprimer en production)
      console.log("🔍 Show controller - ID:", req.params.id);

      // Extraction de l'ID depuis l'URL
      const id = req.params.id;

      // Recherche de la pépite en base de données
      const item = await Item.findById(id);

      // Log de débogage pour vérifier les données reçues
      console.log("📦 Show controller - Item trouvé:", item);

      // Rendu de la vue avec les détails de la pépite
      res.render("pages/items/show", { item: item });
    } catch (error) {
      console.error("❌ Erreur dans show():", error);

      // Erreur 404 car l'item n'a probablement pas été trouvé
      res.status(404).send("La page est introuvable");
    }
  }

  /**
   * ➕ Crée une nouvelle pépite en base de données (CREATE)
   *
   * @async
   * @method store
   * @param {Object} req - Objet requête Express
   * @param {Object} req.body - Données du formulaire de création
   * @param {string} req.body.title - Titre de la pépite
   * @param {string} req.body.content - Contenu de la pépite
   * @param {number} req.body.category_id - ID de la catégorie
   * @param {Object} res - Objet réponse Express
   * @returns {Promise<void>} Redirection vers la liste des pépites
   *
   * @description
   * Route associée : POST /items
   *
   * Flux d'exécution :
   * 1. Récupère les données du formulaire (req.body)
   * 2. Crée la pépite en BDD via Item.create()
   * 3. Redirige vers la liste (pattern PRG)
   *
   * Convention de nommage :
   * - store() : Enregistre des nouvelles données (Laravel, Rails)
   * - create() : Souvent réservé à l'affichage du formulaire
   *
   * @example
   * // Formulaire HTML :
   * // <form method="POST" action="/items">
   * //   <input name="title" placeholder="Titre">
   * //   <textarea name="content"></textarea>
   * //   <select name="category_id">...</select>
   * //   <button type="submit">Créer</button>
   * // </form>
   *
   * @throws {Error} 500 - Erreur lors de la création (contraintes BDD, champs manquants...)
   */
  async store(req, res) {
    try {
      // Extraction des données du formulaire
      // req.body est rempli grâce au middleware express.urlencoded()
      const data = req.body;

      // Création en base de données
      // Item.create() insère une nouvelle ligne et retourne l'objet créé
      await Item.create(data);

      // Code 201 : Created (nouvelle ressource créée avec succès)
      // Redirection vers la liste des pépites
      res.status(201).redirect("/items");
    } catch (error) {
      console.error("❌ Erreur dans store():", error);

      // Erreur 500 avec message détaillé
      // Causes possibles :
      // - Champ obligatoire manquant (NOT NULL)
      // - Contrainte de clé étrangère (category_id invalide)
      // - Type de données incorrect
      res.status(500).send("Erreur lors de la création : " + error.message);
    }
  }

  /**
   * 🗑️ Supprime une pépite de la base de données (DELETE)
   *
   * @async
   * @method destroy
   * @param {Object} req - Objet requête Express
   * @param {string} req.params.id - ID de la pépite à supprimer
   * @param {Object} res - Objet réponse Express
   * @returns {Promise<void>} Redirection vers la liste des pépites
   *
   * @description
   * Route associée : POST /items/:id/delete (ou DELETE /items/:id avec method-override)
   *
   * Flux d'exécution :
   * 1. Récupère l'ID depuis l'URL
   * 2. Supprime la pépite en BDD via Item.delete()
   * 3. Redirige vers la liste
   *
   * ⚠️ SÉCURITÉ :
   * - Ajouter une confirmation côté client (JavaScript)
   * - Vérifier les permissions (l'utilisateur peut-il supprimer ?)
   * - Potentiellement faire une "soft delete" (marqueur deleted_at)
   *
   * @example
   * // Formulaire avec confirmation JavaScript :
   * // <form method="POST" action="/items/42/delete"
   * //       onsubmit="return confirm('Êtes-vous sûr ?')">
   * //   <button type="submit">Supprimer</button>
   * // </form>
   *
   * @throws {Error} 500 - Erreur lors de la suppression
   */
  async destroy(req, res) {
    try {
      // Extraction de l'ID depuis l'URL
      const id = req.params.id;
      console.log("🗑️ Suppression de l'item ID:", id);

      // Suppression en base de données
      // Item.delete() retourne l'objet supprimé ou null
      const deletedItem = await Item.delete(id);
      console.log("✅ Item supprimé:", deletedItem);

      // Code 200 ou 204 (No Content)
      res.status(200).redirect("/items");
    } catch (error) {
      console.error("❌ Erreur dans destroy():", error);
      res.status(500).send("Erreur lors de la suppression : " + error.message);
    }
  }
}

/**
 * Export d'une instance unique du contrôleur (Singleton pattern)
 *
 * 💡 POURQUOI UNE INSTANCE ?
 * - Pas besoin de plusieurs instances (pas d'état interne)
 * - Plus simple à importer : import itemController from "..."
 * - Pattern courant dans Express
 *
 * Alternative (export de la classe) :
 * export { ItemController };
 * // Puis dans les routes : const controller = new ItemController();
 *
 * @type {ItemController}
 */
export default new ItemController();
