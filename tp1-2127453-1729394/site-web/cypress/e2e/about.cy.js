import { testHeader, testFooter } from "./shared";
describe('About page', () => {

    beforeEach(() => {
        cy.visit('./src/about.html');
    });

    testHeader();

    describe('About Page', () => {

        it('Page should contain 3 sections with a header and 2 paragaphs', () => {
            cy.get('section').should('have.length', 3).each(($section) => {
                cy.wrap($section).find('h1').should('have.length', 1);
                cy.wrap($section).find('p').should('have.length', 2);
            });
        });

        it('Page should contain a link to add page', () => {
            cy.get('#add-link')
                .click();
            cy.url().should('include', 'add.html');
        });

        it('Page should contain a link to index page', () => {
            cy.get('#index-link')
                .click();
            cy.url().should('include', 'index.html');
        });

    });

    testFooter();
});