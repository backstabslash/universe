import {
  AddIcon,
  ChatIcon,
  EditIcon,
  LinkIcon,
  TimeIcon,
} from '@chakra-ui/icons'
import {
  Box,
  Heading,
  Flex,
  Input,
  Button,
  Divider,
  Text,
} from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import IconButton from '../components/IconButton'
import UserProfile from '../components/UserProfile'
import { useState } from 'react'

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
  'This is a message',
  'Another message',
  'Yet another message',
]

const MainContent = (): JSX.Element => {
  const [isUserProfileVisible, setisUserProfileVisible] =
    useState<boolean>(false)

  return (
    <Flex flexDirection={'column'} alignItems={'center'}>
      <Header />
      <Box
        flex="1"
        flexDirection="column"
        w="calc(100vw - 8px)"
        m="1"
        borderRadius="10px"
        overflow="hidden"
      >
        <Flex>
          <Sidebar setisUserProfileVisible={setisUserProfileVisible} />
          <Box w="calc(100vw - 8px)" h="calc(100vh - 42px)" color="zinc300">
            <Flex
              fontSize="lg"
              width="100%"
              background="rgba(0, 0, 0, 0.6)"
              borderBottom="1px"
              borderColor="rgba(20, 29, 64, 1)"
              p="15px"
              h="60px"
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
              {contentData.map((content, index) => (
                <Box
                  key={index}
                  p="3"
                  bg="#1D212E"
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
              pr="4"
              pl="4"
              pb="4"
              alignItems="center"
              h="150px"
            >
              <Flex
                background="rgba(0, 0, 0, 0.2)"
                border="1px"
                borderColor="rgba(20, 29, 64, 1)"
                borderRadius="10px"
                _hover={{ borderColor: 'zinc600' }}
                _focusVisible={{ borderColor: 'zinc600' }}
                width="100%"
                h="136px"
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
                  <Divider
                    orientation="vertical"
                    h="12px"
                    m="0"
                    p="0"
                    mr="8px"
                  />
                  <IconButton label={<LinkIcon boxSize={'3'} />} />
                </Flex>
                <Input
                  flex="1"
                  placeholder="Type a message..."
                  background="rgba(0, 0, 0, 0)"
                  border="0"
                  _placeholder={{
                    color: 'zinc300',
                  }}
                  _focusVisible={{ borderColor: '' }}
                  _hover={{ borderColor: '', bg: '' }}
                  h="10vh"
                />
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  ml="20px"
                >
                  <Box>
                    <IconButton
                      label={<AddIcon boxSize={'3'} />}
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
                      label={<ChatIcon boxSize={'4'} />}
                      mb="5px"
                      mr="30px"
                      mt="5px"
                    />
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          {isUserProfileVisible && (
            <UserProfile setisUserProfileVisible={setisUserProfileVisible} />
          )}
        </Flex>
      </Box>
    </Flex>
  )
}

export default MainContent
