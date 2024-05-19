import {
  Box,
  Text,
  Button,
  Flex,
  Input,
  Heading,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/RegSidebar';
import useWorkSpaceStore from '../../store/workSpace';
import useAuthStore from '../../store/auth';
import Joi from 'joi';

const emailRules = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .trim()
  .messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
  });

const passwordRules = Joi.string()
  .min(8)
  .pattern(
    new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])')
  )
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base':
      'Password must include at least one lowercase letter, one uppercase letter, one digit, и один special character',
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
  });

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

const Coworkers = (): JSX.Element => {
  const isLoadingMock = false;

  const [emailTemplates, setEmailTemplates] = useState<string[]>([]);
  const [templateError, setTemplateError] = useState('');
  const [input, setInput] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    verificationCode?: string;
  }>({});
  const [focusField, setFocusField] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    verify,
    error: registerError,
  } = useAuthStore(state => state);

  useEffect(() => {
    validate();
  }, [name, email, password, confirmPassword, verifyCode]);

  const { error, workSpaceData, addWorkSpace } = useWorkSpaceStore(
    state => state
  );
  const handleFocus = (field: string): void => {
    setFocusField(field);
  };

  const handleBlur = (): void => {
    setFocusField(null);
  };

  const validate = (): boolean => {
    const nameValidation = nameRules.validate(name);
    const emailValidation = emailRules.validate(email);
    const passwordValidation = passwordRules.validate(password);
    const confirmPasswordValidation =
      password === confirmPassword
        ? { error: null }
        : { error: { message: 'Passwords must match' } };

    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      verificationCode?: string;
    } = {};

    if (nameValidation.error) {
      newErrors.name = nameValidation.error.message;
    }

    if (emailValidation.error) {
      newErrors.email = emailValidation.error.message;
    }

    if (passwordValidation.error) {
      newErrors.password = passwordValidation.error.message;
    }

    if (confirmPasswordValidation.error) {
      newErrors.confirmPassword = confirmPasswordValidation.error.message;
    }

    setErrors(newErrors);

    return (
      !nameValidation.error &&
      !emailValidation.error &&
      !passwordValidation.error &&
      !confirmPasswordValidation.error
    );
  };

  const organisationName = workSpaceData?.workSpaceName;
  if (!organisationName) {
    navigate('/reg/companyname');
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      const newInput = input[0] === '@' ? 'a' + input : input;
      const newTemplate = '@' + input.split('@')[1];
      const validationResult = emailRules.validate(newInput);

      if (!validationResult.error && !emailTemplates.includes(newTemplate)) {
        setEmailTemplates(prevTemplates => [...prevTemplates, newTemplate]);
        setInput('');
      } else if (validationResult.error) {
        setTemplateError('Invalid template format');
      } else {
        setTemplateError('This email template already exists');
      }
    }
  };

  const handleDelete = (templateToDelete: any): void => {
    if (templateToDelete !== emailTemplates[0]) {
      setEmailTemplates(emailTemplates.filter(tag => tag !== templateToDelete));
    }
  };

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const emailValue = event.target.value.trim();
    setEmail(emailValue);

    if (!emailRules.validate(emailValue).error) {
      setEmailTemplates(() => ['@' + emailValue.split('@')[1]]);
    } else {
      setEmailTemplates([]);
    }
  };
  const handleVerify = async (): Promise<void> => {
    if (!errors.email) {
      try {
        await verify({ email });
      } catch (error) {
        console.error('Failed to verify email:', error);
      }
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (validate()) {
      try {
        await register({ name, email, password, verifyCode });
        await addWorkSpace({
          workSpaceName: organisationName,
          ownerEmail: email,
          emailTemplates,
        });
        navigate('/reg/channels');
      } catch (error) {
        console.error('Failed to register:', error);
      }
    }
  };

  return (
    <Box flexDirection="column" height="100vh" bg="zinc900">
      <HStack mr={'200px'} alignItems="flex-start">
        <Sidebar />
        <Flex ml="80px" flexDirection="column" alignItems="flex-start">
          <Text fontSize="15px" color="zinc300" mb="40px" mt="25px">
            Step 2 of 3
          </Text>
          <Heading
            flex="1"
            fontSize="4xl"
            borderColor="zinc600"
            borderRadius="md"
            textAlign="left"
            mr="50vw"
            mb="10px"
            color="zinc300"
          >
            Register your <br /> {organisationName} workspace?
          </Heading>
          <Box w="400px">
            <Input
              placeholder="Name"
              fontSize="md"
              bg="zinc800"
              borderRadius="md"
              border="0"
              _focusVisible={{ borderColor: 'zinc600' }}
              minH="35px"
              mb="10px"
              color="zinc300"
              value={name}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && focusField === 'name' && (
              <Text color="red.500">{errors.name}</Text>
            )}
          </Box>
          <Box w="400px">
            <Input
              placeholder="Email"
              fontSize="md"
              bg="zinc800"
              borderRadius="md"
              border="0"
              _focusVisible={{ borderColor: 'zinc600' }}
              minH="35px"
              mb={'10px'}
              color="zinc300"
              value={email}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              onChange={e => {
                handleEmailChange(e);
              }}
            />
            {errors.email && focusField === 'email' && (
              <Text color="red.500">{errors.email}</Text>
            )}
          </Box>
          <Box w="400px">
            {!errors.email && (
              <HStack
                fontSize="md"
                bg="zinc800"
                borderRadius="md"
                border="0"
                _focusVisible={{ borderColor: 'zinc600' }}
                minH="35px"
                mb="10px"
                color="zinc300"
              >
                <Input
                  placeholder="Verify email"
                  fontSize="md"
                  bg="zinc800"
                  borderRadius="md"
                  border="0"
                  _focusVisible={{ borderColor: 'zinc600' }}
                  minH="35px"
                  color="zinc300"
                  onFocus={() => handleFocus('verifyCode')}
                  onBlur={handleBlur}
                  onChange={e => setVerifyCode(e.target.value)}
                />
                <Button
                  color="zinc400"
                  _hover={{ color: 'zinc700' }}
                  _active={{ color: 'zinc700' }}
                  borderColor="transparent"
                  variant="outline"
                  mr="10px"
                  onClick={() => {
                    handleVerify();
                  }}
                >
                  Send code
                </Button>
              </HStack>
            )}
          </Box>
          <Box w="400px">
            <Input
              placeholder="Password"
              fontSize="md"
              bg="zinc800"
              borderRadius="md"
              border="0"
              _focusVisible={{ borderColor: 'zinc600' }}
              minH="35px"
              mb="10px"
              color="zinc300"
              type="password"
              value={password}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              onChange={e => setPassword(e.target.value)}
            />
            {errors.password && focusField === 'password' && (
              <Text color="red.500">{errors.password}</Text>
            )}
          </Box>
          <Box w="400px">
            <Input
              placeholder="Confirm password"
              fontSize="md"
              bg="zinc800"
              borderRadius="md"
              border="0"
              _focusVisible={{ borderColor: 'zinc600' }}
              minH="35px"
              mb="10px"
              color="zinc300"
              type="password"
              value={confirmPassword}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={handleBlur}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && focusField === 'confirmPassword' && (
              <Text color="red.500">{errors.confirmPassword}</Text>
            )}
          </Box>
          {registerError && (
            <Text color="red.500" mt="10px">
              {registerError}
            </Text>
          )}

          {!emailRules.validate(email).error && (
            <Box>
              <Text color="zinc300" mt="10px">
                Template email for your workspace will be
              </Text>
              <Flex
                wrap="wrap"
                maxW={'400px'}
                bg="zinc800"
                borderRadius="md"
                borderColor="zinc600"
                _focusVisible={{ borderColor: 'zinc600' }}
                mb="10px"
                color="zinc300"
              >
                {emailTemplates.map((tag, index) => (
                  <Tag key={index} m="2" w="fit-content" color="zinc800">
                    <TagLabel>{tag}</TagLabel>
                    {tag !== emailTemplates[0] && (
                      <TagCloseButton
                        onClick={() => {
                          handleDelete(tag);
                        }}
                      />
                    )}
                  </Tag>
                ))}
                <Input
                  flex="1"
                  placeholder="Enter email templates"
                  fontSize="md"
                  bg="zinc800"
                  borderRadius="md"
                  border={'0'}
                  _focusVisible={{ borderColor: 'zinc600' }}
                  w="400px"
                  minH="35px"
                  color="zinc300"
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </Flex>
              {templateError && (
                <Text color="red.500" mt="10px">
                  {templateError}
                </Text>
              )}
            </Box>
          )}
          <VStack align="left" gap="md">
            {error && (
              <Text color="red.500" mb="10px">
                {error}
              </Text>
            )}
            <Button
              bg="zinc800"
              color="zinc300"
              _hover={{ bg: 'zinc700' }}
              w="100px"
              onClick={() => {
                handleRegister();
              }}
              type="submit"
            >
              {isLoadingMock ? '' : 'Next'}
            </Button>
          </VStack>
        </Flex>
      </HStack>
    </Box>
  );
};

export default Coworkers;
