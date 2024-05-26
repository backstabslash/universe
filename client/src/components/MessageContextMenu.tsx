import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Box,
  Button,
  HStack,
  Modal,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

interface MessageContextMenuProps {
  mousePosition: { x: number; y: number };
  onDeleteMessage: () => void;
  onEditMessage: () => void;
  isContextMenuOpen: boolean;
  onCloseContextMenu: () => void;
}

const MessageContextMenu = ({
  mousePosition,
  onDeleteMessage,
  onEditMessage,
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
          <VStack bg="zinc900" borderRadius="md" boxShadow="md" p="2">
            <HStack
              bg="zinc900"
              _hover={{ background: 'zinc800' }}
              w={'100%'}
              borderRadius={'md'}
            >
              <Button
                leftIcon={<EditIcon />}
                onClick={() => onEditMessage()}
                color="white"
                bg="none"
                _hover={{ background: 'none' }}
                _active={{ background: 'none' }}
                alignSelf={'start'}
              >
                Edit
              </Button>
            </HStack>
            <Button
              leftIcon={<DeleteIcon color="red.500" />}
              onClick={() => {
                onCloseContextMenu();
                onOpen();
              }}
              color="red.500"
              bg="zinc900"
              _hover={{ background: 'zinc800' }}
              _active={{ background: 'zinc800' }}
              borderRadius={'md'}
              alignSelf={'start'}
            >
              Delete
            </Button>
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
              <FormLabel>
                Are you sure you want to delete message? This action is
                IRREVERSIBLE and the channel will be PERMANENTLY removed.
              </FormLabel>
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
