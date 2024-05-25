import { SearchIcon } from '@chakra-ui/icons';
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
  Divider,
  List,
  ListItem,
  Image,
  Spinner,
} from '@chakra-ui/react';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import useWorkspaceStore from '../store/workSpace';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import TagIcon from '@mui/icons-material/Tag';
import useAuthStore from '../store/auth';
import useUserStore from '../store/user';
import useMessengerStore from '../store/messenger';

const Header = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const axiosPrivate = useAxiosPrivate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(true);
  const [searchResults, setSearchResults] = useState<any>({
    users: [],
    channels: [],
  });
  const {
    getWorkspacePublicChannels,
    getWorkspaceUsers,
    publicChannels,
    users,
    setAxiosPrivateWorkspace,
  } = useWorkspaceStore(state => ({
    getWorkspacePublicChannels: state.getWorkspacePublicChannels,
    getWorkspaceUsers: state.getWorkspaceUsers,
    publicChannels: state.publicChannels,
    users: state.users,
    setAxiosPrivateWorkspace: state.setAxiosPrivate,
  }));
  const userData = useAuthStore(state => state.userData);
  const { fetchUserById, setIsUserProfileVisible } = useUserStore();
  const { addUserToChannel } = useMessengerStore();
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      await setAxiosPrivateWorkspace(axiosPrivate);
    };

    initialize();
  }, [setAxiosPrivateWorkspace]);

  useEffect(() => {
    const filteredUsers = users?.filter(
      (user: any) =>
        (user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.tag?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        user?._id !== userData?.userId
    );
    const filteredChannels = publicChannels?.filter((channel: any) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults({ users: filteredUsers, channels: filteredChannels });
  }, [publicChannels, users]);

  const handleSearchChange = (event: any): void => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async (): Promise<void> => {
    await getWorkspacePublicChannels();
    await getWorkspaceUsers();
    setIsDataFetched(true);
  };

  const handleChannelClick = (channel: any): void => {
    setSelectedChannel(channel);
    onConfirmOpen();
  };

  const confirmChannelClick = async (): Promise<void> => {
    if (userData?.userId && selectedChannel) {
      addUserToChannel(userData?.userId, selectedChannel);
      handleClear();
      onClose();
      onConfirmClose();
      await getWorkspacePublicChannels();
      await getWorkspaceUsers();
    }
  };

  const handleClear = (): void => {
    setSearchQuery('');
    setSearchResults({ users: [], channels: [] });
  };

  const openProfileOnClick = async (userId: string): Promise<void> => {
    await fetchUserById(userId);
    setIsUserProfileVisible(true);
  };

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
      {!isOpen ? (
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
      ) : (
        <></>
      )}
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
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setIsDataFetched(false);
                    handleSearch();
                  }
                }}
              />
              <Button
                color="zinc500"
                variant="ghost"
                _hover={{ background: 'transparent' }}
                onClick={handleClear}
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
              <CloseIcon
                fontSize="medium"
                onClick={onClose}
                cursor="pointer"
              ></CloseIcon>
            </Flex>
          </ModalHeader>
          <ModalBody maxH={'70vh'}>
            {isDataFetched ? (
              searchResults?.users?.length > 0 ||
              searchResults?.channels?.length > 0 ? (
                <List spacing={3} maxH={'70vh'} overflowY={'auto'}>
                  {searchResults.users.length > 0 && (
                    <Text fontWeight="bold" mb="2">
                      Users
                    </Text>
                  )}
                  {searchResults.users.map((user: any) => (
                    <ListItem key={user._id}>
                      <Flex
                        align="center"
                        onClick={() => {
                          openProfileOnClick(user._id);
                        }}
                        cursor="pointer"
                      >
                        <Image
                          borderRadius="full"
                          boxSize="40px"
                          src={
                            user.pfp_url || 'https://i.imgur.com/zPKzLoe.gif'
                          }
                          alt="Profile Image"
                          mr="12px"
                        />
                        <Text fontWeight="bold">{user.name}</Text>
                        <Text ml="2" color="gray.500">
                          @{user.tag}
                        </Text>
                      </Flex>
                    </ListItem>
                  ))}
                  {searchResults.channels.length > 0 && (
                    <Text fontWeight="bold" mt="4" mb="2">
                      Channels
                    </Text>
                  )}
                  {searchResults.channels.map((channel: any) => (
                    <ListItem key={channel._id}>
                      <Flex
                        align="center"
                        alignItems={'center'}
                        color="gray.500"
                        cursor="pointer"
                        onClick={() => handleChannelClick(channel)}
                      >
                        <TagIcon fontSize="small" />
                        <Text>{channel.name}</Text>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text>No results found</Text>
              )
            ) : (
              <Flex
                justifyContent="center"
                alignItems="center"
                w="100%"
                h="auto"
              >
                <Spinner size="lg" thickness="4px" speed="0.5s" />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter fontSize="sm"></ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to join this channel?</ModalBody>
          <ModalFooter>
            <Button onClick={onConfirmClose}>No</Button>
            <Button
              colorScheme="blue"
              ml={3}
              onClick={() => {
                confirmChannelClick();
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Header;
