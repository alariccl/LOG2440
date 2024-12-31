import { testHeader, testFooter } from "./shared";
describe('Item page', () => {

    const testItem = {
        title: "Compilers: Principles, Techniques, and Tools",
        price: "70",
        image: "item-1.jpg",
        state: "Nouveau",
        seller: "Jean Untel"
    };

    beforeEach(() => {
        cy.visit('./src/item.html');
    });

    testHeader();

    describe('Item information', () => {

        it('Should contain the item title', () => {
            cy.get('h1#item-title').should('have.text', testItem.title);
        });

        it('Should contain the item image', () => {
            cy.get('img#item-preview').should('have.attr', 'src', `./assets/img/${testItem.image}`);
        });

        it('Should contain the item information', () => {
            cy.get('#item-price').should('have.text', `${testItem.price}$`);
            cy.get('#item-state').should('have.text', testItem.state);
            cy.get('#item-seller').should('have.text', testItem.seller);
        });

    });

    describe('Message form', () => {
        it('Should contain a form with one submit input ', () => {
            cy.get('form').should('exist');
            cy.get('form input[type="submit"]').should('exist');
        });

        it('Should contain a text input and a textarea that are required', () => {
            cy.get('form input[type="text"]').should('have.length', 1).should('have.attr', 'required');
            cy.get('form textarea').should('have.length', 1).should('have.attr', 'required');
        });

        it('Incomplete form should not be submitted', () => {
            cy.get('form input[type="text"]').type('Test name');
            cy.get('form input[type="submit"]').click();
            cy.get('textarea:invalid').should('have.length', 1);
        });

        it('Complete form should be submitted and reset', () => {
            cy.get('form input[type="text"]').type('Test name');
            cy.get('form textarea').type('Test message for an item');
            cy.get('form input[type="submit"]').click();

            cy.get('form input[type="text"]').should('have.value', '');
        });

        it('Only spaces in name should be invalid', () => {
            cy.get('form input[type="text"]').type('  ').invoke('prop', 'validity').should('deep.include', {
                patternMismatch: true
            });
        });

    });

    testFooter();
});