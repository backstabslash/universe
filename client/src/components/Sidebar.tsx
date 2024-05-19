import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, Heading, Flex, Box, Button, Spinner } from '@chakra-ui/react';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import DragAndDropList from './custom-elements/DragAndDropList';
import useMessengerStore, { Channel, ChannelGroup } from '../store/messenger';
import useWorkSpaceStore from '../store/workSpace';

const directMessages = ['user1', 'user2', 'user3'];

const Sidebar = (): JSX.Element => {
  const navigate = useNavigate();

  const { channelGroups, setCurrentChannel } = useMessengerStore(
    state => state
  );
  const [channelList, setChannelList] = useState<ChannelGroup[]>([]);
  const { workSpaceData } = useWorkSpaceStore(state => state);

  const onChannelClick = (channel: Channel): void => {
    setCurrentChannel(channel);
  };

  useEffect(() => {
    setChannelList(channelGroups);
  }, [channelGroups]);

  return (
    <VStack
      background="rgba(0, 0, 0, 0.5)"
      w="200px"
      flex="2"
      color="zinc400"
      h="calc(100vh - 42px)"
      overflow="auto"
      borderRight="1px"
      borderColor="rgba(29, 29, 32, 1)"
    >
      <Flex
        mb="2"
        fontSize="xl"
        width="100%"
        borderBottom="1px"
        borderColor="rgba(29, 29, 32, 1)"
        color="zinc300"
        p="15px"
        pt="18px"
        justifyContent={'space-between'}
        alignItems={'center'}
        h="60px"
      >
        <Flex>
          <Heading fontSize="2xl">{workSpaceData?.workSpaceName}</Heading>
          <Box mt="2px">
            <KeyboardArrowDownIcon fontSize="small" />
          </Box>
        </Flex>
        <FilterListIcon />
      </Flex>
      <Heading mb="2" fontSize="md" width="100%" pr="15px" pl="15px">
        Channels
      </Heading>
      {channelList.length < 1 ? (
        <Spinner size={'xl'} thickness="4px" speed="0.5s" color="zinc400" />
      ) : (
        <DragAndDropList
          itemLists={channelList}
          setItemLists={setChannelList}
          onItemClick={onChannelClick}
        />
      )}

      <Heading mb="2" mt="2" fontSize="md" width="100%" pr="15px" pl="15px">
        Direct Messages
      </Heading>
      {directMessages.map(user => (
        <Button
          key={user}
          p="2"
          borderRadius="md"
          background="rgba(0, 0, 0, 0.1)"
          color="zinc400"
          _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
          _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
          width="90%"
          pr="15px"
          pl="15px"
          alignItems={'center'}
          justifyContent={'flex-start'}
          gap="5px"
          onClick={() => {
            navigate(`${user}`);
          }}
        >
          <PersonIcon fontSize="small" />
          {`${user}`}
        </Button>
      ))}
    </VStack>
  );
};

export default Sidebar;
