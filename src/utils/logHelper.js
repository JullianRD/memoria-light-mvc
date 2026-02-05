'use strict'
import { logger } from "../config/logger.js"

/** 
 * Helper pour standardiser les logs d'événements applicatifs
 * @modules utils/logHelper
*/

/**
 * Log une action importante de l'utilisateur (Audit trail)
 * @param {string} action - Nom de l'action (ex: 'ITEM_CREATE', 'AUTH_LOGIN')
 * @param {string} userId - l'ID de l'utilisateur
 * @param {object} details - Details supplémentaires (ex: {itemId: a5d4z..., ip: '...'})
 * @param {string} action - Nom de l'action (ex: 'ITEM_CREATE', 'AUTH_LOGIN')
*/

export const logAppEvent = (action, userId = "CUSTOMER", details = {} ) => {
    logger.info(
        {
            type: "APP_EVENT", // Permet de filtrer facilement les logs
            action,
            userId,
            ...details,
        },
        `[${action}] User ${userId}`
    )
}

/**
 * Log d'une erreur métier spécifique avec contexte
 * @param {Error} error - l'objet erreur
 * @param {string} contexMessage - message décrivant le contexte
 * @param {object} data - Données liées à l'erreur
*/

export const logAppError = (action, userId = "CUSTOMER", details = {} ) => {
    logger.info(
        {
            type: "APP_ERROR",
            ...data,
            err: error, // Pino sérialise automatiquement l'objet error
        },
        contexMessage || error.message,
    );
};