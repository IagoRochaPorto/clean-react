import * as formHelper from '../support/form-helper'
import * as Http from './login-mocks'
import faker from 'faker'

const simulateValidSumit = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    formHelper.testInputStatus('email', 'Campo obrigatório')
    cy.getByTestId('email').should('have.attr', 'readonly')
    formHelper.testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readonly')
    cy.getByTestId('submit').should('have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrapper').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    formHelper.testInputStatus('email', 'Valor inválido')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    formHelper.testInputStatus('password', 'Valor inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrapper').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    formHelper.testInputStatus('email')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    formHelper.testInputStatus('password')
    cy.getByTestId('submit').should('not.have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrapper').should('not.have.descendants')
  })

  it('Should present invalidCredentialsError on 401', () => {
    Http.mockInvalidCredentialsError()
    simulateValidSumit()
    formHelper.testMainError('Credenciais inválidas')
    formHelper.testUrl('/login')
  })

  it('Should present unexpectedError on 400 ', () => {
    Http.mockUnexpectedError()
    simulateValidSumit()
    formHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    formHelper.testUrl('/login')
  })

  it('Should present unexpectedError if invalid data is returned', () => {
    Http.mockInvalidData()
    simulateValidSumit()
    formHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    formHelper.testUrl('/login')
  })

  it('Should present save accessToken if valid credentials are provided', () => {
    Http.mockOk()
    simulateValidSumit()
    cy.getByTestId('error-wrapper').should('not.have.descendants')
    formHelper.testUrl('/')
    formHelper.testLocalStorageItem('accessToken')
  })

  it('Should prevent multiple submits', () => {
    Http.mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').dblclick()
    formHelper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    Http.mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    formHelper.testHttpCallsCount(0)
  })
})
