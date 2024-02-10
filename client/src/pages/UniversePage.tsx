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
];

const Sidebar = () => (
  <VStack
    padding="5"
    bg="#222529"
    color="#d1d2d3"
    width="300px"
    borderRight="1px"
    borderColor="#3c3f42"
  >
    <Heading mb="5" fontSize="lg">
      Channels
    </Heading>
    {channels.map((channel) => (
      <Box
        key={channel}
        p="2"
        borderRadius="md"
        bg="#222529"
        color="#d1d2d3"
        _hover={{ bg: "#2a2d31" }}
        width="100%"
      >{`#${channel}`}</Box>
    ))}
    <Divider my="1" />
    <Heading mt="5" mb="2" fontSize="lg">
      Direct Messages
    </Heading>
    {directMessages.map((user) => (
      <Box
        key={user}
        p="2"
        borderRadius="md"
        bg="#222529"
        color="#d1d2d3"
        _hover={{ bg: "#2a2d31" }}
        width="100%"
      >{`@${user}`}</Box>
    ))}
    <Divider my="1" />
  </VStack>
);

const MainContent = () => (
  <Box flex="1" flexDirection="column" h="100vh">
    <Flex
      bg="#222529"
      color="#d1d2d3"
      p="4"
      height="60px"
      gap="10px"
      alignItems={"center"}
      borderBottom={"1px"}
      borderColor={"#3c3f42"}
    >
      <Heading
        flex="1"
        fontSize="2xl"
        borderColor="#d1d2d3"
        bg="#2b2f33"
        padding={"5px"}
        borderRadius={"md"}
        width="200px"
        textAlign={"center"}
      >
        Universe
      </Heading>
      <Input
        flex="2"
        placeholder="Search Universe"
        bg="#2a2d31"
        borderRadius="md"
        borderColor="transparent"
        _focusVisible={{ borderColor: "#3c3f42" }}
        _hover={{ borderColor: "#3c3f42", bg: "#2b2f33" }}
      />
      <Button bg="#222529" color="#d1d2d3" _hover={{ bg: "#2b2f33" }}>
        ?
      </Button>
    </Flex>
    <Flex>
      <Sidebar />
      <Box
        padding="5"
        bg="#2a2d31"
        w="100vw"
        h="calc(100vh - 60px)"
        color="#d1d2d3"
      >
        <Heading mb="5" fontSize="xl">
          Welcome to #general
        </Heading>
        {contentData.map((content, index) => (
          <Box
            key={index}
            p="4"
            bg="#222529"
            borderRadius="md"
            boxShadow="md"
            mb="4"
          >
            {content}
          </Box>
        ))}
        <Flex borderTop="1px" borderColor="#3c3f42" p="4" alignItems="center">
          <Input
            flex="1"
            placeholder="Type a message..."
            bg="#2a2d31"
            borderRadius="md"
            borderColor="#3c3f42"
            _focusVisible={{ borderColor: "#3c3f42" }}
            _hover={{ borderColor: "#3c3f42", bg: "#2b2f33" }}
            h="60px"
          />
          <Button
            ml="4"
            bg="#2a2d31"
            color="#d1d2d3"
            _hover={{ bg: "#222529" }}
          >
            Send
          </Button>
        </Flex>
      </Box>
    </Flex>
  </Box>
);

export default MainContent;
