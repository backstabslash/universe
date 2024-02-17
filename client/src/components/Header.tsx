import { QuestionOutlineIcon, SearchIcon } from '@chakra-ui/icons'
import {
  Flex,
  Input,
  Button,
  useDisclosure,
  Text,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'

const Header = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
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
      <Button
        flex="2"
        fontSize={'sm'}
        background="rgba(0, 0, 0, 0.5)"
        borderColor="transparent"
        height="30px"
        _placeholder={{ color: 'zinc300' }}
        _focusVisible={{ borderColor: '' }}
        _hover={{ borderColor: '', background: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onOpen}
      >
        <HStack justifyContent="space-between" width="100%" color="zinc300">
          <Text>Search Universe</Text>
          <SearchIcon />
        </HStack>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay bg="transparent" />
        <ModalContent mt={1} bg="#18181b">
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Search Universe</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        alignSelf=""
        size={'sm'}
        bg="transparent"
        color="zinc300"
        _hover={{ background: 'rgba(0, 0, 0, 0.5)' }}
        _active={{ background: 'rgba(0, 0, 0, 0.5)' }}
      >
        <QuestionOutlineIcon boxSize={'5'} />
      </Button>
    </Flex>
  )
}

export default Header
