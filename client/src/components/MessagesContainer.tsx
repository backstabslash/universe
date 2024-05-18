import { Box, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import useMessengerStore, {
  UserMessage,
  MessageStatus,
} from '../store/messenger';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Element as EditorElement,
  Leaf as EditorLeaf,
  ElementProps,
  LeafProps,
  withInlines,
} from './TextEditor';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { createEditor } from 'slate';
import styled from 'styled-components';

const MessagesContainer = (): JSX.Element => {
  const { channels, currentChannel } = useMessengerStore(state => state);

  const [currentChannelMessages, setCurrentChannelMessages] = useState<
    UserMessage[]
  >([]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentChannelMessages([
      ...(channels.find(channel => channel.id === currentChannel?.id)
        ?.messages ?? []),
    ]);
    console.log('currentChannelMessages', currentChannelMessages);
  }, [channels, currentChannel]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentChannelMessages]);

  const renderElement = useCallback(
    (props: ElementProps) => <EditorElement {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: LeafProps) => <EditorLeaf {...props} />,
    []
  );
  const editors = useMemo(
    () =>
      currentChannelMessages.map(() =>
        withInlines(withReact(withHistory(createEditor())))
      ),
    [currentChannelMessages]
  );

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
    >
      {currentChannelMessages.length > 0 &&
        currentChannelMessages.map((message, index) => {
          const StyledEditable = styled(Editable)`
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-all;
            white-space: normal;
          `;
          return (
            <HStack
              key={index}
              spacing={'10px'}
              p={'5px 10px 5px 10px'}
              bg={'zinc800'}
              borderRadius="md"
              boxShadow="md"
              color="zinc300"
              mt="18px"
              ml="18px"
              width="fit-content"
            >
              <VStack mb={'8px'} spacing={0}>
                <HStack alignSelf="start">
                  <Text color="zinc400">{message.user.name}</Text>
                </HStack>
                <HStack>
                  <Slate
                    editor={editors[index] as ReactEditor}
                    initialValue={message.textContent}
                  >
                    <StyledEditable
                      renderElement={renderElement}
                      renderLeaf={renderLeaf}
                      readOnly
                    />
                  </Slate>
                </HStack>
              </VStack>
              <VStack alignSelf={'end'}>
                <HStack spacing={'5px'}>
                  <Text color="zinc600">
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
          );
        })}
    </Box>
  );
};

export default MessagesContainer;
