import { EditIcon } from '@chakra-ui/icons'
import { Box, Heading, Flex, Button, Text } from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TextEditor from '../components/TextEditor'

const contentData = [
  'This is a message',
  'Another message',
  'Yet another message',
  'This is a message',
  'Another message',
  'Yet another message',
  'This is a message',
  'Another message',
  'Yet another message',
]

const MainContent = (): JSX.Element => {
  return (
    <Flex flexDirection={'column'} alignItems={'center'}>
      <Header />
      <Box
        flex="1"
        flexDirection="column"
        h="calc(100vh - 46px)"
        w="calc(100vw - 8px)"
        m="1"
        borderRadius="10px"
      >
        <Flex>
          <Sidebar />
          <Box
            w="calc(100vw - 8px)"
            h="calc(100vh - 46px)"
            color="zinc300"
            borderBottomRightRadius="10px"
          >
            <Flex
              fontSize="lg"
              width="100%"
              background="rgba(0, 0, 0, 0.6)"
              borderBottom="1px"
              borderColor="zinc600"
              p="15px"
              h="60px"
              borderTopRightRadius="10px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text>
                <b>#general</b>
              </Text>
              <Button
                size="md"
                mr="2"
                bg="transparent"
                color="zinc300"
                _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
              >
                <EditIcon boxSize={'4'} /> &nbsp; Canvas
              </Button>
            </Flex>
            <Box
              bg="rgba(0, 0, 0, 0.6)"
              h="calc(100vh - 256px)"
              overflowY="auto"
              bgImage="../../public/chat-bg-pattern-dark.png"
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
                  bg="rgba(0, 0, 0, 0.4)"
                  borderRadius="md"
                  boxShadow="md"
                  color="zinc300"
                  mb="4"
                  ml="4"
                  width="fit-content"
                >
                  {content}
                </Box>
              ))}
            </Box>
            <Flex
              background="rgba(0, 0, 0, 0.6)"
              borderTop="1px"
              borderColor="zinc600"
              p="4"
              alignItems="center"
              borderBottomRightRadius="10px"
              h="150px"
            >
              <TextEditor />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

export default MainContent
