import { getProviders } from 'next-auth/react'
import SignInComponent from './SignInComponent'
import { Container, Image } from 'react-bootstrap'

export default async function SignIn() {
  const providers = await getProviders()

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Container className="max-w-md">
        <div className="text-center mb-5">
          <Image 
            src="/logo-ols-2023.png" 
            alt="OLS Logo" 
            className="mb-4"
            style={{ height: '60px', width: 'auto' }}
          />
          <h1 className="h4 mb-3">Welcome to OLS Training Hub</h1>
          <p className="text-muted">Please sign in with your OLS email address to continue.</p>
        </div>
        <div className="bg-white p-4 rounded-3 shadow-sm">
          <SignInComponent providers={providers} />
        </div>
      </Container>
    </div>
  )
} 