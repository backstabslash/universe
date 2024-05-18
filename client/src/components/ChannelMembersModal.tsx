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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useChannelUsersStore from '../store/channelusers';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useUserStore from '../store/user';

const ChannelMembersModal = ({ users, usersCount }: any): any => {
  const axiosPrivate = useAxiosPrivate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchUserDetails, setAxiosPrivate } = useChannelUsersStore();
  const { fetchUserById, setIsUserProfileVisible } = useUserStore();
  const [userDetails, setUserDetails] = useState([]);

  const fetchAllUsers = async (): Promise<void> => {
    if (users.length) {
      const details: any = await Promise.all(
        users.map((user: any) => fetchUserDetails(user._id))
      );
      setUserDetails(details.filter(Boolean));
    }
  };

  useEffect(() => {
    setAxiosPrivate(axiosPrivate);
  }, [axiosPrivate]);

  const handleOpen = async (): Promise<void> => {
    await fetchAllUsers();
    onOpen();
  };

  const openProfileOnClick = async (userId: string): Promise<void> => {
    fetchUserById(userId);
    setIsUserProfileVisible(true);
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
        {usersCount ? `${usersCount} members` : ''}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Channel Members</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <List spacing={3}>
              {userDetails.length > 0 &&
                userDetails.map((user: any) => (
                  <ListItem key={user.userId}>
                    <Button
                      onClick={() => {
                        openProfileOnClick(user.userId);
                      }}
                    >
                      {user.name} {user.tag ? `@${user.tag}` : ''}
                    </Button>
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
