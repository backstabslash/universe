import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from 'react-beautiful-dnd';
import { Box, Flex, HStack, Heading, Text, IconButton } from '@chakra-ui/react';
import TagIcon from '@mui/icons-material/Tag';
import { DeleteIcon } from '@chakra-ui/icons';

interface DragAndDropListProps {
  itemLists: List[];
  setItemLists: (itemLists: List[]) => void;
  onItemClick: (id: string, name: string, userId: string) => void;
  setGroupsChanged: (groupsChanged: boolean) => void;
  onDeleteList: (id: string) => void;
  activeChannel: string | null;
}

interface List {
  id: string;
  name: string;
  items: Item[];
}

interface Item {
  id: string;
  name: string;
}

const DragAndDropList = ({
  activeChannel,
  itemLists,
  setItemLists,
  onItemClick,
  setGroupsChanged,
  onDeleteList,
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
      setGroupsChanged(true);
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
      setGroupsChanged(true);
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
      setGroupsChanged(true);
    }
  };

  return (
    <Flex w={'100%'}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" type="list" direction="vertical">
          {provided => (
            <Flex
              ref={provided.innerRef}
              width={'100%'}
              flexDirection="column"
              overflow={'auto'}
              {...provided.droppableProps}
            >
              {itemLists.length > 0 &&
                itemLists.map((list, index) => (
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
                        bg={`${snapshot.isDragging ? 'zinc950' : 'zinc925'}`}
                        p="10px"
                        color="zinc400"
                        width={'100%'}
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
                              borderRadius="md"
                            >
                              <HStack
                                w={'100%'}
                                justifyContent={'space-between'}
                                mb={'10px'}
                              >
                                <Heading
                                  overflow="hidden"
                                  textOverflow="ellipsis"
                                  whiteSpace="nowrap"
                                  size="sm"
                                  ml={'10px'}
                                  color="zinc300"
                                >
                                  {list.name}
                                </Heading>
                                {list.name !== 'General' &&
                                  list.items.length === 0 && (
                                    <IconButton
                                      aria-label="DeleteGroup"
                                      icon={<DeleteIcon />}
                                      bg="transparent"
                                      _hover={{ background: 'none' }}
                                      _active={{ background: 'none' }}
                                      color={'zinc400'}
                                      onClick={() => onDeleteList(list.id)}
                                    />
                                  )}
                              </HStack>

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
                                        activeChannel === item.id
                                          ? 'rgba(0, 0, 0, 0.6)'
                                          : snapshot.isDragging
                                            ? 'rgba(0, 0, 0, 0.4)'
                                            : 'rgba(0, 0, 0, 0.1)'
                                      }
                                      p={'10px'}
                                      borderRadius="md"
                                      mb="2"
                                      color={
                                        activeChannel === item.id
                                          ? 'white'
                                          : 'zinc400'
                                      }
                                      _hover={{
                                        background: 'rgba(0, 0, 0, 1)',
                                      }}
                                      overflow="hidden"
                                      textOverflow="ellipsis"
                                      whiteSpace="nowrap"
                                      maxWidth="100%"
                                      alignItems="center"
                                      onClick={() =>
                                        onItemClick(item.id, item.name, '')
                                      }
                                    >
                                      <TagIcon
                                        fontSize="small"
                                        style={{ marginRight: '8px' }}
                                      />
                                      <Text
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                      >
                                        {item.name}
                                      </Text>
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
                ))}
              {provided.placeholder}
            </Flex>
          )}
        </Droppable>
      </DragDropContext>
    </Flex>
  );
};

export default DragAndDropList;
