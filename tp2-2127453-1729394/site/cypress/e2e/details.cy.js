import logs from "../fixtures/logs.json";

describe('Details page', () => {
    const STORAGE_KEY_LOGGERS = "log2440-logs";

    describe('Log list', () => {

        beforeEach(() => {
            localStorage.setItem(STORAGE_KEY_LOGGERS, JSON.stringify(logs));
        });

        it('should not load any logs if storage is empty', () => {
            localStorage.removeItem(STORAGE_KEY_LOGGERS);
            cy.visit('/details');

            cy.get('#log-display-container').children().should('have.length', 0);
        });

        it('should load logs if anything in the storage', () => {
            cy.visit('/details');

            cy.get('#log-display-container').children().should('have.length', logs.length);
            cy.get('#log-display-container').children().each(($el, index) => {
                cy.wrap($el).should('contain', logs[index].text);
            });
        });

        it('should assign correct CSS class to log depending on its level', () => {
            cy.visit('/details');

            cy.get('.log-detail-message').each(($el, index) => {
                cy.wrap($el).should('have.class', logs[index].level);
            });

        });

        it('should update logs when a log is deleted', () => {
            cy.visit('/details');

            cy.get('.log-detail-info button').first().click();
            cy.get('#log-display-container').children().should('have.length', logs.length - 1);
        });

    });

});