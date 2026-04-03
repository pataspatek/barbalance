import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AuthProvider from './utils/AuthContext'
import LoadingWrapper from './components/LoadingWrapper/LoadingWrapper'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LoadingWrapper>
        <App />
      </LoadingWrapper>
    </AuthProvider>
  </StrictMode>,
)
