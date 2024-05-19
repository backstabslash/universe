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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useChannelUsersStore from '../store/channelusers';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useUserStore from '../store/user';
import useWorkSpaceStore from '../store/workSpace';

const ChannelMembersModal = ({ users, usersCount }: any): any => {
  const axiosPrivate = useAxiosPrivate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchUserDetails, setAxiosPrivate: setAxiosPrivateUser } =
    useChannelUsersStore();
  const { fetchUserById, setIsUserProfileVisible } = useUserStore();
  const [userDetails, setUserDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    setAxiosPrivate: setAxiosPrivateWorkspace,
    getWorkspaceUsers,
    users: workspaceUsers,
  } = useWorkSpaceStore();

  const fetchAllUsers = async (): Promise<void> => {
    if (users.length) {
      const details: any = await Promise.all(
        users.map((user: any) => fetchUserDetails(user._id))
      );
      setUserDetails(details.filter(Boolean));
    }
  };

  useEffect(() => {
    setAxiosPrivateUser(axiosPrivate);
    setAxiosPrivateWorkspace(axiosPrivate);
  }, [axiosPrivate]);

  const handleOpen = async (): Promise<void> => {
    await fetchAllUsers();
    await getWorkspaceUsers();
    onOpen();
  };

  const openProfileOnClick = async (userId: string): Promise<void> => {
    await fetchUserById(userId);
    setIsUserProfileVisible(true);
  };

  const handleSearchChange = (event: any): any => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredUsers = workspaceUsers?.filter(
    (user: any) =>
      user?.name?.toLowerCase().includes(searchQuery) ||
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      (user?.tag && user?.tag?.toLowerCase().includes(searchQuery))
  );

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
        {usersCount ? `${usersCount} members` : ''}
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
                ml="16px"
                p="0"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </Button>
            </Flex>
            <List spacing={3}>
              {filteredUsers?.map((user: any) => (
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
            <Divider
              orientation="horizontal"
              h="90%"
              m="0"
              p="0"
              mb="3"
              mt="3"
            />
            <List spacing={3}>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChannelMembersModal;
