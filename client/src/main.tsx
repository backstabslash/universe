import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './components/App'
import './styles/global.css'
import theme from './styles/theme'

const domNode = document.getElementById('root')
const root = createRoot(domNode ?? document.createElement('div'))

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)
