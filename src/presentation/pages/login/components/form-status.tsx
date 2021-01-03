import React from 'react'
import { FormStatusBase } from '@/presentation/components'
import { useRecoilState } from 'recoil'
import { loginState } from '.'

const FormStatus: React.FC = () => {
  const [state] = useRecoilState(loginState)
  return <FormStatusBase state={state} />
}

export default FormStatus
