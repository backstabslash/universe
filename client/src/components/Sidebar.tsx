import { useNavigate } from 'react-router-dom'
import { VStack, Heading, Flex, Box, Button } from '@chakra-ui/react'
import FilterListIcon from '@mui/icons-material/FilterList'
import TagIcon from '@mui/icons-material/Tag'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PersonIcon from '@mui/icons-material/Person'

import { DndContext } from '@dnd-kit/core'
import Droppable from './custom-elements/drag-and-drop/Droppable'
import { useState } from 'react'
import Draggable from './custom-elements/drag-and-drop/Draggable'

const channels = ['general', 'random', 'team-1', 'team-2']
const directMessages = ['user1', 'user2', 'user3']

const Sidebar = (): JSX.Element => {
  const navigate = useNavigate()

  const [parent, setParent] = useState(null)
  const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>
  const handleDragEnd = (event) => {
    const { over } = event

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null)
  }

  return (
    <VStack
      background="rgba(0, 0, 0, 0.5)"
      w="200px"
      flex="2"
      color="zinc400"
      h="calc(100vh - 42px)"
      overflow="auto"
      borderRight="1px"
      borderColor="rgba(29, 29, 32, 1)"
    >
      <Flex
        mb="2"
        fontSize="xl"
        width="100%"
        borderBottom="1px"
        borderColor="rgba(29, 29, 32, 1)"
        color="zinc300"
        p="15px"
        pt="18px"
        justifyContent={'space-between'}
        alignItems={'center'}
        h="60px"
      >
        <Flex>
          <b>Universe</b>
          <Box mt="2px">
            <KeyboardArrowDownIcon fontSize="small" />
          </Box>
        </Flex>
        <FilterListIcon />
      </Flex>
      <Heading mb="2" fontSize="md" width="100%" pr="15px" pl="15px">
        Channels
      </Heading>
      <DndContext onDragEnd={handleDragEnd}>
        {parent === null ? draggableMarkup : null}
        {channels.map((channel) => (
          <Droppable key={channel} id={channel}>
            <Button
              key={channel}
              p="2"
              pr="15px"
              pl="15px"
              borderRadius="md"
              background="rgba(0, 0, 0, 0.1)"
              color="zinc400"
              _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
              _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
              width="90%"
              gap="5px"
              alignItems={'center'}
              justifyContent={'flex-start'}
              onClick={() => {
                navigate(`${channel}`)
              }}
            >
              <TagIcon fontSize="small" />
              {`${channel}`}
            </Button>
          </Droppable>
        ))}
      </DndContext>
      <Heading mb="2" mt="2" fontSize="md" width="100%" pr="15px" pl="15px">
        Direct Messages
      </Heading>
      {directMessages.map((user) => (
        <Button
          key={user}
          p="2"
          borderRadius="md"
          background="rgba(0, 0, 0, 0.1)"
          color="zinc400"
          _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
          _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
          width="90%"
          pr="15px"
          pl="15px"
          alignItems={'center'}
          justifyContent={'flex-start'}
          gap="5px"
          onClick={() => {
            navigate(`${user}`)
          }}
        >
          <PersonIcon fontSize="small" />
          {`${user}`}
        </Button>
      ))}
    </VStack>
  )
}

export default Sidebar
