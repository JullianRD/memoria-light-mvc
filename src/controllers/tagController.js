import {Tag} from '../models/tags.js'
import { Item } from '../models/Item.js'

class TagController {
    // GET / Quand l'utilisateur va demmander la page d'acceuil / lecture de la base de donnée 
async index(req, res) {
  try {
    const items = await Item.findAll({
      include: Tag
    })

    res.render('index', { items, tags })
  } catch (error) {
    console.error(error)
    res.status(500).send("Erreur serveur")
  }
}
}


// On exporte une intance unique (Singleton pattern simplifié) 
export default new TagController();