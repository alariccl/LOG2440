export function testHeader() {
    describe('Header', () => {

        it('text and background should be different colors', () => {
            cy.get('header').then(el => {
                expect(el.css('background-color')).to.not.equal(el.css('color'));
            });
        });

        it('should contain a nav element with id \'nav-bar\'', () => {
            cy.get('nav').should('have.id', 'nav-bar');
        });

        it('should contain a nav element with 3 links', () => {
            cy.get('nav a').should('have.length', 3);
        });

        it('nav elements should contain correct links', () => {
            const EXPECTED_LINKS = ['./index.html', './add.html', './about.html'];
            cy.get('nav a').each((link, i) => {
                cy.wrap(link.attr('href')).should('eq', EXPECTED_LINKS[i]);
            });
        });

        it('nav elements should have the correct icon', () => {
            const EXPECTED_ICONS = ['fa-book', 'fa-circle-info'];
            cy.get('li a i').each((icon, i) => {
                cy.wrap(icon.attr('class')).should('contain', EXPECTED_ICONS[i]);
            });
        });

    });
}

export function testFooter() {
    describe('Footer', () => {
        it('Page should have a footer element', () => {
            cy.get('footer').should('exist');
        });

        it('Footer should have 2 student names with id student-1 and student-2', () => {
            const EXPECTED_ID = ['student-1', 'student-2'];
            cy.get('footer span').should('have.length', 2).each((el, i) => {
                cy.wrap(el).should('have.id', EXPECTED_ID[i]);
            })
        });

        it('Footer should be at the bottom and aligned to the right', () => {
            cy.get('body').should('have.css', 'flex-direction', 'column');
            cy.get('footer').should('have.css', 'text-align', 'right')
        });
    });
}