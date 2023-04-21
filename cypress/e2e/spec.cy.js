describe('App', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/');
  });

  it('shows an error when loading issues from an invalid repository URL', () => {
    const repoUrl = 'https://github.com/my-username/invalid-repo';
    cy.get('.input').type(repoUrl);
    cy.get('.button').click();
    cy.get('.alert').should('be.visible');
  });

  it('should drag issues between columns', () => {
    cy.get('.input')
      .type('https://github.com/facebook/react');
    cy.get('.button').click();
    cy.get('.column')
      .eq(0)
      .as('todo');
    cy.get('.column')
      .eq(1)
      .as('in-progress');
    cy.get('.column')
      .eq(2)
      .as('done');

    cy.get('@todo')
      .find('.issue')
      .its('length')
      .as('initialTodoLength');

    let initialTodoLength;

    cy.get('@initialTodoLength').then(len => {
      initialTodoLength = len;


      cy.get('@todo')
        .find('.issue')
        .eq(0)
        .as('issue')
        .should('be.visible')
        .focus()
        .trigger('keydown', { keyCode: 32 })
        .trigger('keydown', { keyCode: 39, force: true })
        .wait(1000)
        .trigger('keydown', { keyCode: 32, force: true });

      cy.get('@todo')
        .find('.issue')
        .should('have.length', initialTodoLength - 1);
    });
  });
});