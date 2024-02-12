import { EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Heading,
  Flex,
  Input,
  Button,
  Divider,
  type ButtonProps,
  Text,
} from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import {
  FormatBold,
  FormatItalic,
  StrikethroughS,
  FormatListBulleted,
  Code,
  FormatListNumberedRounded,
  Add,
  Send,
  AlternateEmail,
  EmojiEmotions,
  FormatColorText,
  InsertLink,
  DataArray,
} from '@mui/icons-material/'
import React from 'react'

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
    size="sm"
    mr="2"
    background="rgba(0, 0, 0, 0)"
    color="zinc300"
    p="1px"
    _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
    {...props}
  >
    {label}
  </Button>
)

const MainContent = (): JSX.Element => {
  const [isBold, setIsBold] = React.useState(false)

  const handleToggleBold = (): void => {
    setIsBold(!isBold)
  }

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
              <Flex
                background="rgba(0, 0, 0, 0.2)"
                border="1px"
                borderColor="zinc800"
                borderRadius="10px"
                _hover={{ borderColor: 'zinc600' }}
                _focusVisible={{ borderColor: 'zinc600' }}
                width="100%"
                h="120px"
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
                  <IconButton
                    label={<FormatBold fontSize="small" />}
                    onClick={handleToggleBold}
                  />
                  <IconButton label={<FormatItalic fontSize="small" />} />
                  <IconButton label={<StrikethroughS fontSize="small" />} />
                  <Divider
                    orientation="vertical"
                    h="20px"
                    m="0"
                    p="0"
                    mr="8px"
                  />
                  <IconButton label={<InsertLink fontSize="small" />} />
                  <Divider
                    orientation="vertical"
                    h="20px"
                    m="0"
                    p="0"
                    mr="8px"
                  />
                  <IconButton
                    label={<FormatListNumberedRounded fontSize="small" />}
                  />
                  <IconButton label={<FormatListBulleted fontSize="small" />} />
                  <Divider
                    orientation="vertical"
                    h="20px"
                    m="0"
                    p="0"
                    mr="8px"
                  />
                  <IconButton label={<Code fontSize="small" />} />
                  <IconButton label={<DataArray fontSize="small" />} />
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
                  ml="9px"
                  fontWeight={isBold ? 'bold' : 'normal'}
                />
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  ml="20px"
                >
                  <Box>
                    <IconButton label={<Add />} mb="5px" mt="5px" />
                    <IconButton
                      label={<FormatColorText fontSize="small" />}
                      mb="5px"
                      mt="5px"
                    />
                    <IconButton
                      label={<EmojiEmotions fontSize="small" />}
                      mb="5px"
                      mt="5px"
                    />
                    <IconButton
                      label={<AlternateEmail fontSize="small" />}
                      mb="5px"
                      mt="5px"
                    />
                  </Box>
                  <Box>
                    <IconButton
                      label={<Send fontSize="small" />}
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
}

export default MainContent
