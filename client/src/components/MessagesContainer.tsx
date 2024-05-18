import { Box, HStack, Icon, Spinner, Text } from '@chakra-ui/react';
import useMessengerStore, {
  UserMessage,
  MessageStatus,
} from '../store/messenger';
import { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { Element as EditorElement, Leaf as EditorLeaf } from './TextEditor';

const MessagesContainer = (): JSX.Element => {
  const { channelGroups, currentChannel } = useMessengerStore(state => state);

  const [currentChannelMessages, setCurrentChannelMessages] = useState<
    UserMessage[]
  >([]);

  useEffect(() => {
    setCurrentChannelMessages(prevMessages => {
      const messages: UserMessage[] = [];

      channelGroups?.forEach(channelGroup => {
        const channel = channelGroup?.items?.find(
          channel => channel.id === currentChannel?.id
        );
        if (channel) {
          const channelMessages = channel.content.messages;
          if (Array.isArray(channelMessages)) {
            messages.push(...channelMessages);
          }
        }
      });

      return messages;
    });
  }, [channelGroups, currentChannel]);

  const renderMessageContent = content => {
    return content.map((node, index) => {
      if (node.type) {
        return <EditorElement key={index} attributes={{}} element={node} />;
      } else {
        return <EditorLeaf key={index} attributes={{}} leaf={node} />;
      }
    });
  };

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
        currentChannelMessages.map((message, index) => (
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
            <Text>{renderMessageContent(message.textContent)}</Text>
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
        ))}
    </Box>
  );
};

export default MessagesContainer;
