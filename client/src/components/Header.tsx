import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { Flex, Input, Button } from '@chakra-ui/react'

const Header = (): JSX.Element => (
  <Flex
    color="zinc300"
    p="1"
    mt="1"
    height="30px"
    gap="10px"
    width="40vw"
    borderTopLeftRadius={'10px'}
    alignItems={'center'}
    justifyContent={'center'}
  >
    <Input
      flex="2"
      placeholder="Search Universe"
      background="rgba(0, 0, 0, 0.4)"
      borderRadius="md"
      borderColor="transparent"
      height="30px"
      _placeholder={{ color: 'zinc300' }}
      _focusVisible={{ borderColor: '' }}
      _hover={{ borderColor: '', background: 'rgba(0, 0, 0, 0.3)' }}
    />
    <Button
      size={'sm'}
      bg="transparent"
      color="zinc300"
      _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
    >
      <QuestionOutlineIcon boxSize={'5'} />
    </Button>
  </Flex>
)

export default Header
