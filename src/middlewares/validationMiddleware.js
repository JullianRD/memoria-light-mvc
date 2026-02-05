'use strict'

import { ZodError } from 'zod';

/**
 * Créateur de middleware de validation basé sur un schéma Zod (ptdrr)
 * @param {import('zod').ZodSchema} schema - Le schéma de validation
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @return {Function} - Middleware Express 
*/

export const validate = (schema) => (req, res, next) => {
    try {
    // On valide req.body (parse nettoie aussi les champs en trop si configuré)
    req.body = schema.parse(req.body)
    next()
    } catch (error) {
        if (error instanceof ZodError) {
            // 1. Formater les erreurs pour l'affichage (ex: {email: "Email invalide"})
            const errors = {};
            error.errors.foreach((err) => {
                errors[err.path[0]] = err.message;
            });

            // Sauvegarder erreurs et input utilisateurs dans la session
            req.session.flash = {
                error: "Veuillez corrriger les erreurs ci-dessous.",
            }
            req.session.errors = errors; // Erreurs spécifiques par champs
            req.session.oldInput = req.body; // Ce que l'utilsateur à écrit

            //3. Rediriger vers la page précédente (Referer)
            return res.redirect(req.get("Referer") || "/"); 

        }
        next(error); // Erreur technique
    }
};