import * as formHelper from '../support/form-helper'

describe('Signup', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('Should load with correct initial state', () => {
    formHelper.testInputStatus('name', 'Campo obrigatório')
    cy.getByTestId('name').should('have.attr', 'readonly')
    formHelper.testInputStatus('email', 'Campo obrigatório')
    cy.getByTestId('email').should('have.attr', 'readonly')
    formHelper.testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readonly')
    formHelper.testInputStatus('passwordConfirmation', 'Campo obrigatório')
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readonly')
    cy.getByTestId('submit').should('have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrapper').should('not.have.descendants')
  })
})
