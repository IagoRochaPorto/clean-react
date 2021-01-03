import React from 'react'
import { FormStatusBase } from '@/presentation/components'
import { useRecoilState } from 'recoil'
import { signupState } from '.'

const FormStatus: React.FC = () => {
  const [state] = useRecoilState(signupState)
  return <FormStatusBase state={state} />
}

export default FormStatus
