'use strict'
import { z } from "zod"

/** 
 * Schéma de validation pour l'ajout d'une pépite
 * @see https://zod.dev/
*/

export const creationItemSchema = z.object({
    type: z.enum(['book', 'podcast', 'article', 'video', 'note'], {
        required_error: "Le type est obligatoire"
    }),
    title: z.string().min(3, "").max(255, "").optional(),
    content: z.string().max(1000, "").optional(),
    source_author: z.string().max(250, "").optional(),
    source_url: z.string().optional().decode(),
    image_url: z.string().optional().decode(),
})

export const updateItemSchema = creationItemSchema.partial();

// export const responseTagSchema = z.object({
//     title: z.string(),
//     content_type: z.string(),
//     content: z.string(),
//     source_author: z.string().max(50, "")
// })