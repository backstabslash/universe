import { Box, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
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
import ClearIcon from '@mui/icons-material/Clear';
import {
  Element as EditorElement,
  Leaf as EditorLeaf,
  ElementProps,
  LeafProps,
  withInlines,
} from './TextEditor';
import { Editable, Slate, withReact } from 'slate-react';
import { createEditor } from 'slate';

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
  } = useMessengerStore(state => state);
  const { userData } = useAuthStore(state => state);

  useEffect(() => {
    const channelMessages: UserMessage[] | undefined = channels.find(
      channel => channel.id === currentChannel?.id
    )?.messages;
    if (channelMessages && channelMessages.length > 0) {
      setMessages([...channelMessages]);
    } else {
      setMessages([]);
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
          setMessagesLoading(false);
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

  return (
    <Box
      ref={containerRef}
      background="rgba(0, 0, 0, 0.5)"
      h="calc(100vh - 252px)"
      overflowY="auto"
      bgImage="../../public/chat-bg-pattern-dark.png"
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center"
      pb={'18px'}
      display="flex"
      flexDirection="column-reverse"
    >
      {messagesLoading && <Spinner />}
      {messages.map((message, index) => {
        return (
          <React.Fragment key={message.id}>
            {index === messages.length - 1 && <Box ref={firstMessageRef}></Box>}
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
              ml="18px"
              mr="18px"
              width="fit-content"
            >
              <VStack mb={'8px'} spacing={0}>
                <HStack alignSelf={'start'}>
                  {message.user._id === userData?.userId ? null : (
                    <Text color="zinc400">{message.user.name}</Text>
                  )}
                </HStack>
                <HStack>
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
                      as={ClearIcon}
                      color="red.500"
                      cursor="pointer"
                      onClick={() => {}}
                    />
                  ) : message.status === MessageStatus.SENDING ? (
                    <Spinner size={'xs'} />
                  ) : null}
                </HStack>
              </VStack>
            </HStack>
          </React.Fragment>
        );
      })}
      {messagesLoading && (
        <Spinner
          size="lg"
          position="absolute"
          top="10px"
          left="50%"
          transform="translateX(-50%)"
        />
      )}
    </Box>
  );
};

export default MessagesContainer;
