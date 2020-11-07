import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/form-context'
import Spinner from '../spinner/spinner'

type Props = {
  text: string
}

const SubmitButton: React.FC<Props> = ({ text }: Props) => {
  const { state } = useContext(Context)

  return (
    <button data-testid="submit" disabled={state.isFormInvalid || !!state.isLoading} type="submit">
      {state.isLoading && <Spinner className="spinner" />}
      {!state.isLoading && <span>{text}</span>}
    </button>
  )
}

export default SubmitButton
