'use strict'
import { z } from "zod"

/** 
 * Schéma de validation pour l'ajout d'une pépite
 * @see https://zod.dev/
*/

export const registerSchema = z.object({
    title: z.string(),
    content_type: z.string(),
    content: z.string(),
    source_author: z.string().max(50, "")
})

export const updateTagSchema = z.object({
    title: z.string(),
    content_type: z.string(),
    content: z.string(),
    source_author: z.string().max(50, "")
})

export const responseTagSchema = z.object({
    title: z.string(),
    content_type: z.string(),
    content: z.string(),
    source_author: z.string().max(50, "")
})