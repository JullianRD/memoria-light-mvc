import multer from "multer"
import path from "path"
import crypto from "crypto"

/**
 * Configuration de l'upload de fichiers (images)
 * Stockage local pour l'instant 
 * @module config/upload
 * @see https://medium.com/
*/

// Définition du stockage : ou et comment nommer les fichiers 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Le dossier doit exister
        cb(null, "public/uploads/")
    },
    filename: (req, file, cb) => {
        // Génère un nom unique: uuid + extension (ex: alb2...c44.jpg)
        const uniqueSuffix = crypto.randomUUID();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`)
    },
})

// Filtre: Accepter uniquement les images 
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if(allowedTypes.includes(file.minetype)) {
    cb(null, true);
} else {
    cb(new Error("Format de fichier non supporté, Images uniquement.", false));
}
}

// Export du middleware configuré
export const uploadConfig = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite à 5MB
    },
});