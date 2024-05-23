import { useEffect, useRef, useState } from 'react';
import {
  VStack,
  Heading,
  Flex,
  Button,
  Spinner,
  Image,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Input,
  Box,
} from '@chakra-ui/react';
import DragAndDropList from './custom-elements/DragAndDropList';
import useMessengerStore, { ChannelGroup } from '../store/messenger';
import useWorkSpaceStore from '../store/workSpace';
import CreateChannelModal from './CreateChannelModal';
import { AddIcon } from '@chakra-ui/icons';
import { css } from '@emotion/react';

const Sidebar = (): JSX.Element => {
  const {
    channelGroups,
    dmsWithUsers,
    currentChannel,
    setCurrentChannel,
    updateChannelGroupsOrder: updateChannelGroups,
  } = useMessengerStore(state => state);
  const [conversationList, setConversationList] = useState<ChannelGroup[]>([]);
  const [groupsChanged, setGroupsChanged] = useState<boolean>(false);
  const [addingAGroup, setAddingAGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const { workSpaceData } = useWorkSpaceStore(state => state);

  const changeGroupstimeoutRef = useRef<any>(null);

  useEffect(() => {
    setConversationList(channelGroups);
  }, [channelGroups]);

  useEffect(() => {
    if (changeGroupstimeoutRef.current) {
      clearTimeout(changeGroupstimeoutRef.current);
    }

    changeGroupstimeoutRef.current = setTimeout(() => {
      if (currentChannel && groupsChanged) {
        updateChannelGroups(conversationList);
        setGroupsChanged(false);
      }
    }, 5000);

    return () => {
      clearTimeout(changeGroupstimeoutRef.current);
    };
  }, [conversationList]);

  const onChannelClick = (id: string, name: string, userId: string): void => {
    setCurrentChannel(id, name, userId);
  };

  useEffect(() => {
    let groupName = 'New Group';
    let i = 1;
    while (conversationList.find(group => group.name === groupName)) {
      groupName = `New Group ${i}`;
      i++;
    }

    setNewGroupName(groupName);
  }, [addingAGroup]);

  const onBlurGroupNameInput = (): void => {
    let groupName = newGroupName;
    if (
      !groupName ||
      conversationList.find(conversation => conversation.name === groupName)
    ) {
      groupName = 'New Group';
      let i = 1;
      while (conversationList.find(group => group.name === groupName)) {
        groupName = `New Group ${i}`;
        i++;
      }
    }

    setConversationList([
      { id: '', name: groupName, items: [] },
      ...conversationList,
    ]);
    setAddingAGroup(false);
  };

  const onDeleteGroup = (id: string): void => {
    setGroupsChanged(true);
    setConversationList(conversationList.filter(group => group.id !== id));
  };

  const hiddenScrollbar = css`
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none; // IE и Edge
    scrollbar-width: none; // Firefox
  `;

  return (
    <VStack
      background="rgba(0, 0, 0, 0.5)"
      color="zinc400"
      w={'270px'}
      h="calc(100vh - 42px)"
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
        alignItems={'center'}
        h="60px"
      >
        <HStack w={'100%'} justifyContent={'space-between'} alignItems="center">
          <Heading fontSize="2xl">{workSpaceData?.workSpaceName}</Heading>
          <HStack mt="2px">
            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                color="zinc300"
                bg="transparent"
                _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
                _hover={{ background: 'rgba(0, 0, 0, 0.4)' }}
                alignSelf={'end'}
              >
                ⋮
              </MenuButton>
              <MenuList bg="zinc800" border="none" minWidth="auto">
                <CreateChannelModal />
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </Flex>
      <VStack
        pb={'10px'}
        w={'100%'}
        overflowX={'hidden'}
        overflowY={'scroll'}
        css={hiddenScrollbar}
      >
        <HStack width="100%" justifyContent={'space-between'} pl={'15px'}>
          <Heading fontSize="lg">Channels</Heading>
          <Button
            size="md"
            bg="transparent"
            _hover={{ background: 'none' }}
            _active={{ background: 'none' }}
            _focusVisible={{ background: 'none' }}
            color="zinc300"
            onClick={() => setAddingAGroup(true)}
          >
            <AddIcon fontSize="10px" mt={'2px'} />
            &nbsp;Add group
          </Button>
        </HStack>
        {addingAGroup && (
          <Box
            bg={'zinc950'}
            p="10px"
            pr={'60px'}
            pl={'15px'}
            color="zinc400"
            width={'100%'}
            pb={'30px'}
          >
            <Box bg={'inherit'} borderRadius="md">
              <Input
                size="sm"
                mb="2"
                color="zinc300"
                borderRadius={'md'}
                _focusVisible={{ borderColor: 'zinc600' }}
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                autoFocus={true}
                onBlur={onBlurGroupNameInput}
              />
            </Box>
          </Box>
        )}
        {conversationList.length === 0 ? (
          <Spinner size={'lg'} thickness="4px" speed="0.5s" color="zinc400" />
        ) : (
          <>
            <DragAndDropList
              itemLists={conversationList}
              setItemLists={setConversationList}
              onItemClick={onChannelClick}
              setGroupsChanged={setGroupsChanged}
              onDeleteList={onDeleteGroup}
            />

            <Heading mb="2" mt="2" fontSize="lg" width="100%" ml={'30px'}>
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
                width="92%"
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
          </>
        )}
      </VStack>
    </VStack>
  );
};

export default Sidebar;
