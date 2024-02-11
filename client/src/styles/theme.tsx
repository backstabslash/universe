import { extendTheme } from '@chakra-ui/react'

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
    body: 'Noto Sans, system-ui, sans-serif',
    heading: 'Noto Sans, system-ui, sans-serif',
    mono: 'Menlo, monospace',
  },
})

export default theme
