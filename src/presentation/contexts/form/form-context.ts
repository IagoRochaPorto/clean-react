import { createContext } from 'react'

export type FormStateProps = {
  isLoading: boolean
  errorMessage: string
}

export default createContext<FormStateProps>({ isLoading: false, errorMessage: '' })
