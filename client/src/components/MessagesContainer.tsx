import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import useMessengerStore, {
  MessageStatus,
  UserMessage,
} from '../store/messenger';
import useAuthStore from '../store/auth';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Clear, InsertDriveFile, Image } from '@mui/icons-material/';
import {
  Element as EditorElement,
  Leaf as EditorLeaf,
  ElementProps,
  LeafProps,
  withInlines,
} from './TextEditor';
import { Editable, Slate, withReact } from 'slate-react';
import { createEditor } from 'slate';
import useUserStore from '../store/user';

const MessagesContainer = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstMessageRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const {
    channels,
    socket,
    currentChannel,
    lastSentMessage,
    loadChannelMessages,
    onRecieveChannelMessages,
    processDownloadingAttachment,
    deleteMessage,
  } = useMessengerStore(state => state);
  const { userData } = useAuthStore(state => state);
  const { axios } = useUserStore(state => state);

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    messageId: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    messageId: null,
  });

  const closeContextMenu = (): void => {
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleContextMenu = (
    event: React.MouseEvent,
    messageId: string
  ): void => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      messageId,
    });
  };

  useEffect(() => {
    if (!currentChannel) return;
    const channelMessages: UserMessage[] | undefined = channels.find(
      channel => channel.id === currentChannel.id
    )?.messages;
    if (channelMessages && channelMessages.length > 0) {
      setMessages([...channelMessages]);
    } else {
      setMessages([]);

      setMessagesLoading(true);
      loadChannelMessages();
    }
  }, [currentChannel]);

  useEffect(() => {
    const channelMessagesHandler = (data: {
      messages: UserMessage[];
      hasMoreMessages: boolean;
      users: any;
    }): void => {
      setHasMoreMessages(data.hasMoreMessages);
      setMessages(prevMessages => [...prevMessages, ...data.messages]);
      onRecieveChannelMessages(data);
      setMessagesLoading(false);
    };

    socket?.on('recieve-channel-messages', channelMessagesHandler);

    return () => {
      socket?.off('recieve-channel-messages', channelMessagesHandler);
    };
  }, [socket, channels, currentChannel, onRecieveChannelMessages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !messagesLoading && hasMoreMessages) {
          setMessagesLoading(true);
          loadChannelMessages();
        }
      },
      {
        root: null,
        rootMargin: '-100px 0px 0px 0px',
        threshold: 0,
      }
    );

    if (firstMessageRef.current) {
      observer.observe(firstMessageRef.current);
    }

    return () => {
      if (firstMessageRef.current) {
        observer.unobserve(firstMessageRef.current);
      }
    };
  }, [messagesLoading, loadChannelMessages, messages]);

  useEffect(() => {
    if (
      lastSentMessage?.message &&
      lastSentMessage.channelId === currentChannel?.id
    ) {
      setMessages(prevMessages => {
        if (lastSentMessage.message) {
          return [lastSentMessage.message, ...prevMessages];
        }
        return prevMessages;
      });

      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  }, [lastSentMessage]);

  const renderElement = useCallback(
    (props: ElementProps) => <EditorElement {...props} />,
    []
  );

  const renderLeaf = useCallback(
    (props: LeafProps) => <EditorLeaf {...props} />,
    []
  );

  const editorsMap = useMemo(() => {
    const map = new Map();
    messages.forEach(message => {
      const editor = withInlines(withReact(createEditor()));
      map.set(message.id, editor);
    });
    return map;
  }, [messages]);

  const handleDownloadFile = async (
    fileId: string,
    fileName: string
  ): Promise<void> => {
    try {
      if (!axios) {
        return;
      }

      await processDownloadingAttachment(axios, fileId, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const handleDeleteMessage = (): void => {
    try {
      if (contextMenu.messageId && currentChannel?.id) {
        deleteMessage(contextMenu.messageId, currentChannel.id);
        const filteredMessages = messages.filter(
          message => message.id === contextMenu.messageId
        );
        setMessages(filteredMessages);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  return (
    <Flex
      ref={containerRef}
      background="rgba(0, 0, 0, 0.5)"
      maxH="calc(100vh - 270px)"
      height={'100%'}
      overflowY="auto"
      bgImage="../../chat-bg-pattern-dark.png"
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center"
      pt={'15px'}
      pb={'10px'}
      flexDirection="column-reverse"
      onClick={closeContextMenu}
    >
      {messagesLoading && messages.length === 0 ? (
        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
          <Spinner size={'xl'} thickness="4px" speed="0.5s" />
        </Flex>
      ) : (
        messages.map((message, index) => {
          return (
            <React.Fragment key={message.id}>
              {index === messages.length - 1 && (
                <Box ref={firstMessageRef}></Box>
              )}
              {index === messages.length - (messages.length - 1) && (
                <Box ref={lastMessageRef}></Box>
              )}
              <HStack
                alignSelf={`${message.user._id === userData?.userId ? 'end' : 'start'}`}
                spacing={'10px'}
                p={'5px 10px 5px 10px'}
                bg={`${message.user._id === userData?.userId ? 'zinc700' : 'zinc800'}`}
                borderRadius="md"
                boxShadow="md"
                color="zinc300"
                mt="18px"
                ml={`${message.user._id === userData?.userId ? '100px' : '18px'}`}
                mr={`${message.user._id === userData?.userId ? '18px' : '100px'}`}
                width="fit-content"
                onContextMenu={event => handleContextMenu(event, message.id)}
              >
                <VStack mb={'8px'} spacing={0}>
                  <HStack alignSelf={'start'}>
                    {message.user._id === userData?.userId ? null : (
                      <Text color="zinc400">{message.user.name}</Text>
                    )}
                  </HStack>
                  <VStack alignSelf={'start'}>
                    {message.attachments?.map((attachment, index) => (
                      <VStack
                        key={`${attachment.url}-${index}`}
                        alignSelf={'start'}
                      >
                        <HStack alignSelf={'start'}>
                          <IconButton
                            aria-label="IconButtonLabel"
                            icon={
                              attachment.type === 'image' ? (
                                <Image />
                              ) : (
                                <InsertDriveFile />
                              )
                            }
                            onClick={() => {
                              handleDownloadFile(
                                attachment.url,
                                attachment.name
                              );
                            }}
                          />
                          <Text
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {attachment.name}
                          </Text>
                        </HStack>
                      </VStack>
                    ))}
                    <HStack alignSelf={'start'}>
                      <Slate
                        editor={editorsMap.get(message.id)}
                        initialValue={message.textContent}
                      >
                        <Editable
                          style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-all',
                            whiteSpace: 'normal',
                          }}
                          renderElement={renderElement}
                          renderLeaf={renderLeaf}
                          readOnly
                        />
                      </Slate>
                    </HStack>
                  </VStack>
                </VStack>
                <VStack alignSelf={'end'}>
                  <HStack spacing={'5px'}>
                    <Text color="zinc500">
                      {new Date(message.sendAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    {message.status === MessageStatus.FAILED ? (
                      <Icon
                        fontSize={'20px'}
                        as={Clear}
                        color="red.500"
                        cursor="pointer"
                        onClick={() => {}}
                      />
                    ) : message.status === MessageStatus.SENDING ? (
                      <Spinner size={'xs'} thickness="3px" speed="0.5s" />
                    ) : null}
                  </HStack>
                </VStack>
              </HStack>
            </React.Fragment>
          );
        })
      )}
      {messagesLoading && messages.length > 0 && (
        <Flex justifyContent="center" alignItems="center" w="100%" h="auto">
          <Spinner size="lg" thickness="4px" speed="0.5s" />
        </Flex>
      )}
      {contextMenu.visible && (
        <Box
          position="fixed"
          top={`${contextMenu.y}px`}
          left={`${contextMenu.x}px`}
          zIndex="tooltip"
        >
          <VStack bg="zinc900" borderRadius="md" boxShadow="md" p="2">
            <HStack
              bg="zinc900"
              _hover={{ background: 'zinc800' }}
              w={'100%'}
              borderRadius={'md'}
            >
              <Button
                leftIcon={<EditIcon />}
                // onClick={() => }
                color="white"
                bg="none"
                _hover={{ background: 'none' }}
                _active={{ background: 'none' }}
                alignSelf={'start'}
              >
                Edit
              </Button>
            </HStack>
            <Button
              leftIcon={<DeleteIcon color="red.500" />}
              onClick={() => {
                handleDeleteMessage();
              }}
              color="red.500"
              bg="zinc900"
              _hover={{ background: 'zinc800' }}
              _active={{ background: 'zinc800' }}
              borderRadius={'md'}
              alignSelf={'start'}
            >
              Delete
            </Button>
          </VStack>
        </Box>
      )}
    </Flex>
  );
};

export default MessagesContainer;
