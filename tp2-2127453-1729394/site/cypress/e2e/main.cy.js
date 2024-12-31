import logs from "../fixtures/logs.json";
import addNewLog from "./utils";

describe('Main page', () => {

    describe('Interface manipulation', () => {

        it('No logs in storage should hide reset button, display empty warning and have an empty list', () => {
            cy.visit('/');
            cy.get('#log-list').children().should('have.length', 0);
            cy.get('#reset-logger-btn').should('not.be.visible');
            cy.get('#empty-warning').should('be.visible');
        });

        it('Reset button should be visible and empty warning should be invisible if logs are loaded', () => {
            cy.visit('/');
            cy.get('#default-logger-btn').click();
            cy.get('#reset-logger-btn').should('be.visible');
            cy.get('#empty-warning').should('not.be.visible');
        });

        it('Link should redirect to details page', () => {
            cy.visit('/');
            cy.get('#details-link').click();
            cy.url().should('include', '/details');
        });

        describe('Log manipulation', () => {

            it('Default logs should be loaded when button is clicked', () => {
                cy.visit('/');
                cy.get('#default-logger-btn').click();
                cy.get('#log-list').children().should('have.length', logs.length);
                cy.get('#log-list').children().each(($el, index) => {
                    cy.wrap($el).should('contain', logs[index].text);
                });
            });

            it('Reset button should clear logs', () => {
                cy.visit('/');
                cy.get('#default-logger-btn').click();
                cy.get('#log-list').children().should('have.length', logs.length);
                cy.get('#reset-logger-btn').click();
                cy.get('#log-list').children().should('have.length', 0);
            });

            it('Log list should be updated when a log is added', () => {
                const text = 'Test log';
                const level = 'info';
                cy.visit('/');

                addNewLog(text, level);

                cy.get('#log-list').children().should('have.length', 1);
                cy.get('#log-list').children().first().should('contain', text);
            });

            it('Log list element should contain data, level and text', () => {
                const text = 'Information message';
                const level = 'info';
                const dateRegex = new RegExp('[^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$]');
                cy.visit('/');

                addNewLog(text, level);

                cy.get('#log-list').children().first()
                    .should('contain', `[${level.toUpperCase()}]`)
                    .should('contain', text)
                    .invoke('text').should('match', dateRegex);
            });
        });
    });

    describe('Storage', () => {
        it('Logs should be stored in local storage and loaded on reset', () => {
            const text = 'Test log';
            const level = 'info';
            cy.visit('/');

            addNewLog(text, level);

            cy.reload();
            cy.get('#log-list').children()
                .should('have.length', 1)
                .should('contain', text);

            cy.getAllLocalStorage().then((storage) => {
                const data = JSON.parse((storage['http://localhost:3000'])['log2440-logs']);
                expect(data[0].text).to.equal(text);
                expect(data[0].level).to.equal(level);
            });
        });

        it('Logs should have a different session ids if the session changes', () => {
            const text = 'Test log';
            const level = 'info';
            cy.visit('/');

            addNewLog(text, level);

            // Simuler une nouvelle session
            cy.clearAllSessionStorage();
            cy.reload();

            cy.get('#log-input').type(`${text} - 2`);
            cy.get('#log-level').select(level);
            cy.get('#log-form').submit();

            cy.getAllLocalStorage().then((storage) => {
                const data = JSON.parse((storage['http://localhost:3000'])['log2440-logs']);
                expect(data[0].session).to.not.equal(data[1].session);
            });
        });
    });
});