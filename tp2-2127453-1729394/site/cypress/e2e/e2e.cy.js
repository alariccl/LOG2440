import logs from "../fixtures/logs.json";
import addNewLog from "./utils";

describe('End to End tests', () => {

    const MESSAGES = [
        { text: 'New log message 1', level: 'error' },
        { text: 'New log message 2', level: 'info' },
        { text: 'New log message 3', level: 'debug' }
    ];

    describe('Simple log manipulation', () => {
        it('should add default logs, transition to details page and see logs and stats', () => {
            cy.visit('/');

            cy.get('#default-logger-btn').click();
            cy.get('#details-link').click();

            cy.get('#log-display-container').children().should('have.length', logs.length);
            cy.get('#log-display-container').children().each(($el, index) => {
                cy.wrap($el).should('contain', logs[index].text);
            });

            cy.get('#messages-debug').should('contain', 1);
            cy.get('#messages-info').should('contain', 1);
            cy.get('#messages-warning').should('contain', 1);
            cy.get('#messages-error').should('contain', 1);
        });

        it('should add a new log error, transition to details page and see the new log', () => {
            cy.visit('/');

            addNewLog(MESSAGES[0].text, MESSAGES[0].level);

            cy.get('#details-link').click();

            cy.get('#log-display-container').children().should('have.length', 1);
            cy.get('#log-display-container').children().last().should('contain', 'New log message');
            cy.get('.log-detail-message').first().should('have.class', 'error');
        });

    });

    describe('Log deletion', () => {

        it('should add two logs, transition to details page, delete one log and see logs and stats', () => {
            cy.visit('/');

            addNewLog(MESSAGES[0].text, MESSAGES[0].level);
            addNewLog(MESSAGES[1].text, MESSAGES[1].level);

            cy.get('#details-link').click();

            cy.get('#log-display-container').children().should('have.length', 2);

            cy.get('.log-detail-info button').first().click();
            cy.get('#log-display-container').children().should('have.length', 1);

            cy.get('#messages-debug').should('contain', 0);
            cy.get('#messages-info').should('contain', 1);
            cy.get('#messages-warning').should('contain', 0);
            cy.get('#messages-error').should('contain', 0);
            cy.get('#messages-total').should('contain', 1);
        });

        it('should add two logs, transition to details page, delete one, go back to main page and see only one log', () => {
            cy.visit('/');

            addNewLog(MESSAGES[0].text, MESSAGES[0].level);
            addNewLog(MESSAGES[1].text, MESSAGES[1].level);

            cy.get('#log-list').children().should('have.length', 2);

            cy.get('#details-link').click();

            cy.get('#log-display-container').children().should('have.length', 2);

            cy.get('.log-detail-info button').first().click();
            cy.get('#log-display-container').children().should('have.length', 1);

            cy.get('header a').click();
            cy.get('#log-list').children().should('have.length', 1);

        });

    });

    describe('Using filters', () => {

        it('should add multiple logs, transition to details page and filter by date descending (reverse order)', () => {
            cy.visit('/');

            addNewLog(MESSAGES[0].text, MESSAGES[0].level);
            addNewLog(MESSAGES[1].text, MESSAGES[1].level);
            addNewLog(MESSAGES[2].text, MESSAGES[2].level);

            cy.get('#details-link').click();

            cy.get('#date-des').check();
            cy.get('#log-display-container').first().should('contain', MESSAGES[0].text);
            cy.get('#log-display-container').children().each(($el, index) => {
                cy.wrap($el).should('contain', `New log message ${3 - index}`);
            });
        });

        it('should add multiple logs with different levels, transition to details page and apply filter for Debug and Error only', () => {
            cy.visit('/');

            addNewLog(MESSAGES[0].text, MESSAGES[0].level);
            addNewLog(MESSAGES[1].text, MESSAGES[1].level);
            addNewLog(MESSAGES[2].text, MESSAGES[2].level);

            cy.get('#details-link').click();

            cy.get('#log-display-container').children().should('have.length', 3);
            cy.get('#log-display-container').children().each(($el, index) => {
                cy.wrap($el).should('contain', `New log message ${index + 1}`);
            });

            cy.get('#warn-input').uncheck();
            cy.get('#info-input').uncheck();

            cy.get('#log-display-container').children().should('have.length', 2);
            cy.get('#log-display-container').first().should('contain', MESSAGES[0].text);
            cy.get('#log-display-container').last().should('contain', MESSAGES[2].text);
        });

        it('should add multiple logs with different text, transition to details page and use search function', () => {
            cy.visit('/');

            const MODIFIED_MESSAGE = { text: 'Old log message 2', level: 'error' };
            addNewLog(MESSAGES[0].text, MESSAGES[0].level);
            addNewLog(MODIFIED_MESSAGE.text, MODIFIED_MESSAGE.level);
            addNewLog(MESSAGES[2].text, MESSAGES[2].level);

            cy.get('#details-link').click();

            cy.get('#log-display-container').children().should('have.length', 3);

            cy.get('#search-input').type('New');
            cy.get('#search-button').click();

            cy.get('#log-display-container').children().should('have.length', 2);
            cy.get('#log-display-container').first().should('contain', MESSAGES[0].text);
            cy.get('#log-display-container').last().should('contain', MESSAGES[2].text);

            cy.get('#search-input').clear();
            cy.get('#search-input').type('Old');
            cy.get('#search-button').click();

            cy.get('#log-display-container').children().should('have.length', 1);
            cy.get('#log-display-container').first().should('contain', MODIFIED_MESSAGE.text);
        });

    });

    describe('Handling multiple sessions', () => {
        it('should add logs with different sessions, transition to details page and filter by session', () => {
            cy.visit('/');

            addNewLog(MESSAGES[0].text, MESSAGES[0].level);
            addNewLog(MESSAGES[1].text, MESSAGES[1].level);

            cy.clearAllSessionStorage();
            cy.reload();
            addNewLog(MESSAGES[2].text, MESSAGES[2].level);

            cy.get('#details-link').click();

            cy.get('#sessions-total').should('contain', 2);
            cy.get('#log-display-container').children().should('have.length', 3);

            cy.get('#session-group-btn').click();
            cy.get('#log-display-container').children().should('have.length', 1);
        });

        it('shoud add logs, change session, transitions to details and filter by session with no results', () => {
            cy.visit('/');

            addNewLog(MESSAGES[0].text, MESSAGES[0].level);
            addNewLog(MESSAGES[1].text, MESSAGES[1].level);

            cy.clearAllSessionStorage();
            cy.reload();

            cy.get('#details-link').click();

            cy.get('#log-display-container').children().should('have.length', 2);

            cy.get('#session-group-btn').click();
            cy.get('#log-display-container').children().should('have.length', 0);

            cy.get('#session-group-btn').click();
            cy.get('#log-display-container').children().should('have.length', 2);
        });
    });

});