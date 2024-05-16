import { useState, useEffect } from 'react';
import {
  Button,
  Text,
  VStack,
  Box,
  Input,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';
import useAuthStore from '../../store/auth';

const emailRules = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .trim()
  .lowercase()
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

const RegUser = (): JSX.Element => {
  const navigate = useNavigate();

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

  const {
    register,
    verify,
    error: verifyError,
  } = useAuthStore(state => ({
    register: state.register,
    verify: state.verify,
    error: state.error,
  }));

  useEffect(() => {
    validate();
  }, [name, email, password, confirmPassword, verifyCode]);

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

  const handleRegister = async (): Promise<void> => {
    if (validate()) {
      try {
        await register({ name, email, password, verifyCode });
        console.log('Registration successful');
      } catch (error) {
        console.error('Failed to register:', error);
      }
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

  return (
    <Flex
      h="100vh"
      w="100vw"
      bg="zinc900"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        borderRadius="1.2rem"
        border="1px"
        borderColor="zinc700"
        p="1.4rem"
        mx="auto"
      >
        <VStack align="center" gap="2">
          <Text fontWeight="bold" color="zinc300" mb="1rem" fontSize={'lg'}>
            Create an account for your Uni workspace
          </Text>
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
              mb={!errors.email ? '10px' : 'none'}
              color="zinc300"
              value={email}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              onChange={e => setEmail(e.target.value)}
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
          {verifyError && (
            <Text color="red.500" mt="10px">
              {verifyError}
            </Text>
          )}
          <Button
            onClick={() => {
              handleRegister();
            }}
            bg="zinc800"
            color="zinc300"
            _hover={{ bg: 'zinc700' }}
            borderColor="transparent"
            variant="outline"
            w="100px"
          >
            Sign up
          </Button>
        </VStack>
        <VStack align="center">
          <Button
            bg="zinc900"
            color="zinc400"
            _hover={{ color: 'zinc700' }}
            _active={{ color: 'zinc700' }}
            borderColor="transparent"
            variant="outline"
            onClick={() => {
              navigate('/main');
            }}
          >
            Already have an account?
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default RegUser;
