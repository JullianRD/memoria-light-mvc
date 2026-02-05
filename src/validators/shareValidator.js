'use strict'
import { z } from "zod"

/** 
 * Schéma de validation pour l'ajout d'une pépite
 * @see https://zod.dev/
*/

export const creationShareSchema = z.object({
    share_token: z.string().min(1, "").max(255, ""),
    recipient_email: z.string(),
})

export const updateShareSchema = creationShareSchema.partial();