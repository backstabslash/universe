import { Box, Text, Button, Flex, Heading, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/RegSidebar';
import useWorkSpaceStore from '../../store/workSpace';

const Channels = (): JSX.Element => {
  const navigate = useNavigate();
  const { addWorkspaceTemplate } = useWorkSpaceStore(state => state);

  return (
    <Box flexDirection="column" height="100vh" bg="zinc900">
      <HStack mr={'65px'} alignItems="flex-start">
        <Sidebar />
        <Flex ml="80px" flexDirection="column" alignItems="flex-start">
          <Text fontSize="15px" color="zinc300" mb="40px" mt="25px">
            Step 3 of 3
          </Text>
          <Heading
            flex="1"
            fontSize="4xl"
            borderColor="zinc600"
            borderRadius="md"
            textAlign="left"
            mb="30px"
            maxW={'400px'}
            color="zinc300"
          >
            Would you like to use this template or start from scratch? It&apos;s
            fully customizable.
          </Heading>

          <HStack align="start" spacing={'10px'} mt="lg">
            <Button
              bg="zinc800"
              color="zinc300"
              _hover={{ bg: 'zinc700' }}
              w="100px"
              onClick={() => {
                addWorkspaceTemplate();
                navigate('/main');
              }}
              type="submit"
            >
              Accept
            </Button>
            <Button
              bg="zinc800"
              color="zinc300"
              _hover={{ bg: 'zinc700' }}
              w="100px"
              onClick={() => {
                navigate('/main');
              }}
              type="submit"
            >
              Decline
            </Button>
          </HStack>
        </Flex>
      </HStack>
    </Box>
  );
};

export default Channels;
