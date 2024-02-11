import { Box, VStack, Heading } from '@chakra-ui/react'

const channels = ['general', 'random', 'team-1', 'team-2']
const directMessages = ['user1', 'user2', 'user3']

const Sidebar = (): JSX.Element => (
  <VStack
    background="rgba(0, 0, 0, 0.6)"
    color="zinc300"
    width="300px"
    borderRight="1px"
    borderColor="zinc600"
    borderTopLeftRadius="10px"
    borderBottomLeftRadius="10px"
  >
    <Heading
      mb="2"
      fontSize="lg"
      width="100%"
      borderBottom="1px"
      borderColor="zinc600"
      p="15px"
      pt="20px"
      textAlign="center"
      h="60px"
    >
      Universe
    </Heading>
    <Heading mb="2" fontSize="lg" width="100%" pr="15px" pl="15px">
      Channels
    </Heading>
    {channels.map((channel) => (
      <Box
        key={channel}
        p="2"
        pr="15px"
        pl="15px"
        borderRadius="md"
        background="rgba(0, 0, 0, 0.2)"
        color="zinc300"
        _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
        width="90%"
      >{`#${channel}`}</Box>
    ))}
    {/* <Divider my="1" /> */}
    <Heading mb="2" mt="2" fontSize="lg" width="100%" pr="15px" pl="15px">
      Direct Messages
    </Heading>
    {directMessages.map((user) => (
      <Box
        key={user}
        p="2"
        borderRadius="md"
        background="rgba(0, 0, 0, 0.2)"
        color="zinc300"
        _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
        width="90%"
      >{`@${user}`}</Box>
    ))}
    {/* <Divider my="1" /> */}
  </VStack>
)

export default Sidebar
