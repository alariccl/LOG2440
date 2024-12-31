import Logger from "./logger.js";
import StorageManager from "./storageManager.js";
import { formatDate, generateId } from "./utils.js";
import DEFAULT_LOGS from "./defaultData.js";

export default class DetailsManager {
  constructor(logger) {
    this.logger = logger;
    this.filteredLogs = [];
    this.currentSession = false ;
    this.logDisplayParent = document.getElementById("log-display-container");
    this.statsDisplayParent = document.getElementById("stats-container");

    // TODO : Ajouter les attributs nécessaires pour compléter les fonctionnalités du TP
  }

  /**
   * TODO : Initaliser la gestion des événements et charger les messages du journal
   */
  init() {
    this.loadLogs();
    this.handleSession();
    this.updateStats();
    this.bindEvents();
    this.resetFilters();
  }

  

  bindEvents() {
  const buttons = document.querySelectorAll(".fa-trash");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const element = button.parentElement.parentElement;
      const messageId = element.querySelector("#message-id");
      storageManager.removeItem(messageId.textContent);
      element.remove();
      detailsManager.removeLog(messageId.textContent);
      detailsManager.updateStats();
    });
  });

  const searchInput = document.getElementById("search-button");
  searchInput.addEventListener("click", (e) => {
    e.preventDefault();
    this.filterLogs();
  });

  const checkboxes = document.querySelectorAll(".level-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      this.filterLogs();
    });
  });

  document.getElementById('session-group-btn').addEventListener('click', () => {
    this.currentSession = !this.currentSessionOnly;
    this.applyGroup();
});

}

applyGroup() {
    if (this.currentSession) {
                const currentSessionId = this.logger.getSessionId();
                logs = logs.filter(log => log.session === currentSessionId);
            }
}

filterLogs() {
  const searchValue = document
    .getElementById("search-input")
    .value.toLowerCase();

  const checkedLevels = Array.from(
    document.querySelectorAll(".level-checkbox:checked")
  ).map((checkbox) => checkbox.value);

  if (checkedLevels.length === 0) {
    detailsManager.filteredLogs = detailsManager.logger.logs.filter((log) =>
      log.text.toLowerCase().includes(searchValue)
    );
  } else {
    detailsManager.filteredLogs = detailsManager.logger.logs.filter(
      (log) =>
        log.text.toLowerCase().includes(searchValue) &&
        checkedLevels.includes(log.level)
    );
  }

  detailsManager.logDisplayParent.innerHTML = "";
  detailsManager.filteredLogs.forEach((log) => {
    const logItem = detailsManager.buildLoggerItem(log);
    detailsManager.logDisplayParent.appendChild(logItem);
  });
}

  /**
   * TODO : Charger les messages du journal et l'afficher
   */
  loadLogs() {
    this.filteredLogs = this.logger.logs;

    for (const log of this.filteredLogs) {
      const logItem = this.buildLoggerItem(log);
      this.logDisplayParent.appendChild(logItem);
    }
  }

  /**
   * TODO : Construire la structure HTML d'un message du journal
   * @param {import('./storageManager.js').Log} log message du journal
   * @returns {HTMLDivElement} parent HTML du message dans la liste
   */
  buildLoggerItem(log) {
    const logItem = document.createElement("div");

    logItem.classList.add("log-detail-message");
    if (log.level === "warn") {
      log.level = "warning";
    }
    logItem.classList.add(log.level);

    const logDetailInfo = document.createElement("div");
    logDetailInfo.classList.add("log-detail-info");

    const time = document.createElement("span");
    time.textContent = `[${formatDate(new Date())}]`;

    const sessionSpan = document.createElement("span");
    sessionSpan.textContent = log.session;

    const messageId = document.createElement("span");
    messageId.id = "message-id";
    messageId.textContent = log.id;
    messageId.style.display = "none";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("fa", "fa-trash");

    logDetailInfo.appendChild(time);
    logDetailInfo.appendChild(sessionSpan);
    logDetailInfo.appendChild(messageId);
    logDetailInfo.appendChild(deleteButton);

    const logMessage = document.createElement("p");
    logMessage.innerHTML = log.text;

    logItem.appendChild(logDetailInfo);
    logItem.appendChild(logMessage);

    return logItem;
  }

  /**
   * TODO : Calculer les statistiques des messages du journal en une seule itération
   * Vous ne pouvez pas utiliser des boucles `for`, `while` ou `forEach`
   * @returns { {
   * sessions: string[],
   * size: number,
   * levels : {debug: number, info : number, warn: number, error:number}
   * }} les statistiques
   */
  getCombinedStats() {
    return this.filteredLogs.reduce(
      (acc, log) => {
        if (!acc.sessions.includes(log.session)) {
          acc.sessions.push(log.session);
        }
        acc.size += log.size;
        if (log.level === "warning") {
          log.level = "warn";
        }
        acc.levels[log.level] = (acc.levels[log.level] || 0) + 1;
        return acc;
      },
      {
        sessions: [],
        size: 0,
        levels: { debug: 0, info: 0, warn: 0, error: 0 },
      }
    );
  }

  // TODO : Ajouter les méthodes nécessaires pour compléter les fonctionnalités du TP
  updateStats() {
    while (this.statsDisplayParent.firstChild) {
      this.statsDisplayParent.removeChild(this.statsDisplayParent.firstChild);
    }

    const stats = this.getCombinedStats();

    const totalMessages = document.createElement("p");
    totalMessages.textContent = `Messages totaux : `;

    const totalMessagesSpan = document.createElement("span");
    totalMessagesSpan.id = "messages-total";
    totalMessagesSpan.textContent = this.filteredLogs.length;
    totalMessages.appendChild(totalMessagesSpan);
    this.statsDisplayParent.appendChild(totalMessages);

    const debugMessages = document.createElement("p");
    debugMessages.textContent = `Messages de niveau Debug : `;
    const debugMessagesSpan = document.createElement("span");
    debugMessagesSpan.id = "messages-debug";
    debugMessagesSpan.textContent = stats.levels.debug;
    debugMessages.appendChild(debugMessagesSpan);
    this.statsDisplayParent.appendChild(debugMessages);

    const infoMessages = document.createElement("p");
    infoMessages.textContent = `Messages de niveau Info : `;
    const infoMessagesSpan = document.createElement("span");
    infoMessagesSpan.id = "messages-info";
    infoMessagesSpan.textContent = stats.levels.info;
    infoMessages.appendChild(infoMessagesSpan);
    this.statsDisplayParent.appendChild(infoMessages);

    const warningMessages = document.createElement("p");
    warningMessages.textContent = `Messages de niveau Warning : `;
    const warningMessagesSpan = document.createElement("span");
    warningMessagesSpan.id = "messages-warning";
    warningMessagesSpan.textContent = stats.levels.warn;
    warningMessages.appendChild(warningMessagesSpan);
    this.statsDisplayParent.appendChild(warningMessages);

    const errorMessages = document.createElement("p");
    errorMessages.textContent = `Messages de niveau Error : `;
    const errorMessagesSpan = document.createElement("span");
    errorMessagesSpan.id = "messages-error";
    errorMessagesSpan.textContent = stats.levels.error;
    errorMessages.appendChild(errorMessagesSpan);
    this.statsDisplayParent.appendChild(errorMessages);

    const sessions = document.createElement("p");
    sessions.textContent = `Nombre de sessions : `;
    console.log(stats.sessions);
    const sessionsSpan = document.createElement("span");
    sessionsSpan.id = "sessions-total";
    sessionsSpan.textContent = stats.sessions.length;
    sessions.appendChild(sessionsSpan);
    this.statsDisplayParent.appendChild(sessions);
    console.log(stats.sessions);
  }

  removeLog(logId) {
    this.filteredLogs = this.filteredLogs.filter((log) => log.id !== logId);
    this.updateStats();
  }

  handleSession() {
    const existingSessionId = sessionStorage.getItem("sessionId");
    if (!existingSessionId) {
      const newSessionId = generateId();
      sessionStorage.setItem("sessionId", newSessionId);
    }
  }

  resetFilters() {
    document.getElementById("search-input").value = "";
    const checkboxes = document.querySelectorAll(
      ".rounder-border input[type='checkbox']"
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
    document.getElementById("date-asc").checked = true;
    this.currentSessionOnly = false;
  }

}


// TODO : Configurer les objets nécessaires pour initialiser le contrôleur de la page

const storageManager = new StorageManager();
const logger = new Logger(storageManager);
const detailsManager = new DetailsManager(logger);

detailsManager.init();
