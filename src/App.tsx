import { useState } from 'react'
import { LoginScreen } from './screens/LoginScreen'
import { PersonalDetailsScreen } from './screens/PersonalDetailsScreen'
import { EmploymentDetailsScreen } from './screens/EmploymentDetailsScreen'
import { FinancialInformationScreen } from './screens/FinancialInformationScreen'
import { SuccessScreen } from './screens/SuccessScreen'
import {
  initialApplicationData,
  type ApplicationData,
  type AppStep,
} from './types'

export default function App() {
  const [step, setStep] = useState<AppStep>('login')
  const [data, setData] = useState<ApplicationData>(initialApplicationData)
  const [accessToken, setAccessToken] = useState('')

  function updateData(updates: Partial<ApplicationData>) {
    setData((prev) => ({ ...prev, ...updates }))
  }

  function handleLoginSuccess(token: string, email: string) {
    setAccessToken(token)
    updateData({ email, password: '' })
    setStep('personal')
  }

  function handleLogout() {
    setAccessToken('')
    setData(initialApplicationData)
    setStep('login')
  }

  function handleStartNew() {
    setData((prev) => ({
      ...initialApplicationData,
      email: prev.email,
    }))
    setStep('personal')
  }

  switch (step) {
    case 'login':
      return (
        <LoginScreen
          data={data}
          onChange={updateData}
          onSuccess={handleLoginSuccess}
        />
      )
    case 'personal':
      return (
        <PersonalDetailsScreen
          data={data}
          onChange={updateData}
          onBack={() => setStep('login')}
          onContinue={() => setStep('employment')}
        />
      )
    case 'employment':
      return (
        <EmploymentDetailsScreen
          data={data}
          onChange={updateData}
          onBack={() => setStep('personal')}
          onContinue={() => setStep('financial')}
        />
      )
    case 'financial':
      return (
        <FinancialInformationScreen
          data={data}
          accessToken={accessToken}
          onChange={updateData}
          onBack={() => setStep('employment')}
          onContinue={() => setStep('success')}
        />
      )
    case 'success':
      return (
        <SuccessScreen
          accessToken={accessToken}
          onStartNew={handleStartNew}
          onLogout={handleLogout}
        />
      )
  }
}
