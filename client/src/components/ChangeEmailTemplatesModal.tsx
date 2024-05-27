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
import { useEffect, useState } from 'react';
import Joi from 'joi';
import useWorkSpaceStore from '../store/workSpace';

const emailRules = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .trim()
  .messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
  });

const ChangeEmailTemplatesModal = (): any => {
  const [formData, setFormData] = useState<{ emailTemplates: string[] }>({
    emailTemplates: [],
  });
  const [formError, setFormError] = useState<string>('');
  const [newEmailTemplate, setNewEmailTemplate] = useState<string>('');
  const [newEmailTemplates, setNewEmailTemplates] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [availableEmailTemplates, setAvailableEmailTemplates] = useState<
    string[]
  >([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { changeWorkSpaceEmailTemplates, workSpaceData, getWorkspaceData } =
    useWorkSpaceStore(state => state);

  const getAllEmailTemplates = async (): Promise<void> => {
    await getWorkspaceData();
  };

  useEffect(() => {
    if (workSpaceData?.emailTemplates) {
      setAvailableEmailTemplates(workSpaceData.emailTemplates);
    }
  }, [workSpaceData?.emailTemplates]);

  const handleOpen = async (): Promise<void> => {
    setFormError('');
    await getAllEmailTemplates();
    setFormData({ emailTemplates: workSpaceData?.emailTemplates ?? [] });
    setNewEmailTemplates([]);
    setNewEmailTemplate('');
    setSuggestions([]);
    onOpen();
  };

  const handleInputChange = (e: any): void => {
    const { value } = e.target;
    setNewEmailTemplate(value);

    if (value) {
      const validationResult = emailRules.validate(value);
      if (validationResult.error) {
        setSuggestions([]);
        return;
      }
      setFormError('');

      const filteredSuggestions = availableEmailTemplates.filter(
        (template: string) =>
          template
            .toLowerCase()
            .includes('@' + value.toLowerCase().split('@')[1]) &&
          !formData.emailTemplates.includes(template)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: any): void => {
    if (e.key === 'Enter' && newEmailTemplate) {
      addEmailTemplate('@' + newEmailTemplate.split('@')[1]);
    }
  };

  const addEmailTemplate = (template: string): void => {
    if (
      template &&
      !formData.emailTemplates.includes(template) &&
      !newEmailTemplates.includes(template)
    ) {
      setNewEmailTemplates(prev => [...prev, template]);
      setFormData(prev => ({
        emailTemplates: [...prev.emailTemplates, template],
      }));
      setNewEmailTemplate('');
      setSuggestions([]);
    }
  };

  const removeEmailTemplate = (templateToRemove: string): void => {
    if (newEmailTemplates.includes(templateToRemove)) {
      setNewEmailTemplates(prev =>
        prev.filter(template => template !== templateToRemove)
      );
      setFormData(prev => ({
        emailTemplates: prev.emailTemplates.filter(
          template => template !== templateToRemove
        ),
      }));
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (workSpaceData?.workSpaceName) {
        await changeWorkSpaceEmailTemplates(
          workSpaceData.workSpaceName,
          formData.emailTemplates
        );
        await getWorkspaceData();
      }
      setNewEmailTemplates([]);
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
        Change email templates
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
          <ModalHeader>Change workspace email templates</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email templates</FormLabel>
              <Input
                name="email"
                value={newEmailTemplate}
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
              {formData.emailTemplates.length > 0 &&
                formData.emailTemplates.map((template, index) => (
                  <HStack
                    key={index}
                    bg="blue.500"
                    color="white"
                    p={2}
                    m={1}
                    borderRadius="md"
                  >
                    <Text>{template}</Text>
                    {newEmailTemplates.includes(template) && (
                      <CloseButton
                        size="sm"
                        onClick={() => removeEmailTemplate(template)}
                      />
                    )}
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

export default ChangeEmailTemplatesModal;
