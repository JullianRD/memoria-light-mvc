# NODEJS CLI


Dans le contexte de Node.js, `fs` fait référence au module File System (système de fichiers), un module intégré permetant d'effectuer des opérations d'entrée/sortie (Input/output) sur les fichiers et les dossiers du serveur.

## Principales fonctionalitées

- **Lecture/ecriture des fichiers:**
`fs.readFile()` 
`fs.writeFile()`

- **Gestion de dossier:** 
    - Création: `fs.mkdir()`
    - Suppression `fs.rmdir`
    - Listing `fs.readdir`

- **Opérations synchrones et asynchrones:**
Par exemple, `readFileSync()` (bloquant) vs `fs.readFile()` (non bloquant)
`fs.readFile()` 
`fs.writeFile()`

- **Manipulation des flux:**
`fs.createReadStream()`, 
`fs.createWriteStream()`

- **Accès aux métadonnées:**
- `fs.stat()` pour obtenir les informations sur un fichier (taille, date, type, etc...)