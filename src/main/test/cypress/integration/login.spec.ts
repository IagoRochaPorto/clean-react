import * as FormHelper from '../utils/form-helpers'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'
import faker from 'faker'

const path = /login/
export const mockInvalidCredentialsError = (): void => Http.mockUnathourizedError(path)
export const mockUnexpectedError = (): void => Http.mockServerError(path, 'POST')
export const mockSuccess = (): void => Http.mockOk(path, 'POST', 'fx:account')

const populateFields = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
}

const simulateValidSumit = (): void => {
  populateFields()
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    cy.getByTestId('email').should('have.attr', 'readonly')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('password').should('have.attr', 'readonly')
    cy.getByTestId('submit').should('have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrapper').should('not.have.descendants')
  })

  it('Should reset state on page load', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.getByTestId('signupLink').click()
    cy.getByTestId('loginLink').click()
    FormHelper.testInputStatus('email', 'Campo obrigatório')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    FormHelper.testInputStatus('email', 'Valor inválido')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'Valor inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrapper').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    FormHelper.testInputStatus('password')
    cy.getByTestId('submit').should('not.have.attr', 'disabled', 'disabled')
    cy.getByTestId('error-wrapper').should('not.have.descendants')
  })

  it('Should present invalidCredentialsError on 401', () => {
    mockInvalidCredentialsError()
    simulateValidSumit()
    FormHelper.testMainError('Credenciais inválidas')
    Helper.testUrl('/login')
  })

  it('Should present unexpectedError on 400 ', () => {
    mockUnexpectedError()
    simulateValidSumit()
    FormHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
    Helper.testUrl('/login')
  })

  it('Should present save accessToken if valid credentials are provided', () => {
    mockSuccess()
    cy.getByTestId('error-wrapper').should('not.have.descendants')
    simulateValidSumit()
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('Should prevent multiple submits', () => {
    mockSuccess()
    populateFields()
    cy.getByTestId('submit').dblclick()
    cy.wait('@request')
    Helper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    mockSuccess()
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    Helper.testHttpCallsCount(0)
  })
})
