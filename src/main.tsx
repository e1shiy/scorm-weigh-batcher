import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SpacingDiagram from './ui/scheme/statik/schema'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpacingDiagram />
  </StrictMode>,
)
