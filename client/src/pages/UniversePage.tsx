import { AddIcon, ChatIcon, LinkIcon, TimeIcon } from '@chakra-ui/icons'
import {
  Box,
  Heading,
  Flex,
  Input,
  Button,
  Divider,
  type ButtonProps,
} from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

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

interface IconButtonProps extends ButtonProps {
  label: string | JSX.Element
}

const IconButton = ({ label, ...props }: IconButtonProps): JSX.Element => (
  <Button
    size="xs"
    mr="2"
    bg="zinc800"
    color="zinc300"
    _hover={{ bg: 'zinc700' }}
    {...props}
  >
    {label}
  </Button>
)

const MainContent = (): JSX.Element => (
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
          borderTopRightRadius="10px"
        >
          <Box
            bg="zinc900"
            h="calc(100vh - 196px)"
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
            background="rgba(0, 0, 0, 0.6)"
            borderTop="1px"
            borderColor="zinc600"
            p="4"
            alignItems="center"
            borderBottomRightRadius="10px"
            h="150px"
          >
            <Flex
              bg="zinc800"
              border="1px"
              borderColor="zinc800"
              borderRadius="10px"
              _hover={{ borderColor: 'zinc600' }}
              _focusVisible={{ borderColor: 'zinc600' }}
              width="100%"
              h="100px"
              alignItems="center"
              justifyContent="center"
              flexDirection={'column'}
            >
              <Flex
                mt="5px"
                ml="20px"
                mb="5px"
                alignItems="center"
                justifyContent="left"
                width="100%"
              >
                <IconButton label={<b>B</b>} />
                <IconButton label={<i>I</i>} />
                <IconButton label={<del>S</del>} />
                <Divider orientation="vertical" h="12px" m="0" p="0" />
                <IconButton label={<LinkIcon boxSize={'3'} />} />
              </Flex>
              <Input
                flex="1"
                placeholder="Type a message..."
                bg="zinc800"
                border="0"
                _focusVisible={{ borderColor: '' }}
                _hover={{ borderColor: '', bg: '' }}
                h="7vh"
              />
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                ml="20px"
              >
                <Box>
                  <IconButton
                    label={<AddIcon boxSize={'2'} />}
                    mb="5px"
                    mt="5px"
                  />
                  <IconButton
                    label={<TimeIcon boxSize={'3'} />}
                    mb="5px"
                    mt="5px"
                  />
                </Box>
                <Box>
                  <IconButton
                    label={<ChatIcon boxSize={'3'} />}
                    mb="5px"
                    mr="30px"
                    mt="5px"
                  />
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  </Flex>
)

export default MainContent
