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
  Spacer,
  Heading,
  Flex,
} from '@chakra-ui/react'
import { CloseIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import IconButton from './IconButton'
import profileImage from '../../public/profile-image-test.png'

const UserProfile = (): JSX.Element => (
  <VStack
    background="rgba(0, 0, 0, 0.6)"
    color="zinc300"
    width="600px"
    h="calc(100vh - 46px)"
    borderLeft="1px"
    borderColor="zinc600"
    overflowY="auto"
  >
    <Heading
      mb="2"
      fontSize="xl"
      width="100%"
      borderBottom="1px"
      borderColor="zinc600"
      p="15px"
      pt="18px"
      h="60px"
    >
      <Flex justifyContent="space-between">
        <b>My profile</b>
        <IconButton label={<CloseIcon boxSize={'3'} />} />
      </Flex>
    </Heading>
    <VStack align="start">
      <Image
        src={profileImage}
        alt="Profile banner"
        alignSelf="center"
        borderRadius="10px"
      />
      <VStack
        width="100%"
        align="start"
        borderBottom="1px solid #57595d"
        spacing={4}
        p={3}
      >
        <VStack width="100%" align="start" spacing={1}>
          <HStack width="100%">
            <Text fontSize="2xl" fontWeight="bold">
              sherpak /
            </Text>
            <Spacer />
            <Link
              color="#1d9bd1"
              _hover={{
                color: '#23bdff',
                textDecoration: 'underline',
              }}
            >
              Edit
            </Link>
          </HStack>
          <Text>Мальчик like чел</Text>
          <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
            <HStack>
              <AddIcon fontSize="small" />
              <Text>Add name pronunciation</Text>
            </HStack>
          </Link>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text>Active</Text>
          <Text>3:02 PM local time</Text>
        </VStack>
        <HStack width="100%">
          <Button
            flex={1}
            backgroundColor="#1a1d21"
            color="white"
            border="1px solid #57595d"
            _hover={{ backgroundColor: '#2a2d31' }}
            _active={{ borderColor: '#cccccc' }}
          >
            Set a status
          </Button>
          <Box flex={1}>
            <Menu placement="bottom-end">
              <MenuButton
                width="100%"
                as={Button}
                rightIcon={<ChevronDownIcon />}
                backgroundColor="#1a1d21"
                color="white"
                border="1px solid #57595d"
                _hover={{ backgroundColor: '#2a2d31' }}
                _active={{ borderColor: '#cccccc' }}
              >
                View as
              </MenuButton>
              <MenuList backgroundColor="#222529">
                <MenuItem
                  backgroundColor="#222529"
                  _hover={{ backgroundColor: '#1264a3' }}
                >
                  A coworker at Universe
                </MenuItem>
                <MenuItem
                  backgroundColor="#222529"
                  _hover={{ backgroundColor: '#1264a3' }}
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
                backgroundColor="#1a1d21"
                color="white"
                border="1px solid #57595d"
                _hover={{ backgroundColor: '#2a2d31' }}
                _active={{ borderColor: '#cccccc' }}
              >
                ⋮
              </MenuButton>
              <MenuList backgroundColor="#222529">
                <MenuItem
                  backgroundColor="#222529"
                  _hover={{ backgroundColor: '#1264a3' }}
                >
                  A coworker at Universe
                </MenuItem>
                <MenuItem
                  backgroundColor="#222529"
                  _hover={{ backgroundColor: '#1264a3' }}
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
        borderBottom="1px solid #57595d"
        spacing={4}
        p={3}
      >
        <HStack width="100%" justifyContent="space-between">
          <Text fontWeight="bold">Contact information</Text>
          <Link
            color="#1d9bd1"
            _hover={{
              color: '#23bdff',
              textDecoration: 'underline',
            }}
          >
            Edit
          </Link>
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
          <HStack>
            <AddIcon fontSize="small" />
            <Text>Add phone</Text>
          </HStack>
        </Link>
      </VStack>
      <VStack width="100%" align="start" spacing={4} p={3}>
        <HStack width="100%" justifyContent="space-between">
          <Text fontWeight="bold">About me</Text>
          <Link
            color="#1d9bd1"
            _hover={{
              color: '#23bdff',
              textDecoration: 'underline',
            }}
          >
            Edit
          </Link>
        </HStack>
        <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
          <HStack>
            <AddIcon fontSize="small" />
            <Text>Add start date</Text>
          </HStack>
        </Link>
      </VStack>
    </VStack>
  </VStack>
)

export default UserProfile
