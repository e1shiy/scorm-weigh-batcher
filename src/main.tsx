import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppTest from './AppTest.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppTest />
  </StrictMode>,
)
