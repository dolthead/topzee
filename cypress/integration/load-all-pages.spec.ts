
const pageList = [
    { 
        pageTitle: 'Topzee', url: '/home',
        elements: ['ion-img', 'ion-button' ],
    },
    { 
        pageTitle: 'Topzee', url: '/GameScreen',
        elements: ['ion-button', 'ion-icon[name=help-circle-outline]' ],
    },
];

describe('Topzee Ionic app', () => {
    it('loads dashboard page without errors', () => {
        cy.visit('/');
        cy.url().should('include', '/home');
    });

    pageList.forEach(page => {
        it(`loads ${page.url} with title and no errors`, () => {
            cy.visit(page.url);
            cy.get('ion-title').should('contain', page.pageTitle);
            if (page.elements) {
                page.elements.forEach(el => cy.get(el).should('exist'));
            }
        });
    });
});
