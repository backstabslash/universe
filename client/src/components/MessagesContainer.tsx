import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import useMessengerStore, {
  MessageStatus,
  UserMessage,
} from '../store/messenger';
import useAuthStore from '../store/auth';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import MessageContextMenu from './MessageContextMenu';

const MessagesContainer = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstMessageRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [contextMenuMessage, setContextMenuMessage] =
    useState<UserMessage | null>(null);

  const {
    channels,
    socket,
    currentChannel,
    lastSentMessage,
    lastEditedMessage,
    lastDeletedMessage,
    notesChannel,
    setEditingMessage,
    loadChannelMessages,
    onRecieveChannelMessages,
    processDownloadingAttachment,
    deleteMessage,
    sendMessageToNotes,
  } = useMessengerStore(state => state);
  const { userData } = useAuthStore(state => state);
  const { axios } = useUserStore(state => state);

  useEffect(() => {
    if (!currentChannel) return;
    const channelMessages: UserMessage[] | undefined = channels.find(
      channel => channel.id === currentChannel.id
    )?.messages;
    setMessages([]);
    if (channelMessages) {
      setMessages([...channelMessages]);
    } else {
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
      setMessages(prevMessages => {
        const existingMessageIds = new Set(
          prevMessages.map(msg => msg.id) || []
        );
        const newMessages = data.messages.filter(
          msg => !existingMessageIds.has(msg.id)
        );
        return [...prevMessages, ...newMessages];
      });

      onRecieveChannelMessages(data);
      setMessagesLoading(false);
    };

    socket?.on('recieve-channel-messages', channelMessagesHandler);

    return () => {
      socket?.off('recieve-channel-messages', channelMessagesHandler);
    };
  }, [socket, channels, currentChannel]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          channels.find(channel => channel.id === currentChannel?.id)
            ?.hasMoreMessages &&
          !messagesLoading
        ) {
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
  }, [messagesLoading, messages]);

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

  useEffect(() => {
    if (
      lastDeletedMessage.messageId &&
      lastDeletedMessage.channelId === currentChannel?.id
    ) {
      const filteredMessages = messages.filter(
        message => message.id !== lastDeletedMessage.messageId
      );
      setMessages(filteredMessages);
    }
  }, [lastDeletedMessage]);

  const [editorsMap, setEditorsMap] = useState(new Map());

  useEffect(() => {
    const updatedEditorsMap = new Map(editorsMap);
    channels
      ?.find(channel => channel?.id === currentChannel?.id)
      ?.messages?.forEach(message => {
        if (!updatedEditorsMap.has(message.id)) {
          const editor = withInlines(withReact(createEditor()));
          editor.children = message.textContent;
          updatedEditorsMap.set(message.id, editor);
        }
      });
    setEditorsMap(updatedEditorsMap);
  }, [channels, currentChannel]);

  useEffect(() => {
    if (
      lastEditedMessage.message &&
      lastEditedMessage.channelId === currentChannel?.id
    ) {
      const filteredMessages = messages.map(message => {
        if (message.id === lastEditedMessage?.message?.id) {
          const editor = editorsMap.get(message.id);
          if (editor) {
            editor.children = lastEditedMessage.message.textContent;
          }
          return {
            ...message,
            textContent: lastEditedMessage.message.textContent,
          };
        }
        return message;
      });

      setMessages(filteredMessages);
    }
  }, [lastEditedMessage]);

  const renderElement = useCallback(
    (props: ElementProps) => <EditorElement {...props} />,
    []
  );

  const renderLeaf = useCallback(
    (props: LeafProps) => <EditorLeaf {...props} />,
    []
  );

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

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    message: UserMessage
  ): void => {
    event.preventDefault();
    setMousePosition({ x: event.clientX, y: event.clientY });
    setContextMenuMessage(message);
    setIsContextMenuOpen(true);
  };

  const handleDeleteMessage = (): void => {
    try {
      if (!currentChannel || !contextMenuMessage) return;

      try {
        deleteMessage(contextMenuMessage.id, currentChannel.id);
      } catch (error) {
        return;
      }

      const filteredMessages = messages.filter(
        message => message.id !== contextMenuMessage.id
      );
      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleEditMessage = (): void => {
    setIsContextMenuOpen(false);
    if (!contextMenuMessage) return;
    setEditingMessage(contextMenuMessage);
  };

  const handleSendToNotes = (): void => {
    setIsContextMenuOpen(false);
    if (!contextMenuMessage) return;

    sendMessageToNotes(contextMenuMessage, contextMenuMessage.user._id);
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
      onClick={() => setIsContextMenuOpen(false)}
    >
      {messagesLoading && messages.length === 0 ? (
        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
          <Spinner size={'xl'} thickness="4px" speed="0.5s" />
        </Flex>
      ) : (
        editorsMap.size > 0 &&
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
                onContextMenu={event => {
                  handleContextMenu(event, message);
                }}
              >
                {contextMenuMessage?.id === message.id && (
                  <MessageContextMenu
                    mousePosition={mousePosition}
                    onDeleteMessage={handleDeleteMessage}
                    isDeleteEnabled={
                      message.user._id === userData?.userId ||
                      currentChannel?.id === notesChannel.id
                    }
                    onEditMessage={handleEditMessage}
                    isEditEnabled={message.user._id === userData?.userId}
                    onSendToNotes={handleSendToNotes}
                    isSendToNotesEnabled={
                      currentChannel?.id !== notesChannel.id
                    }
                    isContextMenuOpen={isContextMenuOpen}
                    onCloseContextMenu={() => setIsContextMenuOpen(false)}
                  />
                )}
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
    </Flex>
  );
};

export default MessagesContainer;
