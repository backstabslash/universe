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
  CloseButton,
  useDisclosure,
  List,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import IconButton from './IconButton';
import { useEffect, useState, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useUserStore from '../store/user';
import useAuthStore from '../store/auth';
import useMessengerStore from '../store/messenger';
import { api } from '../config/config';

const UserProfile = (): JSX.Element => {
  const axiosPrivate = useAxiosPrivate();
  const {
    userData,
    fetchUserById,
    fetchUserByEmail,
    updateUserInfo,
    setAxiosPrivate,
    setIsUserProfileVisible,
  } = useUserStore(state => ({
    userData: state.userData,
    fetchUserById: state.fetchUserById,
    fetchUserByEmail: state.fetchUserByEmail,
    updateUserInfo: state.updateUserInfo,
    error: state.error,
    setAxiosPrivate: state.setAxiosPrivate,
    isUserProfileVisible: state.isUserProfileVisible,
    setIsUserProfileVisible: state.setIsUserProfileVisible,
  }));
  const { dmsWithUsers, setCurrentChannel, createDM } = useMessengerStore(
    state => state
  );

  const { userId: authUserId } = useAuthStore(state => ({
    userId: state?.userData?.userId,
  }));

  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const getCurrentTime = (): string =>
    new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
    });

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsOwnProfile(authUserId?.toString() === userData?.userId?.toString());
  }, [userData?.userId]);

  const [error, setError] = useState('');

  useEffect(() => {
    setAxiosPrivate(axiosPrivate);
    if (userData?.userId) {
      fetchUserById(userData?.userId);
    } else {
      fetchUserByEmail();
    }
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setFormData({
        tag: '',
        name: '',
        pfp_url: '',
        phone: '',
      });
    },
  });

  const handleOpenModal = (): void => {
    setError('');
    if (userData) {
      setFormData({
        tag: userData.tag ?? '',
        name: userData.name ?? '',
        pfp_url: userData.pfp_url ?? '',
        phone: userData.phone ?? '',
      });
    }
    onOpen();
  };

  const [formData, setFormData] = useState({
    tag: '',
    name: '',
    pfp_url: '',
    phone: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        tag: userData.tag ?? '',
        name: userData.name ?? '',
        pfp_url: userData.pfp_url ?? '',
        phone: userData.phone ?? '',
      });
    }
  }, [userData]);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleOpenAlert = (role: any): void => {
    setRoleToRemove(role);
    setIsAlertOpen(true);
  };

  const handleCloseAlert = (): void => {
    setRoleToRemove(null);
    setIsAlertOpen(false);
  };

  const handleRemoveRole = async (): Promise<void> => {
    try {
      if (roleToRemove) {
        await axiosPrivate.delete(`${api.url}/user/remove-role`, {
          data: { userId: userData?.userId, roleId: roleToRemove },
        });
        await fetchUserByEmail();
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      handleCloseAlert();
    }
  };

  const handleInputChange = (e: any): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (): Promise<void> => {
    try {
      await updateUserInfo(formData);
      onClose();
      await fetchUserByEmail();
    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.message || 'Failed to update user info');
    }
  };

  const handleUserClick = async (
    userName: any,
    userId: any,
    pfpUrl: any
  ): Promise<void> => {
    if (!authUserId) return;
    const existingDM = dmsWithUsers.find(
      dm => dm.user._id === userId || dm.user._id === authUserId
    );

    if (existingDM) {
      setCurrentChannel(existingDM.channel, userName, userId);
    } else {
      createDM({
        user1Id: authUserId,
        user2Id: userId,
        userName,
        pfp_url: pfpUrl,
      });
    }
  };

  return isOwnProfile ? (
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
              setIsUserProfileVisible(false);
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
                  onClick={handleOpenModal}
                  _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
                >
                  Edit
                </Button>
              </HStack>
              <Text color="#1d9bd1">
                {userData?.tag ? `@${userData.tag}` : '@username'}
              </Text>
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
                onClick={handleOpenModal}
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
            <VStack
              width="100%"
              justifyContent="flex-start"
              alignItems={'flex-start'}
            >
              <Text fontWeight="bold">My roles</Text>
              <List spacing={3}>
                {userData?.roles?.map((role: any) => (
                  <HStack
                    key={role.id}
                    bg="blue.500"
                    color="white"
                    p={2}
                    m={1}
                    borderRadius="md"
                  >
                    <Text>{role.name}</Text>
                    {role.name !== 'administration' &&
                      role.name !== 'headman' &&
                      role.name !== 'student' &&
                      role.name !== 'worker' && (
                        <CloseButton
                          size="sm"
                          onClick={() => handleOpenAlert(role.id)}
                        />
                      )}
                  </HStack>
                ))}
              </List>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
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
          {error && (
            <Text ml="7" color="red.500">
              {error}
            </Text>
          )}
          <ModalFooter>
            <Button
              background="zinc700"
              _hover={{ background: 'zinc800' }}
              color="zinc300"
              mr={3}
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="zinc900" color="zinc200">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Role
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to remove this role?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseAlert}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleRemoveRole();
                }}
                ml={3}
              >
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  ) : (
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
              setIsUserProfileVisible(false);
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
              </HStack>
              <Text color="#1d9bd1">
                {userData?.tag ? `@${userData.tag}` : '@username'}
              </Text>
            </VStack>
            <Link color="#1d9bd1" _hover={{ color: '#23bdff' }}>
              <Button
                size="md"
                bg="zinc800"
                _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                color="zinc300"
                onClick={() => {
                  handleUserClick(
                    userData?.name,
                    userData?.userId,
                    userData?.pfp_url
                  );
                }}
              >
                Send message
              </Button>
            </Link>
            <VStack align="start" spacing={1}>
              <Text>Active</Text>
              <Text>{currentTime} local time</Text>
            </VStack>
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
              <Text fontWeight="bold">Contact in formation</Text>
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
                {userData?.email
                  ? userData.email
                  : "Email didn't load properly"}
              </Link>
            </VStack>
            {userData?.phone ? (
              <Text>{userData?.phone}</Text>
            ) : (
              <Text>{"Phone number isn't specified yet"}</Text>
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
            <VStack
              width="100%"
              justifyContent="flex-start"
              alignItems={'flex-start'}
            >
              <Text fontWeight="bold">User roles</Text>
              <List spacing={3}>
                {userData?.userRole?.map((role: any) => (
                  <HStack
                    key={role}
                    bg="blue.500"
                    color="white"
                    p={2}
                    m={1}
                    borderRadius="md"
                  >
                    <Text>{role}</Text>
                  </HStack>
                ))}
              </List>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default UserProfile;
