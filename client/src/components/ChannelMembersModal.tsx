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
import UserRoleFilter from './UserRoleFilter';
import useChannelUsersStore from '../store/channelusers';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useUserStore from '../store/user';
import useWorkSpaceStore from '../store/workSpace';
import useMessengerStore from '../store/messenger';
import useAuthStore from '../store/auth';

const ChannelMembersModal = (): any => {
  const axiosPrivate = useAxiosPrivate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchUserDetails, setAxiosPrivate: setAxiosPrivateUser } =
    useChannelUsersStore();
  const { fetchUserById, setIsUserProfileVisible } = useUserStore();
  const { currentChannel, notesChannel, channels, addUserToChannel } =
    useMessengerStore();
  const { userData } = useAuthStore(state => state);
  const [userDetails, setUserDetails] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [currentChannelUsers, setCurrentChannelUsers] = useState<any>([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [roleFilters, setRoleFilters] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState<any>([]);

  const isStudent = userData?.userRole?.includes('student');

  const {
    setAxiosPrivate: setAxiosPrivateWorkspace,
    getWorkspaceUsers,
    users: workspaceUsers,
  } = useWorkSpaceStore();

  const fetchAllUsers = async (): Promise<void> => {
    if (currentChannelUsers.length) {
      const details: any = await Promise.all(
        currentChannelUsers.map(async (user: any) => {
          const userDetails = await fetchUserDetails(user._id);
          if (userDetails) {
            return { ...userDetails, _id: user._id };
          }
          return null;
        })
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
  };

  const openProfileOnClick = async (userId: string): Promise<void> => {
    await fetchUserById(userId);
    setIsUserProfileVisible(true);
  };

  const handleSearchChange = (event: any): any => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const isUserInDetails = (userId: string): boolean => {
    return userDetails.some((user: any) => user._id === userId);
  };

  const handleRoleFilterChange = (filters: any): void => {
    setRoleFilters(filters);
    if (filters.length > 0 && !searchQuery) {
      const usersMatchingRoles: any = workspaceUsers?.filter((user: any) =>
        filters.every((role: string) => user.userRole.includes(role))
      );
      setFilteredUsers(usersMatchingRoles);
    }
  };

  const selectAllUsers = (): void => {
    if (isStudent) {
      setSelectedUsers(
        filteredUsersList?.filter(
          (user: any) => !user.userRole.includes('administration')
        )
      );
    } else {
      setSelectedUsers(filteredUsersList);
    }
  };

  const deselectAllUsers = (): void => {
    setSelectedUsers([]);
  };

  const filteredUsersList = searchQuery
    ? workspaceUsers
        ?.filter((user: any) => {
          const matchesSearch =
            user?.name?.toLowerCase().includes(searchQuery) ||
            user?.tag?.toLowerCase()?.includes(searchQuery);
          const notInDetails = !isUserInDetails(user._id);
          const matchesRoleFilter =
            roleFilters.length === 0 ||
            roleFilters.every(role => user.userRole.includes(role));
          return matchesSearch && notInDetails && matchesRoleFilter;
        })
        .map((user: any) => ({
          ...user,
          isAdmin: user.userRole.includes('administration'),
        }))
    : roleFilters.length > 0
      ? workspaceUsers?.filter(
          (user: any) =>
            roleFilters.every(role => user.userRole.includes(role)) &&
            !currentChannelUsers.some(
              (channelUser: any) => channelUser._id === user._id
            )
        )
      : [];

  const handleUserSelect = (user: any): void => {
    if (isStudent && user.userRole.includes('administration')) {
      return;
    }
    const isAlreadySelected = selectedUsers.some(
      (selectedUser: any) => selectedUser._id === user._id
    );
    if (!isAlreadySelected) {
      setSelectedUsers([...selectedUsers, user]);
      setFilteredUsers(filteredUsers.filter((u: any) => u._id !== user._id));
    } else {
      setSelectedUsers(
        selectedUsers.filter(
          (selectedUser: any) => selectedUser._id !== user._id
        )
      );
      setFilteredUsers([...filteredUsers, user]);
    }
  };

  const handleAddUsersToChannel = async (): Promise<void> => {
    try {
      if (!currentChannel) return;

      selectedUsers.map(async (user: any) => {
        addUserToChannel(user._id);
        await new Promise(resolve => setTimeout(resolve, 1000));
      });

      await fetchAllUsers();
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
        _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
        onClick={() => {
          handleOpen();
        }}
        _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
      >
        {currentChannel?.id !== notesChannel.id && currentChannelUsers?.length
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
                color="#23bdff"
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
            <UserRoleFilter onFilterChange={handleRoleFilterChange} />
            <List spacing={3} mt="10px">
              {filteredUsersList?.map((user: any) => (
                <ListItem key={user._id}>
                  <Flex
                    align="center"
                    cursor={
                      isStudent && user.userRole.includes('administration')
                        ? 'not-allowed'
                        : 'pointer'
                    }
                    onClick={() => {
                      if (
                        !(isStudent && user.userRole.includes('administration'))
                      ) {
                        handleUserSelect(user);
                      }
                    }}
                    opacity={
                      isStudent && user.userRole.includes('administration')
                        ? 0.5
                        : 1
                    }
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
              <ListItem>
                <Button
                  color="#23bdff"
                  fontWeight="bold"
                  variant="ghost"
                  _hover={{ background: 'transparent' }}
                  m="0"
                  p="0"
                  onClick={selectAllUsers}
                >
                  SELECT ALL
                </Button>
                <Button
                  color="zinc300"
                  fontWeight="bold"
                  variant="ghost"
                  _hover={{ background: 'transparent' }}
                  ml="16px"
                  mt="0"
                  p="0"
                  onClick={deselectAllUsers}
                >
                  DESELECT ALL
                </Button>
              </ListItem>
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
                  <ListItem key={user._id}>
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
                        <Text fontWeight="bold" color="#23bdff">
                          NEW
                        </Text>
                      </Flex>
                    </Flex>
                  </ListItem>
                ))}
                {userDetails.map((user: any) => (
                  <ListItem key={user._id}>
                    <Flex
                      align="center"
                      cursor="pointer"
                      onClick={() => {
                        openProfileOnClick(user._id);
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
