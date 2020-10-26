import { AccountModel } from '@/domain/models/account-model'

export type AddAcountParams = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface AddAccount {
  add(params: AddAcountParams): Promise<AccountModel>
}
