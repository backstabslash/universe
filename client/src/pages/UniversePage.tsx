import useMessengerStore from '../store/messenger';
import CottageIcon from '@mui/icons-material/Cottage';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import InboxIcon from '@mui/icons-material/Inbox';
import AddMuiIcon from '@mui/icons-material/Add';
import TextEditor from '../components/TextEditor';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Button,
  Text,
  Image,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  HStack,
} from '@chakra-ui/react';
import UserProfile from '../components/UserProfile';
import { useEffect, useState } from 'react';
import orgImage from '../../public/org-placeholder.png';
import useAuthStore from '../store/auth';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/user';
import MessagesContainer from '../components/MessagesContainer';
import ChannelMembersModal from '../components/ChannelMembersModal';
import useWorkSpaceStore from '../store/workSpace';

const MainContent = (): JSX.Element => {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    ownerId: '',
    workSpaceName: '',
    pfp_url: '',
  });
  const navigate = useNavigate();
  const {
    socket,
    currentChannel,
    connectSocket,
    getChannelGroups,
    sendMessage,
    recieveMessage,
  } = useMessengerStore(state => state);

  const { logout, userData: authData } = useAuthStore(state => state);
  const { getWorkspaceData, workSpaceData, updateAvatar } = useWorkSpaceStore(
    state => state
  );

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  useEffect(() => {
    connectSocket();
    getChannelGroups();
    recieveMessage();

    return () => {
      socket?.disconnect();
    };
  }, [formData]);

  useEffect(() => {
    getWorkspaceData();
  }, [formData]);

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setFormData({
        ownerId: '',
        workSpaceName: '',
        pfp_url: '',
      });
    },
  });

  const { fetchUserById, isUserProfileVisible, setIsUserProfileVisible } =
    useUserStore(state => state);

  const handleOpenModal = (): void => {
    if (workSpaceData?.ownerId === authData?.userId) {
      setError('');
      if (workSpaceData) {
        setFormData({
          ownerId: workSpaceData.ownerId ?? '',
          workSpaceName: workSpaceData.workSpaceName ?? '',
          pfp_url: workSpaceData.pfp_url ?? '',
        });
      }
      onOpen();
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
      await updateAvatar(formData);
      console.log(1234);

      onClose();
    } catch (error: any) {
      console.log(error);
      setError(error?.response?.data?.message || 'Failed to update user info');
    }
  };

  const openProfileOnClick = async (userId?: string): Promise<void> => {
    if (userId) await fetchUserById(userId);
    setIsUserProfileVisible(true);
  };

  return (
    <Flex flexDirection={'column'} alignItems={'center'}>
      <Header />
      <Flex>
        <Flex
          w="70px"
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'space-between'}
          color={'zinc300'}
        >
          <Flex pt="15px" pl="4px" flexDirection={'column'} gap="10px">
            <Button
              p="1"
              color={'zinc300'}
              bg="transparent"
              _hover={{ background: 'transparent' }}
              _active={{ background: 'transparent' }}
              onClick={handleOpenModal}
            >
              <Image
                w="50px"
                h="50px"
                src={workSpaceData?.pfp_url ?? orgImage}
                alt="Organization banner"
                alignSelf="center"
                borderRadius="10px"
              />
            </Button>
            <Flex
              mt="20px"
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Button
                p="1"
                color={'zinc300'}
                bg="rgba(0, 0, 0, 0.3)"
                _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
                _active={{ background: 'rgba(0, 0, 0, 0.2)' }}
              >
                <CottageIcon fontSize="medium" />
              </Button>
              <Text fontSize={'xs'}>Home</Text>
            </Flex>
            <Flex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Button
                p="1"
                color={'zinc300'}
                bg="transparent"
                _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
                _active={{ background: 'rgba(0, 0, 0, 0.2)' }}
              >
                <InboxIcon fontSize="medium" />
              </Button>
              <Text fontSize={'xs'}>Activity</Text>
            </Flex>
            <Flex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Button
                p="1"
                color={'zinc300'}
                bg="transparent"
                _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
                _active={{ background: 'rgba(0, 0, 0, 0.2)' }}
              >
                <BookmarkIcon fontSize="medium" />
              </Button>
              <Text fontSize={'xs'}>Later</Text>
            </Flex>
          </Flex>
          <Flex pb="15px" pl="4px" flexDirection={'column'} gap="10px">
            <Button
              padding={'1px'}
              color={'zinc300'}
              background={'rgba(0,0,0,0.3)'}
              _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
              _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
              onClick={() => {
                handleLogout();
              }}
            >
              <AddMuiIcon fontSize="medium" />
            </Button>
            <Button
              p="1px"
              color={'zinc300'}
              bg="rgba(33,35,38,1)"
              _hover={{ background: 'rgba(0, 0, 0, 0)' }}
              _active={{ background: 'rgba(0, 0, 0, 0)' }}
              onClick={() => {
                fetchUserById(authData?.userId ?? '');
                setIsUserProfileVisible(true);
              }}
            >
              <Image
                w="50px"
                h="50px"
                src={
                  authData?.pfp_url
                    ? authData.pfp_url
                    : 'https://i.imgur.com/zPKzLoe.gif'
                }
                alt="Profile banner"
                alignSelf="center"
                borderRadius="10px"
              />
            </Button>
          </Flex>
        </Flex>
        <Box
          flexDirection="column"
          w="calc(100vw - 78px)"
          m="1"
          borderRadius="10px"
          overflow="hidden"
        >
          <Flex>
            <Sidebar />
            <Box
              w="calc(100vw - 8px)"
              h="calc(100vh - 42px)"
              color="zinc300"
              flex="6"
            >
              <Flex
                fontSize="lg"
                width="100%"
                background="rgba(0, 0, 0, 0.5)"
                borderBottom="1px"
                borderColor="rgba(29, 29, 32, 1)"
                p="15px"
                h="60px"
                alignItems="center"
                justifyContent="space-between"
              >
                {!currentChannel?.user?._id ? (
                  <>
                    <Text fontWeight={'bold'}>
                      {currentChannel && `#${currentChannel?.name}`}
                    </Text>
                    <Flex>
                      <ChannelMembersModal />
                      <Button
                        size="md"
                        mr="2"
                        bg="transparent"
                        color="zinc200"
                        _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
                      >
                        <EditIcon boxSize={'4'} /> &nbsp; Canvas
                      </Button>
                    </Flex>
                  </>
                ) : (
                  <HStack
                    alignContent={'start'}
                    justifyContent="flex-start"
                    width="100%"
                  >
                    <Button
                      fontWeight={'bold'}
                      fontSize={'lg'}
                      color="zinc300"
                      bg="transparent"
                      _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
                      padding={'0'}
                      onClick={() => {
                        openProfileOnClick(currentChannel?.user?._id);
                      }}
                    >
                      {currentChannel && `#${currentChannel?.name}`}
                    </Button>
                  </HStack>
                )}
              </Flex>
              <MessagesContainer />
              <Flex
                background="rgba(0, 0, 0, 0.5)"
                pr="4"
                pl="4"
                pb="4"
                h="170px"
                width="100%"
              >
                <TextEditor sendMessage={sendMessage} />
              </Flex>
            </Box>
            {isUserProfileVisible && <UserProfile />}
          </Flex>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="zinc900" color="zinc200">
            <ModalHeader>Edit workspace image</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mt={4}>
                <FormLabel>Profile Picture URL</FormLabel>
                <Input
                  name="pfp_url"
                  value={formData.pfp_url}
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
      </Flex>
    </Flex>
  );
};

export default MainContent;
