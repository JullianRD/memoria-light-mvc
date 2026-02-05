'use strict'
import { z } from "zod"
import { registerSchema } from "./userValidator"

/** 
 * Schéma de validation pour l'ajout d'un tag
 * @see https://zod.dev/
*/

export const registerSchema = z.object({
    tag_name: z.string().max(50, ""),
})