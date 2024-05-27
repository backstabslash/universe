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
  Text,
  List,
  ListItem,
  HStack,
  CloseButton,
  Flex,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import useWorkSpaceStore from '../store/workSpace';

const CreateRoleModal = (): any => {
  const [formData, setFormData] = useState<{ roles: string[] }>({ roles: [] });
  const [formError, setFormError] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setFormData({ roles: [] });
      setNewRole('');
      setSuggestions([]);
    },
  });
  const { addWorkSpaceRoles, getAllWorkSpaceRoles, workSpaceData } =
    useWorkSpaceStore(state => state);

  useEffect(() => {
    if (workSpaceData?.workSpaceName) {
      getAllRoles();
    }
  }, [workSpaceData?.workSpaceName]);

  const getAllRoles = async (): Promise<void> => {
    if (workSpaceData?.workSpaceName) {
      const allRoles = await getAllWorkSpaceRoles(workSpaceData.workSpaceName);
      const roleNames = allRoles.map(role => role.name);

      setAvailableRoles(roleNames);
    }
  };

  const handleOpen = async (): Promise<void> => {
    setFormError('');
    onOpen();
  };

  const handleInputChange = (e: any): void => {
    const { value } = e.target;
    setNewRole(value);

    if (value) {
      const filteredSuggestions = availableRoles.filter(
        (role: string) =>
          role.toLowerCase().includes(value.toLowerCase()) &&
          !formData.roles.includes(role)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: any): void => {
    if (e.key === 'Enter' && newRole) {
      addRole(newRole);
    }
  };

  const addRole = (role: string): void => {
    if (role && !formData.roles.includes(role)) {
      setFormData(prev => ({
        roles: [...prev.roles, role],
      }));
      setNewRole('');
      setSuggestions([]);
    }
  };

  const removeRole = (roleToRemove: string): void => {
    setFormData(prev => ({
      roles: prev.roles.filter(role => role !== roleToRemove),
    }));
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (workSpaceData?.workSpaceName) {
        await addWorkSpaceRoles(workSpaceData.workSpaceName, formData.roles);
      }
      onClose();
    } catch (error: any) {
      setFormError(error.message || 'An error occurred');
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
        w={'100%'}
        justifyContent={'start'}
      >
        Create user role
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
          <ModalHeader>Create new role</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Role name</FormLabel>
              <Input
                name="role"
                value={newRole}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type and press Enter"
              />
            </FormControl>
            {suggestions.length > 0 && (
              <List
                background="rgba(0, 0, 0, 0.3)"
                borderRadius="md"
                p={2}
                mb={4}
              >
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index} p={2}>
                    {suggestion}
                  </ListItem>
                ))}
              </List>
            )}
            <Flex wrap="wrap">
              {formData.roles.map((role, index) => (
                <HStack
                  key={index}
                  bg="blue.500"
                  color="white"
                  p={2}
                  m={1}
                  borderRadius="md"
                >
                  <Text>{role}</Text>
                  <CloseButton size="sm" onClick={() => removeRole(role)} />
                </HStack>
              ))}
            </Flex>
            {formError && <Text color="red.500">{formError}</Text>}
          </ModalBody>
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

export default CreateRoleModal;
