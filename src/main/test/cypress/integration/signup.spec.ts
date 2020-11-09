import * as formHelper from '../support/form-helper'
import faker from 'faker'

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

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(3))
    formHelper.testInputStatus('name', 'Valor inválido')
    cy.getByTestId('email').focus().type(faker.random.word())
    formHelper.testInputStatus('email', 'Valor inválido')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    formHelper.testInputStatus('password', 'Valor inválido')
    cy.getByTestId('passwordConfirmation').focus().type(faker.random.alphaNumeric(4))
    formHelper.testInputStatus('passwordConfirmation', 'Valor inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrapper').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('name').focus().type(faker.name.findName())
    formHelper.testInputStatus('name')
    cy.getByTestId('email').focus().type(faker.internet.email())
    formHelper.testInputStatus('email')
    cy.getByTestId('password').focus().type(password)
    formHelper.testInputStatus('password')
    cy.getByTestId('passwordConfirmation').focus().type(password)
    formHelper.testInputStatus('passwordConfirmation')
    cy.getByTestId('submit').should('not.have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrapper').should('not.have.descendants')
  })
})
