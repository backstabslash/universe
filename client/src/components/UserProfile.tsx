import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Link,
  Heading,
  Flex,
  Icon,
} from '@chakra-ui/react'
import { CloseIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { AiOutlineEdit } from 'react-icons/ai'
import IconButton from './IconButton'
import profileImage from '../../public/profile-image-test.png'

interface UserProfileProps {
  setisUserProfileVisible: (visible: boolean) => void
}

const UserProfile = ({
  setisUserProfileVisible,
}: UserProfileProps): JSX.Element => (
  <VStack
    background="rgba(0, 0, 0, 0.6)"
    color="zinc300"
    width="700px"
    h="calc(100vh - 42px)"
    borderLeft="1px"
    borderColor="rgba(20, 29, 64, 1)"
    overflowY="auto"
  >
    <Heading
      mb="2"
      fontSize="xl"
      width="100%"
      borderBottom="1px"
      borderColor="rgba(20, 29, 64, 1)"
      p="15px"
      pt="18px"
      h="60px"
    >
      <Flex justifyContent="space-between">
        <b>My profile</b>
        <IconButton
          label={<CloseIcon boxSize={'3'} />}
          onClick={() => {
            setisUserProfileVisible(false)
          }}
        />
      </Flex>
    </Heading>
    <VStack width="100%">
      <Image
        w="260"
        h="260"
        src={profileImage}
        alt="Profile banner"
        alignSelf="center"
        borderRadius="10px"
      />
      <VStack
        width="100%"
        align="start"
        borderBottom="1px"
        borderColor="rgba(20, 29, 64, 1)"
        spacing={4}
        pr="15px"
        pl="15px"
        pb="14px"
      >
        <VStack width="100%" align="start" spacing={1}>
          <HStack width="100%" justifyContent="space-between">
            <Text fontSize="xl" fontWeight="bold">
              sherpak /
            </Text>
            <Button
              size="md"
              bg="transparent"
              color="zinc300"
              _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
            >
              <Icon as={AiOutlineEdit} /> &nbsp; Edit
            </Button>
          </HStack>
          <Text>Alias</Text>
          <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
            <Button
              size="md"
              background="rgba(0, 0, 0, 0.2)"
              _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
              color="zinc300"
            >
              <AddIcon fontSize="13px" /> &nbsp; Add name pronunciation
            </Button>
          </Link>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text>Active</Text>
          <Text>3:02 PM local time</Text>
        </VStack>
        <HStack width="100%">
          <Button
            flex={1}
            background="rgba(0, 0, 0, 0.2)"
            _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
            color="zinc300"
            _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
          >
            Set a status
          </Button>
          <Box flex={1}>
            <Menu placement="bottom-end">
              <MenuButton
                width="100%"
                as={Button}
                rightIcon={<ChevronDownIcon />}
                background="rgba(0, 0, 0, 0.2)"
                color="zinc300"
                _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
              >
                View as
              </MenuButton>
              <MenuList bg="#1D212E" border="none">
                <MenuItem
                  background="rgba(0, 0, 0, 0)"
                  color="zinc300"
                  _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                >
                  A coworker at Universe
                </MenuItem>
                <MenuItem
                  background="rgba(0, 0, 0, 0)"
                  color="zinc300"
                  _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                >
                  A contact from other organizations
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
          <Box>
            <Menu placement="bottom-end">
              <MenuButton
                width="100%"
                as={Button}
                color="zinc300"
                background="rgba(0, 0, 0, 0.2)"
                _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
                _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
              >
                ⋮
              </MenuButton>
              <MenuList bg="#1D212E" border="none">
                <MenuItem
                  background="rgba(0, 0, 0, 0)"
                  color="zinc300"
                  _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                >
                  A coworker at Universe
                </MenuItem>
                <MenuItem
                  background="rgba(0, 0, 0, 0)"
                  color="zinc300"
                  _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                >
                  A contact from other organizations
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      </VStack>
      <VStack
        width="100%"
        align="start"
        borderBottom="1px"
        borderColor="rgba(20, 29, 64, 1)"
        spacing={4}
        pr="15px"
        pl="15px"
        pb="14px"
      >
        <HStack width="100%" justifyContent="space-between">
          <Text fontWeight="bold">Contact information</Text>
          <Button
            size="md"
            bg="transparent"
            color="zinc300"
            _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
          >
            <Icon as={AiOutlineEdit} /> &nbsp; Edit
          </Button>
        </HStack>
        <VStack align="start" spacing={1}>
          <Text fontSize="small" color="#9e9fa1">
            Email address
          </Text>
          <Link
            color="#1d9bd1"
            _hover={{
              color: '#23bdff',
              textDecoration: 'underline',
            }}
          >
            vladislav.rupets@gmail.com
          </Link>
        </VStack>
        <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
          <Button
            size="md"
            background="rgba(0, 0, 0, 0.2)"
            _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
            color="zinc300"
          >
            <AddIcon fontSize="13px" /> &nbsp; Add phone
          </Button>
        </Link>
      </VStack>
      <VStack
        width="100%"
        align="start"
        spacing={4}
        pr="15px"
        pl="15px"
        pb="14px"
      >
        <HStack width="100%" justifyContent="space-between">
          <Text fontWeight="bold">About me</Text>
          <Button
            size="md"
            bg="transparent"
            color="zinc300"
            _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
          >
            <Icon as={AiOutlineEdit} /> &nbsp; Edit
          </Button>
        </HStack>
        <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
          <Button
            size="md"
            background="rgba(0, 0, 0, 0.2)"
            _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
            color="zinc300"
          >
            <AddIcon fontSize="13px" /> &nbsp; Add start date
          </Button>
        </Link>
      </VStack>
    </VStack>
  </VStack>
)

export default UserProfile
