import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SpacingDiagram from './ui/staticCpmponents/schema'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpacingDiagram />
  </StrictMode>,
)
