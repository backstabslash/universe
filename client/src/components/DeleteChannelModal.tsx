import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  ModalFooter,
  Text,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useState } from 'react';
import useMessengerStore from '../store/messenger';
import { DeleteIcon, SmallCloseIcon } from '@chakra-ui/icons';
import useUserStore from '../store/user';

const DeleteChannelModal = (): any => {
  const [formError, setformError] = useState<string>('');
  const [leaveOrDelete, setleaveOrDelete] = useState<boolean>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteChannel, leaveChannel, currentChannel, channels } =
    useMessengerStore(state => state);
  const { userData } = useUserStore(state => state);

  const handleOpen = async (): Promise<void> => {
    setformError('');
    onOpen();
  };

  const checkOwner = (): boolean => {
    const channelWithOwner = channels.find(
      channel => currentChannel?.id === channel.id
    );
    if (
      channelWithOwner?.ownerId === userData?.userId ||
      userData?.userRole === 'administration'
    ) {
      return true;
    }
    return false;
  };

  const handleDelete = async (): Promise<void> => {
    try {
      if (currentChannel) deleteChannel(currentChannel.id);
      onClose();
    } catch (error: any) {
      setformError(error);
      console.log(error);
    }
  };

  const handleLeave = async (): Promise<void> => {
    try {
      if (currentChannel) leaveChannel(currentChannel.id);
      onClose();
    } catch (error: any) {
      setformError(error);
      console.log(error);
    }
  };

  return (
    <>
      <MenuList bg="zinc800" border="none" minWidth="auto">
        <MenuItem
          w="fit-content"
          background="rgba(0, 0, 0, 0)"
          _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
          _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
          color="red.500"
          as={Button}
          leftIcon={<SmallCloseIcon />}
          fontWeight={'bold'}
          fontSize={'md'}
          borderRadius={0}
          onClick={() => {
            handleOpen();
            setleaveOrDelete(false);
          }}
        >
          <Text>Leave channel</Text>
        </MenuItem>
        {checkOwner() && (
          <MenuItem
            w="fit-content"
            background="rgba(0, 0, 0, 0)"
            _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
            _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
            color="red.500"
            as={Button}
            leftIcon={<DeleteIcon />}
            fontWeight={'bold'}
            fontSize={'md'}
            borderRadius={0}
            onClick={() => {
              handleOpen();
              setleaveOrDelete(true);
            }}
          >
            <Text>Delete channel</Text>
          </MenuItem>
        )}
      </MenuList>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
          {leaveOrDelete ? (
            <ModalHeader>Delete current channel</ModalHeader>
          ) : (
            <ModalHeader>Leave current channel</ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              {leaveOrDelete ? (
                <FormLabel>
                  Are you sure you want to delete {currentChannel?.name}? This
                  action is IRREVERSIBLE and the channel will be PERMANENTLY
                  removed.
                </FormLabel>
              ) : (
                <FormLabel>
                  Are you sure you want to leave {currentChannel?.name}?
                </FormLabel>
              )}
            </FormControl>
          </ModalBody>
          {formError && (
            <Text ml="7" color="red.500">
              {formError}
            </Text>
          )}
          <ModalFooter>
            {checkOwner() ? (
              <Button
                background="red.600"
                _hover={{ background: 'red.800' }}
                color="zinc800"
                mr={3}
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete
              </Button>
            ) : (
              <Button
                background="red.600"
                _hover={{ background: 'red.800' }}
                color="zinc800"
                mr={3}
                onClick={() => {
                  handleLeave();
                }}
              >
                Leave
              </Button>
            )}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteChannelModal;
