import { Box, HStack, Heading, Icon, Spinner, Text } from '@chakra-ui/react';
import useMessengerStore, {
  UserMessage,
  MessageStatus,
} from '../store/messenger';
import { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const MessagesContainer = (): JSX.Element => {
  const { channelGroups, currentGroupName, currentChannelId } =
    useMessengerStore(state => state);

  const [currentChannelMessages, setCurrentChannelMessages] = useState<
    UserMessage[]
  >([]);

  useEffect(() => {
    setCurrentChannelMessages(
      channelGroups
        ?.find(channelGroup => channelGroup.name === currentGroupName)
        ?.items.find(channel => channel.id === currentChannelId)?.content
        ?.messages ?? []
    );
  }, [channelGroups, currentChannelId]);

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
      <Heading p="4" mb="5" fontSize="xl">
        Welcome to #general
      </Heading>
      {currentChannelMessages.length > 0 &&
        currentChannelMessages.map((message, index) => (
          <HStack
            key={index}
            spacing={'12px'}
            p={'5px 8px 5px 8px'}
            bg={
              message.status === MessageStatus.SENDING
                ? 'zinc400'
                : message.status === MessageStatus.FAILED
                  ? 'red.500'
                  : 'zinc800'
            }
            borderRadius="md"
            boxShadow="md"
            color="zinc300"
            mb="18px"
            ml="18px"
            width="fit-content"
          >
            <Text>{message?.textContent[0]?.children[0]?.text}</Text>
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
