import { LOG_LEVEL } from "./consts.js";
import { generateId } from "./utils.js";

export default class Logger {

    /**
     * TODO : récupérer les messages du journal de la persistance locale et configurer l'objet
     * @param {Object} storageManager gestionnaire de persistance
     */
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.loadFromStorage();
    }

    /**
     * TODO : Ajouter un message dans le journal avec un texte, un niveau de gravité et un identifiant de session.
     * Faire persister le journal dans le stockage
     *
     * @param {string} text le texte du message
     * @param {string} level le niveau de gravité du message (voir la constante LOG_LEVEL)
     * @param {string} sessionId l'identifiant de session en cours
     * @returns {void}
     */
    add(text, level = LOG_LEVEL.INFO, sessionId = '') {
        const currentSessionId = sessionId || sessionStorage.getItem('sessionId');
        this.logs.push({ id: generateId(2), text, level, session: currentSessionId });
        this.storageManager.saveLogs(this.logs);
    }

    /**
    * TODO : Récupérer les messages du journal de la persistance locale
    */
    loadFromStorage() {
        this.logs = this.storageManager.getLogs();
    }

    get length() {
        return this.logs.length;
    }

    /**
     * TODO : Ajouter d'autres méthodes ou attributs si nécessaire
    */
    clear() {
        this.logs = [];
        this.storageManager.clearLogs();
    }

    remove(id) {
        this.logs = this.logs.filter(log => log.id !== id);
        this.storageManager.saveLogs(this.logs);
    }

    handleSession() {
        const existingSessionId = sessionStorage.getItem("sessionId");
        if (!existingSessionId) {
          const newSessionId = generateId();
          sessionStorage.setItem("sessionId", newSessionId);
        }
      }
}
