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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import IconButton from './IconButton';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useUserStore from '../store/user';

interface UserProfileProps {
  setisUserProfileVisible: (visible: boolean) => void;
}

const UserProfile = ({
  setisUserProfileVisible,
}: UserProfileProps): JSX.Element => {
  const axiosPrivate = useAxiosPrivate();
  const { userData, fetchUserByEmail, updateUserInfo, setAxiosPrivate } =
    useUserStore(state => ({
      userData: state.userData,
      fetchUserByEmail: state.fetchUserByEmail,
      updateUserInfo: state.updateUserInfo,
      error: state.error,
      setAxiosPrivate: state.setAxiosPrivate,
    }));

  useEffect(() => {
    setAxiosPrivate(axiosPrivate);
    fetchUserByEmail();
  }, [axiosPrivate]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    tag: '',
    name: '',
    pfp_url: '',
    phone: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        tag: userData.tag || '',
        name: userData.name || '',
        pfp_url: userData.pfp_url || '',
        phone: userData.phone || '',
      });
    }
  }, [userData]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log('formData', formData);
    updateUserInfo(formData);
    onClose();
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <Flex flexDirection={'column'} flex="3">
      <Heading
        background="rgba(0, 0, 0, 0.5)"
        color="zinc300"
        fontSize="xl"
        borderBottom="1px"
        borderLeft={'1px'}
        borderColor="rgba(29, 29, 32, 1)"
        p="15px"
        pt="18px"
        h="60px"
      >
        <Flex justifyContent="space-between" alignItems={'center'}>
          <b>Profile</b>
          <IconButton
            label={<CloseIcon boxSize={'3'} />}
            onClick={() => {
              setisUserProfileVisible(false);
            }}
          />
        </Flex>
      </Heading>
      <VStack
        background="rgba(0, 0, 0, 0.5)"
        color="zinc300"
        h="calc(100vh - 102px)"
        borderLeft="1px"
        borderColor="rgba(29, 29, 32, 1)"
        overflowY="auto"
      >
        <VStack width="100%">
          <Image
            w="260"
            mt="2"
            h="260"
            src={
              userData?.pfp_url
                ? userData.pfp_url
                : 'https://i.imgur.com/zPKzLoe.gif'
            }
            alt="Profile banner"
            alignSelf="center"
            borderRadius="10px"
          />
          <VStack
            width="100%"
            align="start"
            borderBottom="1px"
            borderColor="rgba(29, 29, 32, 1)"
            spacing={4}
            pr="15px"
            pl="15px"
            pb="14px"
          >
            <VStack width="100%" align="start" spacing={1}>
              <HStack width="100%" justifyContent="space-between">
                <Text fontSize="xl" fontWeight="bold">
                  {userData?.name ? userData.name : 'Name'}
                </Text>
                <Button
                  size="md"
                  fontSize={'sm'}
                  bg="transparent"
                  color="#23bdff"
                  onClick={onOpen}
                  _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
                >
                  Edit
                </Button>
              </HStack>
              <Text> {userData?.tag ? userData.tag : 'username'}</Text>
              <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
                <Button
                  size="md"
                  bg="zinc800"
                  _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                  color="zinc300"
                >
                  <AddIcon fontSize="13px" /> &nbsp; Add name pronunciation
                </Button>
              </Link>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text>Active</Text>
              <Text>{currentTime} local time</Text>
            </VStack>
            <HStack width="100%">
              <Button
                flex={1}
                bg="zinc800"
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
                    bg="zinc800"
                    color="zinc300"
                    _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                    _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
                  >
                    View as
                  </MenuButton>
                  <MenuList bg="zinc800" border="none">
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
                    bg="zinc800"
                    _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
                    _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                  >
                    ⋮
                  </MenuButton>
                  <MenuList bg="zinc800" border="none">
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
            borderColor="rgba(29, 29, 32, 1)"
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
                onClick={onOpen}
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
                {userData?.email ? userData.email : 'Email didnt load properly'}
              </Link>
            </VStack>
            {userData?.phone ? (
              <Text>{userData?.phone}</Text>
            ) : (
              <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
                <Button
                  size="md"
                  bg="zinc800"
                  _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                  color="zinc300"
                >
                  <AddIcon fontSize="13px" /> &nbsp; Add phone
                </Button>
              </Link>
            )}
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
                onClick={onOpen}
                _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
              >
                Edit
              </Button>
            </HStack>
            <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
              <Button
                size="md"
                bg="zinc800"
                _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                color="zinc300"
                onClick={onOpen}
              >
                <AddIcon fontSize="13px" /> &nbsp; Add start date
              </Button>
            </Link>
          </VStack>
        </VStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Your Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Tag</FormLabel>
              <Input
                name="tag"
                value={formData.tag}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Profile Picture URL</FormLabel>
              <Input
                name="pfp_url"
                value={formData.pfp_url}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default UserProfile;
