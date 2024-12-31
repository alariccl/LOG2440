const fs = require("fs/promises");

class FileManager {
    constructor(path) {
        this.path = path;
    }

    /**
     * Lit le contenu du fichier et le retourne dans une seule string.
     * @returns {Promise<string>} retourne une promesse résolue avec le contenu du fichier
    */
    async readFile() {
        return fs.readFile(this.path, { encoding: "utf-8" });
    }

    /**
     * Écrit le contenu d'un objet JS dans le fichier
     * @param {Object} content contenu à écrire. Doit être sérialisable en JSON
     * @returns {Promise<void>} retourne une promesse résolue une fois l'écriture terminée
    */
    async writeData(content) {
        await fs.writeFile(this.path, JSON.stringify(content, null, 2));
    }

    /**
     * Sauvegarde le contenu d'un fichier à un emplacement donné
     * @param {Buffer} imageFile contenu du fichier
     * @param {string} path chemin vers le fichier à créer
     * 
     */
    async saveFile(imageFile, path) {
        try {
            await fs.writeFile(path, imageFile);
        } catch (error) {
            throw new Error(`Failed to save file: ${error.message}`);
        }
    }

    /**
     * Supprimer un fichier en fonction de son chemin 
     * @param {string} path chemin du fichier à supprimer
     * 
     */
    async deleteFile(path) {
        try {
            await fs.unlink(path);
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
}

module.exports = { FileManager };