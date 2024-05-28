import { Flex, Heading, VStack, Text } from '@chakra-ui/react';
import TagIcon from '@mui/icons-material/Tag';
import useWorkSpaceStore from '../store/workSpace';
import { useEffect, useState } from 'react';

const Sidebar = (): JSX.Element => {
  const { getWorkspaceTemplates } = useWorkSpaceStore(state => state);
  const [workspaceTemplates, setWorkspaceTemplates] = useState<any[]>([]);
  const fetchWorkspaceTemplates = async (): Promise<void> => {
    const templates = await getWorkspaceTemplates();
    setWorkspaceTemplates(templates);
    console.log(templates);
  };
  useEffect(() => {
    fetchWorkspaceTemplates();
  }, []);

  return (
    <VStack
      padding="5"
      bg="zinc900"
      color="zinc300"
      maxWidth="300px"
      borderRight="1px"
      borderColor="zinc600"
      height={'100vh'}
      spacing={4}
      overflowY={'auto'}
    >
      <Flex
        mb="3"
        fontSize="2xl"
        width="100%"
        color="zinc300"
        p="15px"
        pt="18px"
        justifyContent={'space-between'}
        alignItems={'center'}
        h="60px"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        <b>Organization</b>
      </Flex>
      <Heading mb="2" fontSize="md" width="100%" pr="15px" pl="15px">
        Channels
      </Heading>
      {workspaceTemplates?.length > 0 &&
        workspaceTemplates?.map((group, groupIndex) => (
          <VStack
            key={groupIndex}
            width="100%"
            alignItems="flex-start"
            spacing={2}
          >
            <Text fontWeight="bold" pl="15px" pr="15px">
              {group.groupName}
            </Text>
            {group.channels?.map((channel: any, channelIndex: number) => (
              <Flex
                key={channelIndex}
                p="2"
                pr="15px"
                pl="15px"
                borderRadius="md"
                background="rgba(0, 0, 0, 0.1)"
                color="zinc400"
                _hover={{ background: 'trasparent' }}
                width="90%"
                gap="5px"
                alignItems={'center'}
                justifyContent={'flex-start'}
              >
                <TagIcon fontSize="small" />
                {channel.name}
              </Flex>
            ))}
          </VStack>
        ))}
    </VStack>
  );
};

export default Sidebar;
