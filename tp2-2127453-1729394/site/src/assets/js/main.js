import Logger from "./logger.js";
import StorageManager from "./storageManager.js";
import DEFAULT_LOGS from "./defaultData.js";
import { formatDate, generateId } from "./utils.js";

export default class MainPageController {
    /**
     * Configurer le contrôleur avec un gestionnaire de messages
     * @param {Logger} logger gestionnaire de messages
     */
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Initialiser le contrôleur de la page
     */
    init() {
        this.bindEvents();
        this.loadLogs();
        this.handleSession();
        this.updateUI();
    }

    /**
     * TODO : Ajouter des gestionnaires d'événements pour les boutons et le formulaire de la page
     */
    bindEvents() {
        document.getElementById('default-logger-btn').addEventListener('click', (e) => {
            e.preventDefault();
            for (const log of DEFAULT_LOGS) {
                this.logger.add(log.text, log.level, log.session);
            }
            this.updateUI();
        });

        document.getElementById('reset-logger-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logger.clear();
            this.updateUI();
        });

        document.getElementById('log-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const logText = document.getElementById('log-input').value;
            const logLevel = document.getElementById('log-level').value;
            this.logger.add(logText, logLevel, sessionStorage.getItem('sessionId'));
            this.updateUI();
            document.getElementById('log-input').value = '';
        });
    }

    /**
     * Construire un élément de la liste de messages selon le format :
     * `[AAAA-MM-JJ HH:MM:SS] - [Niveau] - Texte du message`
     * @param {string} log texte du message
     * @returns {HTMLLIElement} élément de liste de message
     */
    buildLogItem(log) {
        const logItem = document.createElement('li');
        logItem.textContent = `[${formatDate(new Date())}] - [${log.level.toUpperCase()}] - ${log.text}`;
        return logItem;
    }

    /**
     * Charger les messages du journal dans la liste de messages
     */
    loadLogs() {
        const logs = this.logger.logs;
        const logList = document.getElementById('log-list');
        for (const log of logs) {
            const logItem = this.buildLogItem(log);
            logList.appendChild(logItem);
        }
    }

    /**
     * TODO : Mettre à jour l'interface utilisateur en fonction de l'état du journal
    */
    updateUI() {
        const logList = document.getElementById('log-list');
        logList.innerHTML = '';
        this.loadLogs();

        if (this.logger.length > 0) {
            document.getElementById('reset-logger-btn').classList.remove('hidden');
        } else {
            document.getElementById('reset-logger-btn').classList.add('hidden');
        }

        const emptyWarning = document.getElementById('empty-warning');
        if (this.logger.logs.length > 0) {
            emptyWarning.classList.add('hidden');
        } else {
            emptyWarning.classList.remove('hidden');
        }
    }

    /**
     * TODO : Récupérer l'identifiant de session en cours ou en générer un nouveau
     */

    handleSession() {
        const existingSessionId = sessionStorage.getItem("sessionId");
        if (!existingSessionId) {
          const newSessionId = generateId();
          sessionStorage.setItem("sessionId", newSessionId);
        }
      }
}

// Configurer les objets nécessaires pour initialiser le contrôleur de la page

const storageManager = new StorageManager();
const logger = new Logger(storageManager);
const controller = new MainPageController(logger);

controller.init();
