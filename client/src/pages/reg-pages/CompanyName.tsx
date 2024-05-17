import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/RegSidebar';
import { useState } from 'react';
import useWorkSpaceStore from '../../store/workSpace';
import Joi from 'joi';

const nameRules = Joi.string()
  .min(3)
  .max(30)
  .pattern(new RegExp('^[a-zA-Z ]+$'))
  .required()
  .trim()
  .messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be less than 30 characters long',
    'string.pattern.base': 'Name can only contain letters and spaces',
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
  });

const CompanyName = (): JSX.Element => {
  const navigate = useNavigate();
  const [workSpaceName, setWorkSpaceName] = useState('');
  const [validationError, setValidationError] = useState('');

  const { checkName, error, setWorkSpaceData } = useWorkSpaceStore(
    state => state
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputValue = event.target.value;
    setWorkSpaceName(inputValue);
    const nameValidation = nameRules.validate(inputValue);
    if (nameValidation.error) {
      setValidationError(nameValidation.error.details[0].message);
    } else {
      setValidationError('');
    }
  };

  const handleCheckName = async (): Promise<void> => {
    if (!validationError) {
      try {
        await checkName({ workSpaceName });
        setWorkSpaceData({ workSpaceName });
        navigate('/reg/coworkers');
      } catch (error) {
        console.error('Failed to add:', error);
      }
    }
  };

  return (
    <Box flexDirection="column" height="100vh" bg="zinc900">
      <HStack mr={'30px'} alignItems="flex-start">
        <Sidebar />
        <Flex ml="80px" flexDirection="column" alignItems="flex-start">
          <Text fontSize="15px" color="zinc300" mb="40px" mt="25px">
            Step 1 of 3
          </Text>
          <Heading
            flex="1"
            fontSize="4xl"
            borderColor="zinc600"
            borderRadius="md"
            textAlign="left"
            mr="50vw"
            color="zinc300"
          >
            What&apos;s the name of your company or team
          </Heading>
          <Text fontSize="sm" w="50%" color="zinc300">
            This will be the name of your Universe workspace - choose something
            that your team will recognize.
          </Text>
          <Text fontSize="lg" mt="10px" w="75%" color="zinc300" mb="10px">
            Name{' '}
            <Text as="span" color="red">
              *
            </Text>
          </Text>
          <Input
            flex="1"
            placeholder="Ex: ONU or Odessa National University"
            fontSize="lg"
            bg="zinc800"
            borderRadius="md"
            border={'0'}
            _focusVisible={{ borderColor: 'zinc600' }}
            w="400px"
            minH="50px"
            mb="10px"
            color="zinc300"
            value={workSpaceName}
            onChange={handleInputChange}
          />
          {validationError && (
            <Text color="red.500" mt="2px" fontSize="sm">
              {validationError}
            </Text>
          )}
          {error && (
            <Text color="red.500" mt="10px">
              {error}
            </Text>
          )}
          <Button
            w="100px"
            bg="zinc800"
            color="zinc300"
            _hover={{ bg: 'zinc700' }}
            onClick={() => {
              handleCheckName();
            }}
          >
            Next
          </Button>
        </Flex>
      </HStack>
    </Box>
  );
};

export default CompanyName;
