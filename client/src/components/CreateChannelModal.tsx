import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Button,
  Input,
  FormControl,
  FormLabel,
  ModalFooter,
  Checkbox,
  Text,
  Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import useMessengerStore from '../store/messenger';

const CreateChannelModal = (): any => {
  const [formData, setFormData] = useState({
    name: '',
    private: false,
    readonly: false,
  });
  const [formError, setformError] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setFormData({
        name: '',
        private: false,
        readonly: false,
      });
    },
  });
  const { createChannel } = useMessengerStore(state => state);

  const handleOpen = async (): Promise<void> => {
    setformError('');
    onOpen();
  };

  const handleInputChange = (e: any): void => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (): Promise<void> => {
    try {
      createChannel(formData);
      onClose();
    } catch (error: any) {
      setformError(error);
      console.error(error);
    }
  };

  return (
    <>
      <Button
        size="md"
        mr="2"
        bg="transparent"
        color="zinc300"
        onClick={() => {
          handleOpen();
        }}
        _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
      >
        Create channel
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
          <ModalHeader>Create new channel</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Channel name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <Flex width="60%">
              <FormControl mt={4}>
                <Checkbox
                  name="private"
                  isChecked={formData.private}
                  onChange={handleInputChange}
                  colorScheme="gray"
                >
                  Private
                </Checkbox>
              </FormControl>
              <FormControl mt={4}>
                <Checkbox
                  name="readonly"
                  isChecked={formData.readonly}
                  onChange={handleInputChange}
                  colorScheme="gray"
                >
                  Read-only
                </Checkbox>
              </FormControl>
            </Flex>
          </ModalBody>
          {formError && (
            <Text ml="7" color="red.500">
              {formError}
            </Text>
          )}
          <ModalFooter justifyContent={'flex-start'} pt="0">
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
    </>
  );
};

export default CreateChannelModal;
