function addNewLog(text, level) {
    cy.get('#log-input').type(text);
    cy.get('#log-level').select(level.toLowerCase());
    cy.get('#log-form').submit();
}

export const STORAGE_KEY_LOGGERS = "log2440-logs";

export default addNewLog;