import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import PrivateRoute from './private-route'

type SystemUnderTestTypes = {
  history: MemoryHistory
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  render(
    <Router history={history}>
      <PrivateRoute />
    </Router>
  )
  return {
    history
  }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSystemUnderTest()
    expect(history.location.pathname).toBe('/login')
  })
})
