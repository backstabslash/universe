import { Flex, Heading, VStack } from '@chakra-ui/react';
import TagIcon from '@mui/icons-material/Tag';
import PersonIcon from '@mui/icons-material/Person';

const channels = ['general', 'random', 'team-1', 'team-2'];
const directMessages = ['user1', 'user2', 'user3'];

const Sidebar = (): JSX.Element => (
  <VStack
    padding="5"
    bg="zinc900"
    color="zinc300"
    maxWidth="300px"
    borderRight="1px"
    borderColor="zinc600"
    height={'100vh'}
  >
    <Flex
      mb="3"
      fontSize="2xl"
      width="100%"
      color="zinc300"
      p="15px"
      pt="18px"
      justifyContent={'space-between'}
      alignItems={'center'}
      h="60px"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
    >
      <b>Organization</b>
    </Flex>
    <Heading mb="2" fontSize="md" width="100%" pr="15px" pl="15px">
      Channels
    </Heading>
    {channels.map(channel => (
      <Flex
        key={channel}
        p="2"
        pr="15px"
        pl="15px"
        borderRadius="md"
        background="rgba(0, 0, 0, 0.1)"
        color="zinc400"
        _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
        width="90%"
        gap="5px"
        alignItems={'center'}
        justifyContent={'flex-start'}
      >
        <TagIcon fontSize="small" />
        {channel}
      </Flex>
    ))}
    <Heading mb="2" mt="2" fontSize="md" width="100%" pr="15px" pl="15px">
      Direct Messages
    </Heading>
    {directMessages.map(user => (
      <Flex
        key={user}
        p="2"
        borderRadius="md"
        background="rgba(0, 0, 0, 0.1)"
        color="zinc400"
        _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
        width="90%"
        pr="15px"
        pl="15px"
        alignItems={'center'}
        justifyContent={'flex-start'}
        gap="5px"
      >
        <PersonIcon fontSize="small" />
        {user}
      </Flex>
    ))}
  </VStack>
);

export default Sidebar;
