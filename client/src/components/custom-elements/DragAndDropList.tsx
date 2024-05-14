import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from 'react-beautiful-dnd'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'

interface DragAndDropListProps {
  itemLists: List[]
  setItemLists: (itemLists: List[]) => void
}

interface Item {
  id: string
  name: string
}

export interface List {
  name: string
  items: Item[]
}

const DragAndDropList = ({
  itemLists,
  setItemLists,
}: DragAndDropListProps): JSX.Element => {
  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) {
      return
    }

    if (result.type === 'list') {
      const reorderedLists = [...itemLists]
      const [movedList] = reorderedLists.splice(result.source.index, 1)
      reorderedLists.splice(result.destination.index, 0, movedList)
      setItemLists(reorderedLists)
      return
    }

    const sourceList = itemLists.find(
      (list) => list.name === result.source.droppableId
    )
    const destinationList = itemLists.find(
      (list) => list.name === result.destination?.droppableId
    )

    if (sourceList?.name === destinationList?.name) {
      const reorderedItems = [...(sourceList?.items ?? [])]
      const [movedItem] = reorderedItems.splice(result.source.index, 1)
      reorderedItems.splice(result.destination.index, 0, movedItem)

      setItemLists(
        itemLists.map((list) =>
          list.name === sourceList?.name
            ? { ...list, items: reorderedItems }
            : list
        )
      )
    } else {
      const sourceListCopy = [...(sourceList?.items ?? [])]
      const destinationListCopy = [...(destinationList?.items ?? [])]

      const [movedItem] = sourceListCopy.splice(result.source.index, 1)
      destinationListCopy.splice(result.destination.index, 0, movedItem)

      setItemLists(
        itemLists.map((list) =>
          list.name === sourceList?.name
            ? { ...list, items: sourceListCopy }
            : list.name === destinationList?.name
              ? { ...list, items: destinationListCopy }
              : list
        )
      )
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="vertical">
        {(provided, snapshot) => (
          <Flex
            ref={provided.innerRef}
            {...provided.droppableProps}
            bg={snapshot.isDraggingOver ? 'gray.200' : 'inherit'}
            p={4}
            flexDirection="column"
            gap={4}
          >
            {itemLists.map((list, index) => (
              <Draggable key={list.name} draggableId={list.name} index={index}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    bg={snapshot.draggingOver ? 'blue.200' : 'white'}
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                  >
                    <Droppable droppableId={list.name} type="item">
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          bg={snapshot.isDraggingOver ? 'gray.100' : 'inherit'}
                          p={2}
                          borderRadius="md"
                        >
                          <Heading size="sm" mb={2}>
                            {list.name}
                          </Heading>
                          {list.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  bg={
                                    snapshot.isDragging ? 'green.100' : 'white'
                                  }
                                  p={2}
                                  borderRadius="md"
                                  mb={2}
                                  boxShadow="sm"
                                >
                                  <Text>{item.name}</Text>
                                </Box>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DragAndDropList
