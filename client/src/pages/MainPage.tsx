import {
  Button,
  Flex,
  Stack,
  Text,
  VStack,
  HStack,
  Box,
  Spacer,
  Input,
} from '@chakra-ui/react';

import MainpageSvg from '../../public/svg/mainpageSvg';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth';

const MainPage = (): JSX.Element => {
  const navigate = useNavigate();

  const login = useAuthStore(state => state.login);

  const handleLogin = async (): Promise<void> => {
    try {
      const credentials = {
        email: 'faltin@gmail.com',
        password: 'fffffffffF1!',
      };
      await login(credentials);
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  return (
    <VStack h="100vh" w="100vw" bg="zinc900">
      <VStack spacing="2rem" mb="100rem" mt="6rem">
        <HStack mb="2rem">
          <Flex justify="end">
            <Stack align="start" w="70%" justify="center" mr="1rm">
              <Text fontSize="3rem" fontWeight={600} color="zinc300">
                Get started on Universe
              </Text>
              <Text fontSize="1rem" mt="1.2rem" w="75%" color="zinc300">
                It&apos;s a new way to communicate with everyone you work with.
                It&apos;s faster, better organized, and more secure than email -
                and it&apos;s free to try.
              </Text>
              <Spacer></Spacer>
              <Spacer></Spacer>
              <Stack>
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
              </Stack>
            </Stack>
            <Flex align="center" justify="center"></Flex>
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
          mt="0.1 rem"
          mx="auto"
          h="260px"
        >
          <VStack align="center" gap="2">
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
              placeholder="Password"
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
              _hover={{ color: 'zinc700' }}
              _active={{ color: 'zinc700' }}
              borderColor="transparent"
              variant="outline"
              onClick={() => {
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
