/* eslint-disable cypress/unsafe-to-chain-command */
describe('App', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/');
  });

  it('shows an error when loading issues from an invalid repository URL', () => {
    const repoUrl = 'https://github.com/my-username/invalid-repo';
    cy.get('.form__input').type(repoUrl);
    cy.get('.form__button').click();
    cy.get('.Toastify__toast').should('be.visible');
  });

  it('should drag issues between columns', () => {
    cy.get('.form__input').type('https://github.com/facebook/react');
    cy.get('.form__button').click();

    cy.get('.column').eq(0).as('todo');
    cy.get('.column').eq(1).as('in-progress');

    cy.get('@todo').find('.issue').its('length').as('initialTodoLength');
    cy.get('@in-progress').find('.issue').its('length').as('initialInProgressLength');

    let initialTodoLength;
    let initialInProgressLength;

    cy.get('@initialTodoLength').then(len => {
      initialTodoLength = len;

      cy.get('@initialInProgressLength').then(len => {
        initialInProgressLength = len;

        cy.get('@todo').find('.issue').eq(0)
          .should('be.visible')
          .focus()
          .trigger('keydown', { keyCode: 32 })
          .trigger('keydown', { keyCode: 39, force: true })
          .trigger('keydown', { keyCode: 32, force: true });

        cy.get('@todo').find('.issue').should('have.length', initialTodoLength - 1);
        cy.get('@in-progress').find('.issue').should('have.length', initialInProgressLength + 1);
      });
    });
  });
});
