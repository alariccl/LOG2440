import { testHeader, testFooter } from "./shared";
describe('Main page', () => {

  beforeEach(() => {
    cy.visit('./src/index.html');
    cy.viewport(1000, 600);
    // cy.viewport(500, 600);
    // cy.viewport(800, 600);


  });

  testHeader();

  describe('Background', () => {
    it('Post container and body background colors should be different', () => {
      cy.get('.item-container').then(el => {
        expect(el.css('background-color')).to.not.equal(getComputedStyle(document.body)['backgroundColor']);
      })
    })
  });

  describe('Main Content', () => {

    it('header should contain a search form with a text input field', () => {
      cy.get('nav form#search-form')
        .should('exist')
        .find('input')
        .should('have.id', 'search-input')
        .type('Test message')
        .should('have.value', 'Test message');
    });

    it('Page should have a header', () => {
      cy.get('h1').contains("Les dernières annonces");
    });

    it('Page should have single list of items', () => {
      cy.get('#item-list').should('have.length', 1);
    });

    it('Page should have a list of 3 items', () => {
      cy.get('.item-container').should('have.length', 3);
    });

    it('Clicking on an item should redirect to the item page', () => {
      cy.get('.item-container').first().click();
      cy.url().should('include', 'item.html');
    });

    it('First item should have correct title, image and price', () => {
      const testItem = {
        title: "Compilers: Principles, Techniques, and Tools",
        price: "70",
        image: "item-1.jpg"
      }

      cy.get('#item-1 .item-name').contains(testItem.title);
      cy.get('#item-1 .item-price').contains(testItem.price);
      cy.get('#item-1 img').should('have.attr', 'src', `assets/img/${testItem.image}`);
    });

    describe('Media Queries', () => {

      it('Search bar should be hidden and items centered under 800px', () => {
        cy.viewport(799, 500);

        cy.get('#search-form').should('not.be.visible');
        cy.get('#item-list').invoke('css', 'justify-content').should('eq', 'center');
      });

      it('Items should be in 1 column without an image under 500px', () => {
        cy.viewport(499, 500);

        cy.get('#item-list').invoke('css', 'flex-direction').should('eq', 'column');
        cy.get('#item-1 img').should('not.be.visible');
      });

    });

    testFooter();


  });

});