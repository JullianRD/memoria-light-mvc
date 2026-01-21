import {Item} from '../models/Item.js'

class ItemController {
    // GET / Quand l'utilisateur va demmander la page d'acceuil / lecture de la base de donnée 
    async index(req, res) {
        try {
            const items = await Item.findAll();
            // On envoie des objets à la vue
            res.render('index', { items: items});
        } catch (error) {
            console.error(error)
            res.status(500).send("Erreur serveur");
        }
    }

    // POST /items
    async store(req, res) {
        try {
            const data = req.body
            await Item.create(data)
            res.status(201).redirect('/')
        } catch (error) {
            console.error(error)
            res.status(500).send("Erreur lors de la création" + error.message)
        }
    }
}

// On exporte une intance unique (Singleton pattern simplifié) 
export default new ItemController();