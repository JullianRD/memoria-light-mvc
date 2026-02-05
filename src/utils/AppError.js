'use strict'
/**
 * Classe d'erreur métier standarisée
 * Permet de distinguer les bugs (500) et des erreurs gérées (404, 403, 400)
*/

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.ifOperational = true // Indique une erreur prévue (ex: saisie invalide)

        Error.captureStackTrace(this, this.constructor);
    }
}

const myError = new Error()