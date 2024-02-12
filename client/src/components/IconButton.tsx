import { Button, type ButtonProps } from '@chakra-ui/react'

interface IconButtonProps extends ButtonProps {
  label: string | JSX.Element
}

const IconButton = ({ label, ...props }: IconButtonProps): JSX.Element => (
  <Button
    size="sm"
    mr="2"
    background="rgba(0, 0, 0, 0)"
    color="zinc300"
    _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
    {...props}
  >
    {label}
  </Button>
)

export default IconButton
