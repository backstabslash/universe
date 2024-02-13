
import { EditIcon } from '@chakra-ui/icons'
import { Box, Heading, Flex, Button, Text, Image, } from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TextEditor from '../components/TextEditor'
import FaceIcon from '@mui/icons-material/Face'
import CottageIcon from '@mui/icons-material/Cottage'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import InboxIcon from '@mui/icons-material/Inbox'
import IconButton from '../components/IconButton'
import UserProfile from '../components/UserProfile'
import { useState } from 'react'
import orgImage from '../../public/org-placeholder.png'


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
      <Flex>
        <Flex
          w="70px"
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'space-between'}
          color={'zinc300'}
        >
          <Flex pt="15px" pl="4px" flexDirection={'column'} gap="20px">
            <Button
              p="1"
              color={'zinc300'}
              bg="transparent"
              _hover={{ background: 'transparent' }}
              _active={{ background: 'transparent' }}
            >
              <Image
                w="55px"
                h="55px"
                src={orgImage}
                alt="Organization banner"
                alignSelf="center"
                borderRadius="10px"
              />
            </Button>
            <Flex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Button
                p="1"
                color={'zinc300'}
                bg="rgba(0, 0, 0, 0.3)"
                _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
                _active={{ background: 'rgba(0, 0, 0, 0.2)' }}
              >
                <CottageIcon fontSize="medium" />
              </Button>
              <Text fontSize={'xs'}>Home</Text>
            </Flex>
            <Flex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Button
                p="1"
                color={'zinc300'}
                bg="transparent"
                _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
                _active={{ background: 'rgba(0, 0, 0, 0.2)' }}
              >
                <InboxIcon fontSize="medium" />
              </Button>
              <Text fontSize={'xs'}>Activity</Text>
            </Flex>
            <Flex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Button
                p="1"
                color={'zinc300'}
                bg="transparent"
                _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
                _active={{ background: 'rgba(0, 0, 0, 0.2)' }}
              >
                <BookmarkIcon fontSize="medium" />
              </Button>
              <Text fontSize={'xs'}>Later</Text>
            </Flex>
          </Flex>
          <Flex pb="15px" pl="4px" flexDirection={'column'} gap="10px">
            <Button
              p="1px"
              color={'zinc300'}
              background={'rgba(0,0,0,0.3)'}
              _hover={{ background: 'rgba(0, 0, 0, 0)' }}
              _active={{ background: 'rgba(0, 0, 0, 0)' }}
            >
              <AddIcon boxSize={'4'} />
            </Button>
            <Button
              p="1"
              color={'zinc300'}
              bg="rgba(33,35,38,1)"
              _hover={{ background: 'rgba(0, 0, 0, 0)' }}
              _active={{ background: 'rgba(0, 0, 0, 0)' }}
              onClick={() => {
                setisUserProfileVisible(true)
              }}
            >
              <FaceIcon fontSize="large" />
            </Button>
          </Flex>
        </Flex>
        <Box
          flexDirection="column"
          w="calc(100vw - 78px)"
          m="1"
          borderRadius="10px"
          overflow="hidden"
        >
          <Flex>
            <Sidebar />
            <Box
              w="calc(100vw - 8px)"
              h="calc(100vh - 42px)"
              color="zinc300"
              flex="4"
            >
              <Flex
                fontSize="lg"
                width="100%"
                background="rgba(0, 0, 0, 0.6)"
                borderBottom="1px"
                borderColor="rgba(27, 28, 31, 1)"
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
                  color="zinc400"
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
                    bg="rgba(33,35,38,1)"
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
                <TextEditor />
              </Flex>
            </Box>
            {isUserProfileVisible && (
              <UserProfile setisUserProfileVisible={setisUserProfileVisible} />
            )}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  )
}

export default MainContent
