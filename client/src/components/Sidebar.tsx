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
  Text,
} from '@chakra-ui/react';
import DragAndDropList from './custom-elements/DragAndDropList';
import useMessengerStore, { ChannelGroup } from '../store/messenger';
import useWorkSpaceStore from '../store/workSpace';
import CreateChannelModal from './CreateChannelModal';
import { AddIcon } from '@chakra-ui/icons';
import { css } from '@emotion/react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { api } from '../config/config';
import CreateRoleModal from './CreateRoleModal';
import useAuthStore from '../store/auth';
import ChangeEmailTemplatesModal from './ChangeEmailTemplatesModal';

const Sidebar = (): JSX.Element => {
  const {
    channelGroups,
    dmsWithUsers,
    currentChannel,
    notesChannel,
    setCurrentChannel,
    updateChannelGroupsOrder: updateChannelGroups,
  } = useMessengerStore(state => state);
  const [conversationList, setConversationList] = useState<ChannelGroup[]>([]);
  const [groupsChanged, setGroupsChanged] = useState<boolean>(false);
  const [addingAGroup, setAddingAGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [filteredDMs, setFilteredDMs] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const { workSpaceData } = useWorkSpaceStore(state => state);
  const axiosPrivate = useAxiosPrivate();
  const { userData } = useAuthStore(state => state);

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
    }, 3000);

    return () => {
      clearTimeout(changeGroupstimeoutRef.current);
    };
  }, [conversationList]);

  const onChannelClick = (id: string, name: string, userId: string): void => {
    setCurrentChannel(id, name, userId);
    setActiveChannel(id);
  };

  const fetchMessages = async (channelId: string): Promise<boolean> => {
    try {
      const response = await axiosPrivate?.get(
        `${api.url}/channel/${channelId}/messages`
      );
      return response.data.length > 0;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return false;
    }
  };

  const filterDMs = async (): Promise<void> => {
    const dmsWithMessages = await Promise.all(
      dmsWithUsers?.map(async dm => {
        const hasMessages = await fetchMessages(dm.channel);
        return hasMessages ? dm : null;
      })
    );
    setFilteredDMs(dmsWithMessages.filter(dm => dm !== null));
  };

  useEffect(() => {
    filterDMs();
  }, [dmsWithUsers]);

  useEffect(() => {
    setNewGroupName('New Group');
  }, [addingAGroup]);

  const onBlurGroupNameInput = (): void => {
    let groupName = newGroupName;
    let newGroupId = '0';
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

      newGroupId = i.toString();
    }

    setConversationList([
      { id: newGroupId, name: groupName, items: [] },
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
                <VStack alignItems={'start'}>
                  <CreateChannelModal />
                  {!userData?.userRole?.includes('student') && (
                    <CreateRoleModal />
                  )}
                  {userData?.userRole?.includes('administration') && (
                    <ChangeEmailTemplatesModal />
                  )}
                </VStack>
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
            isDisabled={
              addingAGroup ||
              !!conversationList.find(
                group => group.name !== 'General' && group.items.length === 0
              )
            }
            onClick={() => setAddingAGroup(true)}
          >
            <AddIcon fontSize="10px" mt={'2px'} />
            &nbsp;<Text color="zinc400">Add group</Text>
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
              activeChannel={
                currentChannel?.id !== notesChannel?.id ? activeChannel : null
              }
            />

            <Heading mb="2" mt="2" fontSize="lg" width="100%" ml={'30px'}>
              Direct Messages
            </Heading>
            {filteredDMs?.map(dm => (
              <Button
                key={dm.channel}
                p="2"
                borderRadius="md"
                background={
                  currentChannel?.id !== notesChannel?.id &&
                  activeChannel === dm.channel
                    ? 'rgba(0, 0, 0, 0.3)'
                    : 'rgba(0, 0, 0, 0.1)'
                }
                color={
                  currentChannel?.id !== notesChannel?.id &&
                  activeChannel === dm.channel
                    ? 'white'
                    : 'zinc400'
                }
                _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
                _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
                width="92%"
                minH="44px"
                pr="15px"
                pl="15px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
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
