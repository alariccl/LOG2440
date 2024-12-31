import logs from "../fixtures/logs.json";
import { STORAGE_KEY_LOGGERS } from "./utils";

describe('Details page', () => {

    describe('Statistics', () => {

        beforeEach(() => {
            localStorage.setItem(STORAGE_KEY_LOGGERS, JSON.stringify(logs));
            cy.visit('/details');
        });

        it('should display the amount of logs', () => {
            cy.get('#messages-total').should('contain', logs.length);
        });

        it('should display the amount of logs by level', () => {

            cy.get('#messages-debug').should('contain', 1);
            cy.get('#messages-info').should('contain', 1);
            cy.get('#messages-warning').should('contain', 1);
            cy.get('#messages-error').should('contain', 1);
        });

        it('should display the number of unique sessions', () => {
            cy.get('#sessions-total').should('contain', 2);
        });

        it('should update statistics when message is deleted', () => {
            cy.get('.log-detail-info button').first().click();

            cy.get('#messages-total').should('contain', logs.length - 1);
            cy.get('#messages-debug').should('contain', 1);
            cy.get('#messages-info').should('contain', 0);
            cy.get('#messages-warning').should('contain', 1);
            cy.get('#messages-error').should('contain', 1);
            cy.get('#sessions-total').should('contain', 2);
        });
    });
});