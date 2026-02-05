'use strict'

/**
 * Middleware de gestion des messages Flash et de persistance des inputs.
 * Permet d'afficher des notifications après une redirection
 * 
 * @module middlewares/authMiddleware
*/

/**
 * Injecte les messages flash (notifications) vers la vue(res.locals)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
*/

export const flashMiddleware = (req, res, next) => {
    // 1. Transférer les messages de la session vers la vue (res.locals)
    res.locals.flash = req.session.flash || {};
    res.locals.oldInput = req.session.oldInput || {}; // Pour ré-remplir les formulaires 

    //2. Nettoyer la session après transfert (Flash = une seule fois)
    delete req.session.flash;
    delete req.session.oldInput;
};

/**
 * Helper pour ajouter un message flash
 * @param {string} type - 'success', 'error', 'info'
 * @param {string} message - Le message à afficher 
*/
req.flash = (type, message) => {
    if (!req.session.flash) req.session.flash = {};
    req.session.flash[type] = message;
}
