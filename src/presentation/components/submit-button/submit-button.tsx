import React from 'react'
import Spinner from '../spinner/spinner'

type Props = {
  text: string
  state: any
}

const SubmitButton: React.FC<Props> = ({ state, text }: Props) => {
  return (
    <button data-testid="submit" disabled={state.isFormInvalid || !!state.isLoading} type="submit">
      {state.isLoading && <Spinner className="spinner" />}
      {!state.isLoading && <span>{text}</span>}
    </button>
  )
}

export default SubmitButton
