import { useState, useEffect } from 'react';
import { Button, Text, VStack, Box, Input, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';

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
      'Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character',
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
  });

const RegUser = (): JSX.Element => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [focusField, setFocusField] = useState<string | null>(null);

  useEffect(() => {
    validate();
  }, [email, password, confirmPassword]);

  const handleFocus = (field: string): void => {
    setFocusField(field);
  };

  const handleBlur = (): void => {
    setFocusField(null);
  };

  const validate = (): boolean => {
    const emailValidation = emailRules.validate(email);
    const passwordValidation = passwordRules.validate(password);
    const confirmPasswordValidation =
      password === confirmPassword
        ? { error: null }
        : { error: { message: 'Passwords must match' } };

    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

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
      !emailValidation.error &&
      !passwordValidation.error &&
      !confirmPasswordValidation.error
    );
  };

  const handleSubmit = (): void => {
    if (validate()) {
      // Proceed with form submission or any other logic
      console.log('Form is valid');
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
              placeholder="Email"
              fontSize="md"
              bg="zinc800"
              borderRadius="md"
              border="0"
              _focusVisible={{ borderColor: 'zinc600' }}
              minH="35px"
              mb="10px"
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
          <Button
            onClick={handleSubmit}
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
