import logs from "../fixtures/logs.json";
import { STORAGE_KEY_LOGGERS } from "./utils";

describe('Details page', () => {

    describe('Search bar', () => {

        beforeEach(() => {
            localStorage.setItem(STORAGE_KEY_LOGGERS, JSON.stringify(logs));
            cy.visit('/details');
        });

        it('should filter logs by search input', () => {
            cy.get('#search-input').type('erreur');
            cy.get('#search-button').click();
            cy.get('#log-display-container').children().should('have.length', 1);
        });

        it('should return multiple logs if more that one match is found', () => {
            cy.get('#search-input').type('plus de place');
            cy.get('#search-button').click();
            cy.get('#log-display-container').children().should('have.length', 2);
        });

        it('should search without being case sensative', () => {
            cy.get('#search-input').type('MeSsaGe');
            cy.get('#search-button').click();
            cy.get('#log-display-container').children().should('have.length', logs.length);
        });

        it('should display no logs if match is found but level is unchecked', () => {
            cy.get('#info-input').uncheck();
            cy.get('#warn-input').uncheck();

            cy.get('#search-input').type('plus de place'); // messages de type WARN et INFO
            cy.get('#search-button').click();

            cy.get('#log-display-container').children().should('have.length', 0);
        });
    });
});