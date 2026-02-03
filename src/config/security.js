'use strict'

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import logger from "./logger";

/**
 * Configuration de la sécurité de l'application 
 * @module config/security
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
*/

// Helmet configure automatiquement les headers HTTP (x-content-types-options, etc)
// pour protéger contre les les attaques courantes (XSS, Sniffing...)
export const securityHeaders = helmet({
    contentSecurityPolicy: {
    directives: {
        defaultSrc: ["'self'"],
        // Autoriser les scripts/styles inline (nécessaire pour Tailwind/alpine si via CDN (Content deliverer Network), ou scripts EJS simples)
        scriptSrc:  ["'self'", "'unsafe-inline'", "https://cdn.jsdeliver.net"],
        styletSrc:  ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc:  ["'self'", "https://fonts.gstatic.com"],
        scriptSrc:  ["'self'", "'data:'", "https:"], // Autoriser les images externes
    },
},
});

// CORS (CROSS-ORIGIN Ressource Sharing)
// Définit qui peut appeler notre API. Important si nous avons une partie API ou des assets externes.
export const corsConfig = cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Autoriser les cookies de session
})

// RATE LIMITING
// Limite le nombre des requêtes pour éviter le brute-force et le DoS.
export const globalLimter = rateLimit({
    windows: 15 * 60 * 1000, // Fenêtre de 15 minutes
    max: 1000, // Limite à 1000 requêtes par IP par fenêtres
    standardHeader: true, // Retourne les infos de rate limit dans le headers `RateLimite-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
    message:
    "Trop de requêtes provenant de cette IP, veuillez réessayer.",
    skip: (req) => req.ip === "127.0.0.1", // Ne pas limiter le localhost en dev
})

// Limiteur spécifique pour les routes  d'auth (login/register) - Plus Strict
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10, // 10 tentatives de connexion max par heure
    message: "Trop de tentatives de connexion échouées. Réesayer dans une heure",
})

// Protection CSRF (CROSS-SITE REQUEST FORGERY)
// Protège contre les attaques CSRF 
// On génère un token en session et on vérifie qu'il est présent dans le body des POST. 

export const csrfProtection = (req, res, next) => {
    // A. Génération du token s'il n'existe pas en session 
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomUUID()
    }

    // B. Injection dans les vues (pour les formulaires <input type="hidden" name="_csrf" ...>)
    res.locals.csrfToken = req.session.csrfProtection;

    // C. Vérification pour les requêtes qui modifient des données (POST, PUT, DELETE...)
    const methodsToProtect = ["POST", "PUT", "DELETE", "PATCH"];

    if (methodsToProtect.includes(req.method)) {
        const incomingToken = req.body._csrf || req.query._csrf || req.headers["csrf-token"]

        if (!incomingToken || incomingToken !==req.session.csrfToken) {
            // Log l'attaque potentielle
            logger.warn(`[CSRF] Attaque détectée ou token manquant pour ${req.ip}`)
            return res.status(403).render("pages/errors/500", {
                title: "Erreur de sécurité",
                message: "Session expirée ou action non autorisée (Token CSRF invalide)",
            })
        }
    }
};

// Cookie parser
// Permet de lire les cookies dans les requêtes (res.cookies)
export const cookieParser = cookieParser();