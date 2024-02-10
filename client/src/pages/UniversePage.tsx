import {
  Box,
  VStack,
  Heading,
  Flex,
  Input,
  Button,
  Divider,
} from "@chakra-ui/react";

const channels = ["general", "random", "team-1", "team-2"];
const directMessages = ["user1", "user2", "user3"];

const contentData = [
  "This is a message",
  "Another message",
  "Yet another message",
  "This is a message",
  "Another message",
  "Yet another message",
  "This is a message",
  "Another message",
  "Yet another message",
];

const Sidebar = () => (
  <VStack
    padding="5"
    bg="zinc900"
    color="zinc300"
    width="300px"
    borderRight="1px"
    borderColor="zinc600"
  >
    <Heading mb="2" fontSize="lg" width="100%">
      Channels
    </Heading>
    {channels.map((channel) => (
      <Box
        key={channel}
        p="2"
        borderRadius="md"
        bg="zinc900"
        color="zinc300"
        _hover={{ bg: "zinc800" }}
        width="100%"
      >{`#${channel}`}</Box>
    ))}
    <Divider my="1" />
    <Heading mb="2" mt="2" fontSize="lg" width="100%">
      Direct Messages
    </Heading>
    {directMessages.map((user) => (
      <Box
        key={user}
        p="2"
        borderRadius="md"
        bg="zinc900"
        color="zinc300"
        _hover={{ bg: "zinc800" }}
        width="100%"
      >{`@${user}`}</Box>
    ))}
    <Divider my="1" />
  </VStack>
);

const MainContent = () => (
  <Box flex="1" flexDirection="column" h="100vh">
    <Flex
      bg="zinc900"
      color="zinc300"
      p="4"
      height="60px"
      gap="10px"
      alignItems={"center"}
      borderBottom={"1px"}
      borderColor={"zinc600"}
    >
      <Heading
        flex="1"
        fontSize="2xl"
        borderColor="zinc600"
        bg="zinc800"
        padding="5px"
        borderRadius="md"
        width="200px"
        textAlign="center"
      >
        Universe
      </Heading>
      <Input
        flex="2"
        placeholder="Search Universe"
        bg="zinc800"
        borderRadius="md"
        borderColor="transparent"
        _focusVisible={{ borderColor: "zinc600" }}
        _hover={{ borderColor: "zinc600", bg: "zinc900" }}
      />
      <Button bg="zinc800" color="zinc300" _hover={{ bg: "zinc700" }}>
        ?
      </Button>
    </Flex>
    <Flex>
      <Sidebar />
      <Box bg="zinc900" w="100vw" h="calc(100vh - 60px)" color="zinc300">
        <Box
          h="calc(95% - 60px)"
          overflowY="auto"
          bgImage="url('https://web.telegram.org/a/chat-bg-pattern-dark.ad38368a9e8140d0ac7d.png')"
          bgSize="cover"
          bgRepeat="no-repeat"
          bgPosition="center"
        >
          <Heading p="4" mb="5" fontSize="xl">
            Welcome to #general
          </Heading>
          {contentData.map((content, index) => (
            <Box
              key={index}
              p="3"
              bg="zinc800"
              borderRadius="md"
              boxShadow="md"
              mb="4"
              ml="4"
              width="fit-content"
            >
              {content}
            </Box>
          ))}
        </Box>
        <Flex
          bg="zinc900"
          borderTop="1px"
          borderColor="zinc600"
          p="4"
          alignItems="center"
        >
          <Input
            flex="1"
            placeholder="Type a message..."
            bg="zinc800"
            borderRadius="md"
            borderColor="zinc600"
            _focusVisible={{ borderColor: "zinc600" }}
            _hover={{ borderColor: "zinc600", bg: "zinc900" }}
            h="60px"
          />

          <Button
            ml="4"
            bg="zinc800"
            color="zinc300"
            _hover={{ bg: "zinc700" }}
          >
            Send
          </Button>
        </Flex>
      </Box>
    </Flex>
  </Box>
);

export default MainContent;
