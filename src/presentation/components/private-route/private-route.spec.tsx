import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import PrivateRoute from './private-route'
import { currentAccountState } from '@/presentation/components'
import { mockAccountModel } from '@/domain/test'
import { RecoilRoot } from 'recoil'

type SystemUnderTestTypes = {
  history: MemoryHistory
}

const makeSystemUnderTest = (account = mockAccountModel()): SystemUnderTestTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(currentAccountState, { getCurrentAccount: () => account, setCurrentAccount: null })
      }
    >
      <Router history={history}>
        <PrivateRoute />
      </Router>
    </RecoilRoot>
  )
  return { history }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSystemUnderTest(null)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should render current component if token is not empty', () => {
    const { history } = makeSystemUnderTest()
    expect(history.location.pathname).toBe('/')
  })
})
