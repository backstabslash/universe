import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  List,
  ListItem,
  useDisclosure,
  Button,
  Flex,
  Image,
  Text,
  Input,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useChannelUsersStore from '../store/channelusers';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useUserStore from '../store/user';
import useWorkSpaceStore from '../store/workSpace';
import useMessengerStore from '../store/messenger';

const ChannelMembersModal = (): any => {
  const axiosPrivate = useAxiosPrivate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    fetchUserDetails,
    setAxiosPrivate: setAxiosPrivateUser,
    addUserToChannel,
  } = useChannelUsersStore();
  const { fetchUserById, setIsUserProfileVisible } = useUserStore();
  const { currentChannel, channels } = useMessengerStore();
  const [userDetails, setUserDetails] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [currentChannelUsers, setCurrentChannelUsers] = useState<any>([]);
  const [dataFetched, setDataFetched] = useState(false);

  const {
    setAxiosPrivate: setAxiosPrivateWorkspace,
    getWorkspaceUsers,
    users: workspaceUsers,
  } = useWorkSpaceStore();

  const fetchAllUsers = async (): Promise<void> => {
    if (currentChannelUsers.length) {
      const details: any = await Promise.all(
        currentChannelUsers.map((user: any) => fetchUserDetails(user._id))
      );
      setUserDetails(details.filter(Boolean));
    }
  };

  useEffect(() => {
    const channelUsers = channels.find(
      (channel: any) => channel.id === currentChannel?.id
    )?.users;
    if (channelUsers && channelUsers.length > 0) {
      setCurrentChannelUsers(channelUsers);
    }
  }, [channels, currentChannel]);

  useEffect(() => {
    setAxiosPrivateUser(axiosPrivate);
    setAxiosPrivateWorkspace(axiosPrivate);
  }, [axiosPrivate]);

  const handleOpen = async (): Promise<void> => {
    onOpen();
    await fetchAllUsers();
    await getWorkspaceUsers();
    setDataFetched(true);
    console.log(
      channels.find((channel: any) => channel.id === currentChannel?.id)?.users
    );
  };

  const openProfileOnClick = async (userId: string): Promise<void> => {
    await fetchUserById(userId);
    setIsUserProfileVisible(true);
  };

  const handleSearchChange = (event: any): any => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const isUserInDetails = (userId: string): boolean => {
    return userDetails.some((user: any) => user.userId === userId);
  };

  const filteredUsers = searchQuery
    ? workspaceUsers?.filter(
        (user: any) =>
          (user?.name?.toLowerCase().includes(searchQuery) ||
            user?.tag?.toLowerCase()?.includes(searchQuery)) &&
          !isUserInDetails(user._id)
      )
    : [];

  const handleUserSelect = (user: any): void => {
    const isAlreadySelected = selectedUsers.some(
      (selectedUser: any) => selectedUser.userId === user.userId
    );
    if (!isAlreadySelected) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(
        selectedUsers.filter(
          (selectedUser: any) => selectedUser.userId !== user.userId
        )
      );
    }
  };

  const handleAddUsersToChannel = async (): Promise<void> => {
    try {
      await Promise.all(
        selectedUsers.map((user: any) =>
          addUserToChannel(currentChannel?.id, user._id)
        )
      );
      await fetchAllUsers();
      setCurrentChannelUsers([...selectedUsers, ...currentChannelUsers]);
      setUserDetails([...userDetails, ...selectedUsers]);
      setSelectedUsers([]);
      setSearchQuery('');
      onClose();
    } catch (error) {
      console.error('Failed to add users to channel:', error);
    }
  };

  return (
    <>
      <Button
        size="md"
        mr="2"
        bg="transparent"
        color="zinc400"
        onClick={() => {
          handleOpen();
        }}
        _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
      >
        {currentChannelUsers?.length
          ? `${currentChannelUsers?.length} members`
          : ''}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
          <ModalHeader>Channel Members</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="75vh" overflowY="auto">
            <Flex alignItems={'center'} justifyContent={'space-between'} mb="3">
              <Input
                placeholder="Search for new members"
                onChange={handleSearchChange}
                value={searchQuery}
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
                fontWeight="bold"
                variant="ghost"
                _hover={{ background: 'transparent' }}
                ml="16px"
                p="0"
                onClick={() => setSearchQuery('')}
              >
                CLEAR
              </Button>
              <Button
                color="#2EB67D"
                fontWeight="bold"
                variant="ghost"
                _hover={{ background: 'transparent' }}
                ml="16px"
                p="0"
                onClick={() => {
                  handleAddUsersToChannel();
                }}
              >
                ADD
              </Button>
            </Flex>
            <List spacing={3}>
              {filteredUsers?.map((user: any) => (
                <ListItem key={user.userId}>
                  <Flex
                    align="center"
                    cursor="pointer"
                    onClick={() => {
                      handleUserSelect(user);
                    }}
                  >
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src={user.pfp_url || 'https://i.imgur.com/zPKzLoe.gif'}
                      alt="Profile Image"
                      mr="12px"
                    />
                    <Text fontWeight="bold">
                      {user.name} {user.tag ? `@${user.tag}` : ''}
                    </Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
            <Divider
              orientation="horizontal"
              borderColor="zinc500"
              h="90%"
              m="0"
              p="0"
              mb="3"
              mt="3"
            />
            {!dataFetched ? (
              <Flex
                justifyContent="center"
                alignItems="center"
                w="100%"
                h="auto"
              >
                <Spinner size="lg" thickness="4px" speed="0.5s" />
              </Flex>
            ) : (
              <List spacing={3}>
                {selectedUsers.map((user: any) => (
                  <ListItem key={user.userId}>
                    <Flex
                      align="center"
                      cursor="pointer"
                      onClick={() => {
                        handleUserSelect(user);
                      }}
                    >
                      <Image
                        borderRadius="full"
                        boxSize="40px"
                        src={user.pfp_url || 'https://i.imgur.com/zPKzLoe.gif'}
                        alt="Profile Image"
                        mr="12px"
                      />
                      <Flex justifyContent={'space-between'} w="100%">
                        <Text fontWeight="bold">
                          {user.name} {user.tag ? `@${user.tag}` : ''}
                        </Text>
                        <Text fontWeight="bold" color="#2EB67D">
                          NEW
                        </Text>
                      </Flex>
                    </Flex>
                  </ListItem>
                ))}
                {userDetails.map((user: any) => (
                  <ListItem key={user.userId}>
                    <Flex
                      align="center"
                      cursor="pointer"
                      onClick={() => {
                        openProfileOnClick(user.userId);
                      }}
                    >
                      <Image
                        borderRadius="full"
                        boxSize="40px"
                        src={user.pfp_url || 'https://i.imgur.com/zPKzLoe.gif'}
                        alt="Profile Image"
                        mr="12px"
                      />
                      <Text fontWeight="bold">
                        {user.name} {user.tag ? `@${user.tag}` : ''}
                      </Text>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChannelMembersModal;
