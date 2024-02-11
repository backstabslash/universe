import { AtSignIcon } from '@chakra-ui/icons'
import {
  Box,
  Text,
  Button,
  Flex,
  Input,
  VStack,
  Heading,
  Divider,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  TagLeftIcon,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const channels = ['general', 'random', 'team-1', 'team-2']
const directMessages = ['user1', 'user2', 'user3']

const Sidebar = (): JSX.Element => (
  <VStack
    padding="5"
    bg="zinc900"
    color="zinc300"
    width="300px"
    borderRight="1px"
    borderColor="zinc600"
    height={'100vh'}
  >
    <Heading mb="2" fontSize="lg" width="100%">
      Channels
    </Heading>
    {channels.map((channel) => (
      <Box
        key={channel}
        p="2"
        borderRadius="md"
        bg="zinc900"
        color="zinc300"
        _hover={{ bg: 'zinc800' }}
        width="100%"
      >{`#${channel}`}</Box>
    ))}
    <Divider my="1" />
    <Heading mb="2" mt="2" fontSize="lg" width="100%">
      Direct Messages
    </Heading>
    {directMessages.map((user) => (
      <Box
        key={user}
        p="2"
        borderRadius="md"
        bg="zinc900"
        color="zinc300"
        _hover={{ bg: 'zinc800' }}
        width="100%"
      >{`@${user}`}</Box>
    ))}
    <Divider my="1" />
  </VStack>
)

const Channels = (): JSX.Element => {
  const isLoadingMock = false

  const [tags, setTags] = useState<string[]>([])
  const [input, setInput] = useState<string>('')

  const navigate = useNavigate()

  const handleKeyDown = (event: any): void => {
    if (event.key === 'Enter') {
      setTags([...tags, input])
      setInput('')
    }
  }
  const handleDelete = (tagToDelete: any): void => {
    setTags(tags.filter((tag) => tag !== tagToDelete))
  }

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
            mr="640px"
            mb="10px"
          >
            What&apos;s your team working on right now?
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
          >
            {tags.map((tag, index) => (
              <Tag key={index} m="2" w="fit-content">
                <TagLeftIcon boxSize="12px" as={AtSignIcon} />
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    handleDelete(tag)
                  }}
                />
              </Tag>
            ))}
            <Input
              flex="1"
              placeholder="Enter channels' names"
              fontSize="lg  "
              bg="zinc800"
              borderRadius="md"
              border={'0'}
              _focusVisible={{ borderColor: 'zinc600' }}
              w="460px"
              mb="10px"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
              onKeyDown={handleKeyDown}
            />
          </Flex>

          <Flex align="start" gap="md" mt="lg">
            <Button
              w="100px"
              onClick={() => {
                navigate('/')
              }}
              type="submit"
            >
              {isLoadingMock ? '' : 'Continue'}
            </Button>
          </Flex>
        </Flex>
      </HStack>
    </Box>
  )
}

export default Channels
