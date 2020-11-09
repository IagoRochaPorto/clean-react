import * as formHelper from '../support/form-helper'
import * as Http from '../support/signup-mocks'
import faker from 'faker'

const simulateValidSumit = (): void => {
  cy.getByTestId('name').focus().type(faker.name.findName())
  cy.getByTestId('email').focus().type(faker.internet.email())
  const password = faker.random.alphaNumeric(7)
  cy.getByTestId('password').focus().type(password)
  cy.getByTestId('passwordConfirmation').focus().type(password)
  cy.getByTestId('submit').click()
}

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

  it('Should present EmailInUseError on 403', () => {
    Http.mockEmailInUseError()
    simulateValidSumit()
    formHelper.testMainError('Esse email já está em uso')
    formHelper.testUrl('/signup')
  })

  it('Should present unexpectedError on 400 ', () => {
    Http.mockUnexpectedError()
    simulateValidSumit()
    formHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    formHelper.testUrl('/signup')
  })

  it('Should present unexpectedError if invalid data is returned', () => {
    Http.mockInvalidData()
    simulateValidSumit()
    formHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    formHelper.testUrl('/signup')
  })
})
