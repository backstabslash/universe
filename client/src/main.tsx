import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './components/App'
import './styles/global.css'

const theme = extendTheme({
  colors: {
    zinc950: '#09090b',
    zinc900: '#18181b',
    zinc800: '#27272a',
    zinc700: '#3f3f46',
    zinc600: '#52525b',
    zinc500: '#71717a',
    zinc400: '#a1a1aa',
    zinc300: '#d4d4d8',
    zinc200: '#e4e4e7',
    zinc100: '#f4f4f5',
    zinc50: '#fafafa',
  },
  fonts: {
    body: 'Poppins, system-ui, sans-serif',
    heading: 'Poppins, system-ui, sans-serif',
    mono: 'Menlo, monospace',
  },
})

const domNode = document.getElementById('root')
const root = createRoot(domNode ?? document.createElement('div'))

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)
