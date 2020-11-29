import React from 'react'
import { makeSignupValidation } from './signup-validation-factory'
import { Signup } from '@/presentation/pages'
import { makeRemoteAddAccount } from '@/main/factories/usecases'

export const makeSignUp: React.FC = () => {
  return <Signup addAccount={makeRemoteAddAccount()} validation={makeSignupValidation()} />
}
