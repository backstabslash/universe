import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
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

function Main() {
  useEffect(() => {
    localStorage.setItem('chakra-ui-color-mode', 'dark')
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
)

