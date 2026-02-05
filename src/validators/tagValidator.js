'use strict'
import { z } from "zod"
import { registerSchema } from "./userValidator"

/** 
 * Schéma de validation pour l'ajout d'un tag
 * @see https://zod.dev/
*/

export const createTagSchema = z.object({
    tag_name: z.string().max(50, "").min(1, ""),
})

export const updateTagSchema = createTagSchema;partials();
