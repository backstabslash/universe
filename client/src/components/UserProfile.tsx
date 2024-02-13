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
} from '@chakra-ui/react'
import { CloseIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import IconButton from './IconButton'
import profileImage from '../../public/profile-image-test.png'

interface UserProfileProps {
  setisUserProfileVisible: (visible: boolean) => void
}

const UserProfile = ({
  setisUserProfileVisible,
}: UserProfileProps): JSX.Element => (
  <Flex flexDirection={'column'} flex="3">
    <Heading
      background="rgba(0, 0, 0, 0.6)"
      color="zinc300"
      fontSize="xl"
      borderBottom="1px"
      borderLeft={'1px'}
      borderColor="rgba(27, 28, 31, 1)"
      p="15px"
      pt="18px"
      h="60px"
    >
      <Flex justifyContent="space-between" alignItems={'center'}>
        <b>Profile</b>
        <IconButton
          label={<CloseIcon boxSize={'3'} />}
          onClick={() => {
            setisUserProfileVisible(false)
          }}
        />
      </Flex>
    </Heading>
    <VStack
      background="rgba(0, 0, 0, 0.6)"
      color="zinc300"
      h="calc(100vh - 102px)"
      borderLeft="1px"
      borderColor="rgba(27, 28, 31, 1)"
      overflowY="auto"
    >
      <VStack width="100%">
        <Image
          w="260"
          mt="2"
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
          borderColor="rgba(27, 28, 31, 1)"
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
                fontSize={'sm'}
                bg="transparent"
                color="#23bdff"
                _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
              >
                Edit
              </Button>
            </HStack>
            <Text>Alias</Text>
            <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
              <Button
                size="md"
                bg="rgba(33,35,38,1)"
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
              bg="rgba(33,35,38,1)"
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
                  bg="rgba(33,35,38,1)"
                  color="zinc300"
                  _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                  _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
                >
                  View as
                </MenuButton>
                <MenuList bg="rgba(33,35,38,1)" border="none">
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
                  bg="rgba(33,35,38,1)"
                  _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
                  _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                >
                  ⋮
                </MenuButton>
                <MenuList bg="rgba(33,35,38,1)" border="none">
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
          borderColor="rgba(27, 28, 31, 1)"
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
              fontSize={'sm'}
              color="#23bdff"
              _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
            >
              Edit
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
              bg="rgba(33,35,38,1)"
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
              color="#23bdff"
              fontSize={'sm'}
              _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
            >
              Edit
            </Button>
          </HStack>
          <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
            <Button
              size="md"
              bg="rgba(33,35,38,1)"
              _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
              color="zinc300"
            >
              <AddIcon fontSize="13px" /> &nbsp; Add start date
            </Button>
          </Link>
        </VStack>
      </VStack>
    </VStack>
  </Flex>
)

export default UserProfile
