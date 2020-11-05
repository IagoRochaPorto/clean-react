import React, { useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import Spinner from '../spinner/spinner'

type Props = {
  text: string
}

const SubmitButton: React.FC<Props> = ({ text }: Props) => {
  const { state } = useContext(Context)

  return (
    <button
      data-testid="submit"
      disabled={state.isFormInvalid || !!state.isLoading}
      className={Styles.submit}
      type="submit"
    >
      {state.isLoading && <Spinner className={Styles.spinner} />}
      {!state.isLoading && <span>{text}</span>}
    </button>
  )
}

export default SubmitButton
