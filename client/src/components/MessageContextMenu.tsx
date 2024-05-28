import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Bookmark } from '@mui/icons-material';
import {
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

interface MessageContextMenuProps {
  mousePosition: { x: number; y: number };
  onDeleteMessage: () => void;
  isDeleteEnabled: boolean;
  onEditMessage: () => void;
  isEditEnabled: boolean;
  onSendToNotes: () => void;
  isSendToNotesEnabled: boolean;
  isContextMenuOpen: boolean;
  onCloseContextMenu: () => void;
}

const MessageContextMenu = ({
  mousePosition,
  onDeleteMessage,
  isDeleteEnabled,
  onEditMessage,
  isEditEnabled,
  onSendToNotes,
  isSendToNotesEnabled,
  isContextMenuOpen,
  onCloseContextMenu,
}: MessageContextMenuProps): JSX.Element => {
  const { onClose, onOpen, isOpen } = useDisclosure();

  return (
    <>
      {isContextMenuOpen && (
        <Box
          position="fixed"
          top={`${mousePosition?.y}px`}
          left={`${mousePosition?.x}px`}
          zIndex="tooltip"
        >
          <VStack bg="zinc900" borderRadius="md" boxShadow="md" p={2}>
            {isSendToNotesEnabled && (
              <Button
                leftIcon={<Bookmark />}
                onClick={() => onSendToNotes()}
                color="white"
                bg="none"
                pl={'11px'}
                _hover={{ background: 'zinc800' }}
                _active={{ background: 'zinc800' }}
                w={'100%'}
                justifyContent={'start'}
              >
                Save
              </Button>
            )}
            {isEditEnabled && (
              <Button
                leftIcon={<EditIcon />}
                onClick={() => onEditMessage()}
                color="white"
                bg="none"
                _hover={{ background: 'zinc800' }}
                _active={{ background: 'zinc800' }}
                w={'100%'}
                justifyContent={'start'}
              >
                Edit
              </Button>
            )}

            {isDeleteEnabled && (
              <Button
                leftIcon={<DeleteIcon color="red.500" />}
                onClick={() => {
                  onCloseContextMenu();
                  onOpen();
                }}
                color="red.500"
                bg="none"
                _hover={{ background: 'zinc800' }}
                _active={{ background: 'zinc800' }}
                w={'100%'}
                justifyContent={'start'}
              >
                Delete
              </Button>
            )}
          </VStack>
        </Box>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
          <ModalHeader>Delete message</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Are you sure you want to delete message?</FormLabel>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              background="red.600"
              _hover={{ background: 'red.800' }}
              color="zinc100"
              mr={3}
              onClick={() => {
                onDeleteMessage();
                onClose();
              }}
            >
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MessageContextMenu;
