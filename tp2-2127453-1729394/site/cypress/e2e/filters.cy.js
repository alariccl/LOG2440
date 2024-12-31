import logs from "../fixtures/logs.json";
import { STORAGE_KEY_LOGGERS } from "./utils";

describe('Details page', () => {

    describe('Log filtering', () => {

        beforeEach(() => {
            localStorage.setItem(STORAGE_KEY_LOGGERS, JSON.stringify(logs));
        });

        it('should have default filter values', () => {
            cy.visit('/details');

            cy.get('#search-input').should('have.value', '');

            cy.get('#date-asc').should('be.checked');
            cy.get('#date-des').should('not.be.checked');

            cy.get('#debug-input').should('be.checked');
            cy.get('#info-input').should('be.checked');
            cy.get('#warn-input').should('be.checked');
            cy.get('#error-input').should('be.checked');
        });

        it('should filter logs by descending date', () => {
            cy.visit('/details');

            cy.get('#date-des').check();
            cy.get('#log-display-container').first().should('contain', logs[logs.length - 1].text);
        });

        it('should filter logs by ascending date', () => {
            cy.visit('/details');

            cy.get('#date-asc').check();
            cy.get('#log-display-container').first().should('contain', logs[0].text);
        });

        it('should filter by current sessionId', () => {
            const currentSessionId = logs[0].session;
            sessionStorage.setItem('log2440-tp2-sessionId', currentSessionId);

            cy.visit('/details');

            cy.get('#session-group-btn').click();
            cy.get('#log-display-container').children().should('have.length', 2);
        });

        it('should display no logs if no match is found for current sessionId', () => {
            const currentSessionId = "session-123";
            sessionStorage.setItem('log2440-tp2-sessionId', currentSessionId);

            cy.visit('/details');

            cy.get('#session-group-btn').click();
            cy.get('#log-display-container').children().should('have.length', 0);
        });

        it('should reset all filters through dedicated button', () => {
            cy.visit('/details');

            cy.get('#filter-reset-btn').click();

            cy.get('#search-input').should('have.value', '');

            cy.get('#date-asc').should('be.checked');
            cy.get('#date-des').should('not.be.checked');

            cy.get('#debug-input').should('be.checked');
            cy.get('#info-input').should('be.checked');
            cy.get('#warn-input').should('be.checked');
            cy.get('#error-input').should('be.checked');
        });
    });

    describe('Log level filtering', () => {

        beforeEach(() => {
            localStorage.setItem(STORAGE_KEY_LOGGERS, JSON.stringify(logs));
        });

        it('should display log type for only checked levels', () => {
            cy.visit('/details');

            cy.get('#info-input').uncheck();
            cy.get('#log-display-container').children().should('have.length', 3);
            cy.get('#log-display-container').children().each(($el) => {
                cy.wrap($el).should('not.contain', logs[0].text);
            });
        });

        it('should show no logs if no levels are checked', () => {
            cy.visit('/details');

            cy.get('#debug-input').uncheck();
            cy.get('#info-input').uncheck();
            cy.get('#warn-input').uncheck();
            cy.get('#error-input').uncheck();
            cy.get('#log-display-container').children().should('have.length', 0);
        });

        it('should keep filter order by date when sorting by level', () => {
            cy.visit('/details');

            cy.get('#date-des').check();
            cy.get('#info-input').uncheck();
            cy.get('#log-display-container').first().should('contain', logs[logs.length - 1].text);
        });
    });

});