import { useEffect, useState } from 'react';
import {
  VStack,
  Heading,
  Flex,
  Box,
  Button,
  Spinner,
  Image,
} from '@chakra-ui/react';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DragAndDropList from './custom-elements/DragAndDropList';
import useMessengerStore, { ChannelGroup } from '../store/messenger';
import useWorkSpaceStore from '../store/workSpace';
import CreateChannelModal from './CreateChannelModal';

const Sidebar = (): JSX.Element => {
  const { channelGroups, setCurrentChannel, dmsWithUsers } = useMessengerStore(
    state => state
  );
  const [conversationList, setConversationList] = useState<ChannelGroup[]>([]);
  const { workSpaceData } = useWorkSpaceStore(state => state);

  const onChannelClick = (id: string, name: string, userId: string): void => {
    setCurrentChannel(id, name, userId);
  };

  useEffect(() => {
    setConversationList(channelGroups);
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
      <CreateChannelModal></CreateChannelModal>
      {conversationList.length === 0 ? (
        <Spinner size={'lg'} thickness="4px" speed="0.5s" color="zinc400" />
      ) : (
        <DragAndDropList
          itemLists={conversationList}
          setItemLists={setConversationList}
          onItemClick={onChannelClick}
        />
      )}

      <Heading mb="2" mt="2" fontSize="md" width="100%" pr="15px" pl="15px">
        Direct Messages
      </Heading>
      {dmsWithUsers?.map(dm => (
        <Button
          key={dm.channel}
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
            onChannelClick(dm.channel, dm.user.name, dm.user._id);
          }}
        >
          <Image
            borderRadius="full"
            src={
              dm.user.pfp_url
                ? dm.user.pfp_url
                : 'https://i.imgur.com/zPKzLoe.gif'
            }
            alt="Profile icon"
            objectFit="cover"
            boxSize="30px"
          />
          {`${dm.user.name}`}
        </Button>
      ))}
    </VStack>
  );
};

export default Sidebar;
