import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from 'react-beautiful-dnd';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import TagIcon from '@mui/icons-material/Tag';

interface DragAndDropListProps {
  itemLists: List[];
  setItemLists: (itemLists: List[]) => void;
  onItemClick: (item: Item) => void;
}
interface List {
  name: string;
  items: Item[];
}

interface Item {
  id: string;
  name: string;
}

const DragAndDropList = ({
  itemLists,
  setItemLists,
  onItemClick,
}: DragAndDropListProps): JSX.Element => {
  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) {
      return;
    }

    if (result.type === 'list') {
      const reorderedLists = [...itemLists];
      const [movedList] = reorderedLists.splice(result.source.index, 1);
      reorderedLists.splice(result.destination.index, 0, movedList);
      setItemLists(reorderedLists);
      return;
    }

    const sourceList = itemLists.find(
      list => list.name === result.source.droppableId
    );
    const destinationList = itemLists.find(
      list => list.name === result.destination?.droppableId
    );

    if (sourceList?.name === destinationList?.name) {
      const reorderedItems = [...(sourceList?.items ?? [])];
      const [movedItem] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, movedItem);

      setItemLists(
        itemLists.map(list =>
          list.name === sourceList?.name
            ? { ...list, items: reorderedItems }
            : list
        )
      );
    } else {
      const sourceListCopy = [...(sourceList?.items ?? [])];
      const destinationListCopy = [...(destinationList?.items ?? [])];

      const [movedItem] = sourceListCopy.splice(result.source.index, 1);
      destinationListCopy.splice(result.destination.index, 0, movedItem);

      setItemLists(
        itemLists.map(list =>
          list.name === sourceList?.name
            ? { ...list, items: sourceListCopy }
            : list.name === destinationList?.name
              ? { ...list, items: destinationListCopy }
              : list
        )
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="vertical">
        {(provided, snapshot) => (
          <Flex
            ref={provided.innerRef}
            {...provided.droppableProps}
            bg={snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.2)' : 'inherit'}
            p="15px"
            flexDirection="column"
            gap="4"
            minWidth="100%"
            maxWidth="100%"
            background="rgba(0, 0, 0, 0.1)"
          >
            {itemLists.length > 1
              ? itemLists.map((list, index) => (
                  <Draggable
                    key={list.name}
                    draggableId={list.name}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        bg={
                          snapshot.isDragging
                            ? 'rgba(0, 0, 0, 0.4)'
                            : 'rgba(0, 0, 0, 0.1)'
                        }
                        border="1px"
                        borderColor="rgba(29, 29, 32, 1)"
                        borderRadius="md"
                        p="15px"
                        mb="2"
                        color="zinc400"
                        maxWidth="100%"
                        background="rgba(0, 0, 0, 0.1)"
                        _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
                        _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
                      >
                        <Droppable droppableId={list.name} type="item">
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              bg={
                                snapshot.isDraggingOver
                                  ? 'rgba(0, 0, 0, 0.2)'
                                  : 'inherit'
                              }
                              p="2"
                              borderRadius="md"
                            >
                              <Heading size="sm" mb="2" color="zinc300">
                                {list.name}
                              </Heading>
                              {list.items.map((item, index) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <Flex
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      bg={
                                        snapshot.isDragging
                                          ? 'rgba(0, 0, 0, 0.4)'
                                          : 'rgba(0, 0, 0, 0.1)'
                                      }
                                      p="2"
                                      borderRadius="md"
                                      mb="2"
                                      color="zinc400"
                                      _hover={{
                                        background: 'rgba(0, 0, 0, 1)',
                                      }}
                                      overflow="hidden"
                                      textOverflow="ellipsis"
                                      whiteSpace="nowrap"
                                      maxWidth="100%"
                                      alignItems="center"
                                      onClick={() => onItemClick(item)}
                                    >
                                      <TagIcon
                                        fontSize="small"
                                        style={{ marginRight: '8px' }}
                                      />
                                      <Text>{item.name}</Text>
                                    </Flex>
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
                ))
              : itemLists.map(list => (
                  <Box
                    key={list.name}
                    bg="rgba(0, 0, 0, 0.1)"
                    border="1px"
                    borderColor="rgba(29, 29, 32, 1)"
                    borderRadius="md"
                    p="15px"
                    mb="2"
                    color="zinc400"
                    maxWidth="100%"
                    background="rgba(0, 0, 0, 0.1)"
                    _hover={{ background: 'rgba(0, 0, 0, 0.2)' }}
                    _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
                  >
                    <Droppable droppableId={list.name} type="item">
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          bg={
                            snapshot.isDraggingOver
                              ? 'rgba(0, 0, 0, 0.2)'
                              : 'inherit'
                          }
                          p="2"
                          borderRadius="md"
                        >
                          <Heading size="sm" mb="2" color="zinc300">
                            {list.name}
                          </Heading>
                          {list.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Flex
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  bg={
                                    snapshot.isDragging
                                      ? 'rgba(0, 0, 0, 0.4)'
                                      : 'rgba(0, 0, 0, 0.1)'
                                  }
                                  p="2"
                                  borderRadius="md"
                                  mb="2"
                                  color="zinc400"
                                  _hover={{ background: 'rgba(0, 0, 0, 1)' }}
                                  overflow="hidden"
                                  textOverflow="ellipsis"
                                  whiteSpace="nowrap"
                                  maxWidth="100%"
                                  alignItems="center"
                                  onClick={() => onItemClick(item)}
                                >
                                  <TagIcon
                                    fontSize="small"
                                    style={{ marginRight: '8px' }}
                                  />
                                  <Text>{item.name}</Text>
                                </Flex>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </Box>
                ))}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragAndDropList;
