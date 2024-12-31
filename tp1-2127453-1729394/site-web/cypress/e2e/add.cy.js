import { testHeader, testFooter } from "./shared";
describe('Add page', () => {

    beforeEach(() => {
        cy.visit('./src/add.html');
    });

    testHeader();

    describe('Form information', () => {

        it('Should contain 3 different inputs for the item information', () => {
            cy.get('form fieldset#item-information-set input').should('have.length', 3);
            cy.get('form fieldset#item-information-set select').should('have.length', 1);

            cy.get('input#name').should('exist').should('have.attr', 'type', 'text');
            cy.get('input#price').should('exist').should('have.attr', 'type', 'number');
            cy.get('input#image').should('exist').should('have.attr', 'type', 'file').should('have.attr', 'accept', 'image/*');
        });

        it('Should have a selector with 2 options that is not required', () => {
            cy.get('select option').should('have.length', 2);
            cy.get('select').should('not.have.attr', 'required');
        });

        it('Should contain 3 different inputs for the contact information', () => {
            cy.get('form fieldset#contact-information-set input').should('have.length', 3);

            cy.get('input#seller-name').should('exist').should('have.attr', 'type', 'text');
            cy.get('input#seller-email').should('exist').should('have.attr', 'type', 'email');
            cy.get('input#seller-anonymous').should('exist').should('have.attr', 'type', 'checkbox');
        });

        it('Should contain labels for every input or selector', () => {
            cy.get('form label').should('have.length', 7).each(($label) => {
                expect($label).to.have.attr('for');
            });
        });

        it('Should contain a submit button', () => {
            cy.get('form input[type="submit"]').should('exist');
        });

    });

    describe('Message form', () => {
        it('Incomplete form should not be submitted', () => {
            cy.get('#name').type('Test name');
            cy.get('#price').type('10');
            cy.get('input[type="submit"]').click();
            cy.get('input:invalid').should('have.length', 3);
        });

        it('Complete form should be submitted and reset', () => {
            cy.get('#name').type('Test name');
            cy.get('#price').type('10');
            cy.get('#image').selectFile('./src/assets/img/item-1.jpg');
            cy.get('#item-state-select').select('Nouveau');
            cy.get('#seller-name').type('Test seller');
            cy.get('#seller-email').type('a@b.c');
            cy.get('#seller-anonymous').check();

            cy.get('input[type="submit"]').click();

            cy.get('#name').should('have.value', '');
        });

        it('Should accept form without interacting with checkbox or selector', () => {
            cy.get('#name').type('Test name');
            cy.get('#price').type('10');
            cy.get('#image').selectFile('./src/assets/img/item-1.jpg');
            cy.get('#seller-name').type('Test seller');
            cy.get('#seller-email').type('a@b.c');
            
            cy.get('input[type="submit"]').click();

            cy.get('#name').should('have.value', '');
        });

    });

    testFooter();
});