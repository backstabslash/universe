import { Box, HStack, Icon, Spinner, Text } from '@chakra-ui/react';
import useMessengerStore, {
  UserMessage,
  MessageStatus,
} from '../store/messenger';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

const MessagesContainer = (): JSX.Element => {
  const { channels, currentChannel } = useMessengerStore(state => state);

  const [currentChannelMessages, setCurrentChannelMessages] = useState<
    UserMessage[]
  >([]);

  useEffect(() => {
    setCurrentChannelMessages([
      ...(channels.find(channel => channel.id === currentChannel?.id)
        ?.messages ?? []),
    ]);
  }, [channels, currentChannel]);

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
      background="rgba(0, 0, 0, 0.5)"
      h="calc(100vh - 252px)"
      overflowY="auto"
      bgImage="../../public/chat-bg-pattern-dark.png"
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center"
    >
      {currentChannelMessages.length > 0 &&
        currentChannelMessages.map((message, index) => {
          return (
            <HStack
              key={index}
              spacing={'12px'}
              p={'5px 8px 5px 8px'}
              bg={'zinc800'}
              borderRadius="md"
              boxShadow="md"
              color="zinc300"
              mb="18px"
              ml="18px"
              width="fit-content"
            >
              <Slate
                editor={editors[index] as ReactEditor}
                initialValue={message.textContent}
              >
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  readOnly
                />
              </Slate>
              <HStack mt={'7px'} spacing={'5px'}>
                <Text color="zinc600">
                  {new Date(message.sendAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>

                {message.status === MessageStatus.FAILED ? (
                  <Icon
                    mt={'1px'}
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
            </HStack>
          );
        })}
    </Box>
  );
};

export default MessagesContainer;
