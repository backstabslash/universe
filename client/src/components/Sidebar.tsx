import { VStack, Heading, Button, Flex, Box } from '@chakra-ui/react'
import FilterListIcon from '@mui/icons-material/FilterList'
import TagIcon from '@mui/icons-material/Tag'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PersonIcon from '@mui/icons-material/Person'

const channels = ['general', 'random', 'team-1', 'team-2']
const directMessages = ['user1', 'user2', 'user3']

interface SidebarProps {
  setisUserProfileVisible: (visible: boolean) => void
}

const Sidebar = ({ setisUserProfileVisible }: SidebarProps): JSX.Element => (
  <VStack
    background="rgba(0, 0, 0, 0.6)"
    w="200px"
    flex="1"
    color="zinc400"
    h="calc(100vh - 42px)"
    overflow="auto"
    borderRight="1px"
    borderColor="rgba(27, 28, 31, 1)"
  >
    <Flex
      mb="2"
      fontSize="xl"
      width="100%"
      borderBottom="1px"
      borderColor="rgba(27, 28, 31, 1)"
      color="zinc300"
      p="15px"
      pt="18px"
      justifyContent={'space-between'}
      alignItems={'center'}
      h="60px"
    >
      <Flex>
        <b>Universe</b>
        <Box mt="2px">
          <KeyboardArrowDownIcon fontSize="small" />
        </Box>
      </Flex>
      <FilterListIcon />
    </Flex>
    <Heading mb="2" fontSize="md" width="100%" pr="15px" pl="15px">
      Channels
    </Heading>
    {channels.map((channel) => (
      <Flex
        key={channel}
        p="2"
        pr="15px"
        pl="15px"
        borderRadius="md"
        background="rgba(0, 0, 0, 0.2)"
        color="zinc400"
        _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
        width="90%"
        gap="5px"
        alignItems={'center'}
        justifyContent={'flex-start'}
      >
        <TagIcon fontSize="small" />
        {`${channel}`}
      </Flex>
    ))}
    {/* <Divider my="1" /> */}
    <Heading mb="2" mt="2" fontSize="md" width="100%" pr="15px" pl="15px">
      Direct Messages
    </Heading>
    {directMessages.map((user) => (
      <Flex
        key={user}
        p="2"
        borderRadius="md"
        background="rgba(0, 0, 0, 0.2)"
        color="zinc400"
        _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
        width="90%"
        pr="15px"
        pl="15px"
        alignItems={'center'}
        justifyContent={'flex-start'}
        gap="5px"
      >
        <PersonIcon fontSize="small" />
        {`${user}`}
      </Flex>
    ))}
    {/* <Divider my="1" /> */}
    <Button
      size="md"
      background="rgba(0, 0, 0, 0.2)"
      _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
      _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
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
