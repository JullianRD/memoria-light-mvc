'use strict'
import { z } from "zod"

/**
 * Schéma de validation pour l'inscription d'un utilisateur
 * @see https://zod.dev/
*/

export const registerSchema = z.object({
    email: z
    .email("Format d'email invalide")
    .min(5, "l email doit contenir au moins 5 caractères")
    .max(255, "L email ne peux pas depasser 255 caratères "),

    password: z.string().min(8, "").max(100, "").regex(),

    pseudo: z.string().min(3, "").max(50, "").regex(),

    gdpr_consent: z.boolean().default(false)
})


/**
 * Schéma de validation pour l'inscription d'un utilisateur
 * @see https://zod.dev/
*/

export const loginSchema = z.object({
    email: z
    .email("Format d'email invalide")
    .min(5, "l email doit contenir au moins 5 caractères")
    .max(255, "L email ne peux pas depasser 255 caratères "),

    password: z.string().min(8, "").max(100, "").regex(),
})

/**
 * Schéma de validation pour l'inscription d'un utilisateur
 * @see https://zod.dev/
*/

export const updateProfilSchema = z.object({
    email: z
    .email("Format d'email invalide")
    .min(5, "l email doit contenir au moins 5 caractères")
    .max(255, "L email ne peux pas depasser 255 caratères ")
    .optional(),

    password: z.string().min(8, "").max(100, "").regex(),
    pseudo: z.string().min(3, "").max(50, "").regex(),
    preferences: z.object({
        theme: z.enum(['light', 'fr']).optional(),
        language: z.enum(["en", "fr"]).optional(),
    })
    .optional(),
});


/**
 * Schéma de validation pour l'inscription d'un utilisateur
 * @see https://zod.dev/
*/

export const responseProfilSchema = z.object({
    id: z.uuidv7(),
    email: z.email(),
    pseudo: z.string(),
    preferences: z
    .object({
        theme: z.enum(['light', 'fr']).optional(),
        language: z.enum(["en", "fr"]).optional(),
    })
    .optional(),
    gdprConsent: z.boolean(),
    gdprConsentDate: z.iso.datetime(),
});
