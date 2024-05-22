import {
  Button,
  Flex,
  Text,
  VStack,
  HStack,
  Box,
  Input,
} from '@chakra-ui/react';

import MainpageSvg from '../../public/svg/mainpageSvg';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth';
import { useState } from 'react';

const MainPage = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const { login, setErrorNull } = useAuthStore(state => state);
  const [error, setError] = useState<string>();

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(event.target.value);
  };

  const handleLogin = async (): Promise<void> => {
    try {
      await login({ email, password });
      navigate('/client');
    } catch (error) {
      setError('Login or password is incorrect');
      console.error('Failed to log in:', error);
    }
  };

  return (
    <VStack minH={'100vh'} bg="zinc900" p={'25px'}>
      <VStack spacing={'20px'}>
        <HStack>
          <Flex justify="end">
            <VStack align="start" w="70%" justify="center" spacing={'20px'}>
              <Text fontSize="3rem" fontWeight={600} color="zinc300">
                Get started on Universe
              </Text>
              <Text fontSize="1rem" mt="1.2rem" w="75%" color="zinc300">
                It&apos;s a new way to communicate with everyone you work with.
                It&apos;s faster, better organized, and more secure than email -
                and it&apos;s free to try.
              </Text>
              <Button
                type="submit"
                height="40px"
                bg="zinc800"
                color="zinc300"
                _hover={{ bg: 'zinc700' }}
                onClick={() => {
                  navigate('/reg/companyname');
                }}
                size="md"
              >
                {'Create Workspace'}
              </Button>
            </VStack>
          </Flex>
          <Flex align="center" justify="start" w="60%">
            <MainpageSvg />
          </Flex>
        </HStack>

        <Box
          borderRadius="1.2rem"
          border="1px"
          borderColor="zinc700"
          p="1.4rem"
        >
          <VStack align="center">
            <Text
              fontWeight="bold"
              color="zinc300"
              mb="0.5rem"
              fontSize={'lg'}
              textAlign="center"
            >
              Log into your workspace
            </Text>
            <Input
              flex="1"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email"
              fontSize="md"
              bg="zinc800"
              borderRadius="md"
              border={'0'}
              _focusVisible={{ borderColor: 'zinc600' }}
              w="400px"
              minH="35px"
              mb="10px"
              color="zinc300"
            />
            <Input
              flex="1"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              type="password"
              fontSize="md"
              bg="zinc800"
              borderRadius="md"
              border={'0'}
              _focusVisible={{ borderColor: 'zinc600' }}
              w="400px"
              minH="35px"
              mb="10px"
              color="zinc300"
            />
            <Text fontSize="sm" h={'18px'} color="red.500">
              {error}
            </Text>

            <Button
              onClick={() => {
                handleLogin();
              }}
              bg="zinc800"
              color="zinc300"
              _hover={{ bg: 'zinc700' }}
              borderColor="transparent"
              variant="outline"
              w="100px"
            >
              Login
            </Button>
          </VStack>
          <VStack align="center">
            <Button
              bg="zinc900"
              color="zinc400"
              _hover={{ color: 'zinc300' }}
              _active={{ color: 'zinc300' }}
              borderColor="transparent"
              variant="outline"
              onClick={() => {
                setErrorNull();
                navigate('/reg/reguser');
              }}
            >
              Do not have an account yet?
            </Button>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
};

export default MainPage;
