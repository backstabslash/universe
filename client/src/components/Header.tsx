import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { Heading, Flex, Input, Button } from '@chakra-ui/react'

const Header = (): JSX.Element => (
  <Flex
    bg="zinc900"
    color="zinc300"
    p="4"
    height="60px"
    gap="10px"
    alignItems={'center'}
    borderBottom={'1px'}
    borderColor={'zinc600'}
  >
    <Heading
      flex="1"
      fontSize="2xl"
      borderColor="zinc600"
      bg="zinc800"
      padding="5px"
      borderRadius="md"
      width="200px"
      textAlign="center"
    >
      Universe
    </Heading>
    <Input
      flex="2"
      placeholder="Search Universe"
      bg="zinc800"
      borderRadius="md"
      borderColor="transparent"
      _focusVisible={{ borderColor: 'zinc600' }}
      _hover={{ borderColor: 'zinc600', bg: 'zinc900' }}
    />
    <Button bg="zinc800" color="zinc300" _hover={{ bg: 'zinc700' }}>
      <QuestionOutlineIcon boxSize={'5'} />
    </Button>
  </Flex>
)

export default Header
