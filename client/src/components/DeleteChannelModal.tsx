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
  Input,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useMessengerStore from '../store/messenger';
import { DeleteIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import useAuthStore from '../store/auth';

enum ChannelAction {
  DELETE,
  LEAVE,
  RENAME,
}

const DeleteChannelModal = (): any => {
  const [formError, setformError] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    deleteChannel,
    leaveChannel,
    renameChannel,
    setCurrentChannel,
    currentChannel,
    channels,
  } = useMessengerStore(state => state);
  const { userData } = useAuthStore(state => state);
  const [channelAction, setChannelAction] = useState<ChannelAction>(
    ChannelAction.LEAVE
  );
  const [newChannelName, setNewChannelName] = useState<string>('');

  useEffect(() => {
    setNewChannelName(currentChannel?.name ?? '');
  }, [isOpen]);

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
      userData?.userRole?.includes('administration')
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
      console.error(error);
    }
  };

  const handleLeave = async (): Promise<void> => {
    try {
      if (currentChannel) leaveChannel(currentChannel.id);
      onClose();
    } catch (error: any) {
      setformError(error);
      console.error(error);
    }
  };

  const handleRename = async (): Promise<void> => {
    try {
      if (currentChannel) {
        renameChannel(currentChannel.id, newChannelName);
        setCurrentChannel(currentChannel.id, newChannelName);
      }
      setNewChannelName('');
      onClose();
    } catch (error: any) {
      setformError(error);
      console.error(error);
    }
  };

  return (
    <>
      {checkOwner() && (
        <MenuItem
          width={'100%'}
          background="rgba(0, 0, 0, 0)"
          _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
          _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
          color="zinc300"
          as={Button}
          justifyContent={'start'}
          leftIcon={<EditIcon />}
          fontWeight={'bold'}
          fontSize={'md'}
          borderRadius={0}
          onClick={() => {
            setChannelAction(ChannelAction.RENAME);
            handleOpen();
          }}
        >
          <Text>Reanme channel</Text>
        </MenuItem>
      )}
      <MenuItem
        background="rgba(0, 0, 0, 0)"
        _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
        _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
        color="red.500"
        as={Button}
        leftIcon={<CloseIcon fontSize={'12px'} />}
        fontWeight={'bold'}
        width={'100%'}
        justifyContent={'start'}
        fontSize={'md'}
        borderRadius={0}
        onClick={() => {
          setChannelAction(ChannelAction.LEAVE);
          handleOpen();
        }}
      >
        <Text>Leave channel</Text>
      </MenuItem>
      {checkOwner() && (
        <MenuItem
          width={'100%'}
          background="rgba(0, 0, 0, 0)"
          _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
          _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
          color="red.500"
          as={Button}
          justifyContent={'start'}
          leftIcon={<DeleteIcon />}
          fontWeight={'bold'}
          fontSize={'md'}
          borderRadius={0}
          onClick={() => {
            setChannelAction(ChannelAction.DELETE);
            handleOpen();
          }}
        >
          <Text>Delete channel</Text>
        </MenuItem>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
          {channelAction === ChannelAction.DELETE ? (
            <ModalHeader>Delete current channel</ModalHeader>
          ) : channelAction === ChannelAction.LEAVE ? (
            <ModalHeader>Leave current channel</ModalHeader>
          ) : channelAction === ChannelAction.RENAME ? (
            <ModalHeader>Channel rename</ModalHeader>
          ) : (
            <></>
          )}
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              {channelAction === ChannelAction.DELETE ? (
                <FormLabel>
                  Are you sure you want to delete {currentChannel?.name}? This
                  action is IRREVERSIBLE and the channel will be PERMANENTLY
                  removed.
                </FormLabel>
              ) : channelAction === ChannelAction.LEAVE ? (
                <FormLabel>
                  Are you sure you want to leave {currentChannel?.name}?
                </FormLabel>
              ) : channelAction === ChannelAction.RENAME ? (
                <>
                  <FormLabel>Enter new channel name</FormLabel>
                  <Input
                    autoFocus={true}
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                  />
                </>
              ) : (
                <></>
              )}
            </FormControl>
            {formError && <Text color="red.500">{formError}</Text>}
          </ModalBody>
          <ModalFooter>
            {channelAction === ChannelAction.DELETE ? (
              <Button
                background="red.600"
                _hover={{ background: 'red.800' }}
                color="zinc100"
                mr={3}
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete
              </Button>
            ) : channelAction === ChannelAction.LEAVE ? (
              <Button
                background="red.600"
                _hover={{ background: 'red.800' }}
                color="zinc100"
                mr={3}
                onClick={() => {
                  handleLeave();
                }}
              >
                Leave
              </Button>
            ) : channelAction === ChannelAction.RENAME ? (
              <Button
                background="zinc700"
                _hover={{ background: 'zinc800' }}
                color="zinc300"
                mr={3}
                onClick={() => {
                  handleRename();
                }}
              >
                Save
              </Button>
            ) : (
              <></>
            )}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteChannelModal;
