import { Box, VStack, Heading, Button } from '@chakra-ui/react'

const channels = ['general', 'random', 'team-1', 'team-2']
const directMessages = ['user1', 'user2', 'user3']

interface SidebarProps {
  setisUserProfileVisible: (visible: boolean) => void
}

const Sidebar = ({ setisUserProfileVisible }: SidebarProps): JSX.Element => (
  <VStack
    background="rgba(0, 0, 0, 0.6)"
    color="zinc300"
    flex="0 0 300px"
    h="calc(100vh - 46px)"
    overflow="auto"
    borderRight="1px"
    borderColor="zinc600"
  >
    <Heading
      mb="2"
      fontSize="xl"
      width="100%"
      borderBottom="1px"
      borderColor="zinc600"
      p="15px"
      pt="18px"
      textAlign="center"
      h="60px"
    >
      <b>Universe</b>
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
    <Button
      size="md"
      background="rgba(0, 0, 0, 0.2)"
      _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
      color="zinc300"
      onClick={() => {
        setisUserProfileVisible(true)
      }}
    >
      Profile test
    </Button>
  </VStack>
)

export default Sidebar
