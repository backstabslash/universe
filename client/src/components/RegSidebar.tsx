import { Box, Divider, Heading, VStack } from '@chakra-ui/react'

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

export default Sidebar
