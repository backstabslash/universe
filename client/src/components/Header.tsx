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
  ModalBody,
  ModalFooter,
  Divider,
} from '@chakra-ui/react'
import CloseIcon from '@mui/icons-material/Close'

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
        <ModalContent mt={1} bg="#18181b" color="zinc300">
          <ModalHeader color="zinc500">
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Input
                placeholder="Search Universe"
                fontSize={'md'}
                background="rgba(0, 0, 0, 0.5)"
                borderColor="transparent"
                height="40px"
                width="95%"
                color="zinc300"
                _placeholder={{ color: 'zinc300' }}
                _focusVisible={{ borderColor: '' }}
                _hover={{ borderColor: '', background: 'rgba(0, 0, 0, 0.3)' }}
              />
              <Button
                color="zinc500"
                variant="ghost"
                _hover={{ background: 'transparent' }}
              >
                Clear
              </Button>
              <Divider
                orientation="vertical"
                h="20px"
                m="0"
                p="0"
                mr="8px"
                borderColor="zinc500"
              ></Divider>
              <CloseIcon fontSize="medium"></CloseIcon>
            </Flex>
          </ModalHeader>
          <ModalBody>Search options placeholder</ModalBody>
          <ModalFooter fontSize="sm">
            <Text>Not the results you expected?&nbsp;</Text>
            <Text color="#1d9bd1" as="span">
              Give feedback&nbsp;
            </Text>
            <Text>or&nbsp;</Text>
            <Text color="#1d9bd1" as="span">
              learn more
            </Text>
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
