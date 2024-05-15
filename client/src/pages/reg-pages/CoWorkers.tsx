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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/RegSidebar';

const Coworkers = (): JSX.Element => {
  const organisationName = 'Placeholder';
  const isLoadingMock = false;

  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  const navigate = useNavigate();

  const handleKeyDown = (event: any): void => {
    if (event.key === 'Enter') {
      setTags([...tags, input]);
      setInput('');
    }
  };
  const handleDelete = (tagToDelete: any): void => {
    setTags(tags.filter(tag => tag !== tagToDelete));
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
            Who else is on the <br /> {organisationName} team?
          </Heading>
          <Flex
            wrap="wrap"
            maxW={'500px'}
            bg="zinc800"
            borderRadius="md"
            borderColor="zinc600"
            _focusVisible={{ borderColor: 'zinc600' }}
            w="460px"
            mb="10px"
            color="zinc300"
          >
            {tags.map((tag, index) => (
              <Tag key={index} m="2" w="fit-content" color="zinc300">
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    handleDelete(tag);
                  }}
                />
              </Tag>
            ))}
            <Input
              flex="1"
              placeholder="Enter an email"
              fontSize="lg"
              bg="zinc800"
              borderRadius="md"
              border={'0'}
              _focusVisible={{ borderColor: 'zinc600' }}
              w="400px"
              minH="50px"
              color="zinc300"
              value={input}
              onChange={e => {
                setInput(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
          </Flex>

          <Flex align="center" gap="md" mt="lg">
            <Button
              bg="zinc800"
              color="zinc300"
              _hover={{ bg: 'zinc700' }}
              w="100px"
              onClick={() => {
                navigate('/reg/channels');
              }}
              type="submit"
            >
              {isLoadingMock ? '' : 'Next'}
            </Button>
          </Flex>
        </Flex>
      </HStack>
    </Box>
  );
};

export default Coworkers;
