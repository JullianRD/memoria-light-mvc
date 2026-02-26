import session from "express-session"
import connectPgSimple from "connect-pg-simple"
import {pool as pgPool} from  "./database.js"
import {logger} from "./logger.js"

const PgSession = connectPgSession(session); 

/**
 * Options de configuration pour express-session
 * @type {import('express-session').SessionOptions}
 */
const sessionConfig = {
    secret: process.env.SESSION_SECRET || "remplace_moi_par_une_cle_secrete_longue_et_aleatoire_en_prod",
    resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: false, // Ne pas créer de session pour les visiteurs anonymes (GDPR Friendly)
    cookie: {
        secure: process.env.NODE_ENV === "production", // HTTPS uniquement en prod
        httpOnly: true, // Emmpêche le JS côté client 
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours 
        sameSite: "lax" // Protection CSRF basique 
    },
    store: new PgSession ({
        pool: pgPool, 
        tableName: "user_sessions",
        pruneExpired: true, // Supprime automatiquement les sessions expirées (très utile !)
        errorLog: (err) => {
            logger.error(
                {err, type: "SESSION_STORE_ERROR"},
                "👿 Erreur critique dans le stockage de session PostgreSQL",
            );
        },
    }),
};

/** 
 * Middleware de session configuré pour Express
 * @type {import('express').RequestHandler}
*/
export const seesionMiddleware = session(sessionConfig);

/**
 * Configuration pour la table de stockage de sesion PostGreSQL.
 * Utile si on a besoin de référencer ce nom ailleurs (ex: migrations)
 * @type {{ tableName: string}}
*/

export const sessionTabConfig = {
    tableName: "user_sessions",
};