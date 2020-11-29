import React from 'react'
import { makeLoginValidation } from './login-validation-factory'
import { Login } from '@/presentation/pages'
import { makeRemoteAuthentication } from '@/main/factories/usecases'

export const makeLogin: React.FC = () => {
  return <Login authentication={makeRemoteAuthentication()} validation={makeLoginValidation()} />
}
