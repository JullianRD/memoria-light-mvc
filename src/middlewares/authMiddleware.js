'use strict'

/**
 * Middleware d'authentification et de gestion de session
 * 
 * @module middlewares/authMiddleware
*/


/**
 * Injecte les données de l'utilisateur connecté dans res.locals
 * Cela rend la variable `currentUser` accessible dans toutes les vues EJS
 * Doit être placé après le middleware de session et avant les routes
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
*/

export const injectUserToLocals = (req, res, next) => {
    res.locals.currentUser = req.session.userId
    ? {
        id: req.session.userId, 
        email: req.session.email,
        pseudo: req.session.pseudo,
        role: req.session.roleName
    }
    : null;
    next();
}

/**
 * Vérifie si l'utilisateur est connecté
 * Si non, redirige vers la page de connexion
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
*/

export const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("pages/auth/login")
    }
    next();
}

/**
 * Vérifie si l'utilisateur est un visiteur
 * Si connecté, redirige vers le compte
 * Utile pour les pages login/register
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
*/

export const requireGuest = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect("pages/auth/login")
    }
    next();
}

/**
 * Vérifie si l'utilisateur est un customer
 * Si non, redirige vers la page de connexion
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
*/

export const requireCustomer = (req, res, next) => {
    if (req.session.roleName !== "customer") {
        return res.redirect("pages/auth/login")
    }
    next();
}

/**
 * Vérifie si l'utilisateur est un admin
 * Si non, redirige vers la page de connexion
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
*/

export const requireAdmin = (req, res, next) => {
    if (req.session.roleName !== "admin") {
        return res.redirect("pages/auth/login")
    }
    next();
}

/**
 * Vérifie si l'utilisateur est un super admin
 * Si non, redirige vers la page de connexion
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
*/

export const requireSuperAdmin = (req, res, next) => {
    if (req.session.roleName !== "super_admin") {
        return res.redirect("pages/auth/login")
    }
    next();
}