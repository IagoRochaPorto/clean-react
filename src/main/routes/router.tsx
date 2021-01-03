import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { makeSignUp, makeLogin, makeSurveyList, makeSurveyResult } from '@/main/factories/pages'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '../adapters/current-account-adapter'
import { PrivateRoute, currentAccountState } from '@/presentation/components'
import { RecoilRoot } from 'recoil'

const Router: React.FC = () => {
  const state = { setCurrentAccount: setCurrentAccountAdapter, getCurrentAccount: getCurrentAccountAdapter }

  return (
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, state)}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={makeLogin} />
          <Route path="/signup" exact component={makeSignUp} />
          <PrivateRoute path="/" exact component={makeSurveyList}></PrivateRoute>
          <PrivateRoute path="/surveys/:id" component={makeSurveyResult}></PrivateRoute>
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default Router
