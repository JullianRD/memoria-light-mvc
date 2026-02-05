'use strict'

import { AppError } from "../utils/appError"

/**
 * Vérifie si l'utilisateur connecté est propriétaire de la ressource.
 * @param {Object} repository - Le repository (ex : ItemRepository)
 * @param {String} paramId - Le nom du paramètre dans l'URL (ex: 'id')
*/

export const ensureOwnership = (repository, paramId = "id") => {
    return async (req, res, next) => {
        try {
            const ressourceId = req.params[paramId];
            const userId = req.session.userId; // Via authMiddleware (nous dit qui demande la ressource)

            const ressource = await repository.findById(ressourceId)

            if (!ressource) {
                throw new AppError("Ressource introuvable", 404);
            }

            // Supposons que toutes les tables ont une colonne 'user_id'
            if (ressource.user_id !== userId && req.session.role !== "admin") {
                throw new AppError(
                    "Accès interdit: vous ne possédez pas cette pépite", 
                    403,
                );
            }

            // On attache la ressource à la requête pour éviter de la re-chercher dans le controler
            req.ressource = ressource
            next();
        } catch (error) {
            next(error);
        }
    }
}