import { useState, useEffect } from 'react';
import {
  Flex,
  Input,
  HStack,
  Text,
  Box,
  CloseButton,
  List,
  ListItem,
} from '@chakra-ui/react';
import useWorkSpaceStore from '../store/workSpace';
const UserRoleFilter = ({ onFilterChange }: any): JSX.Element => {
  const { getAllWorkSpaceRoles, workSpaceData } = useWorkSpaceStore(
    state => state
  );
  const [filters, setFilters] = useState<any>([]);
  const [newFilter, setNewFilter] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any>([]);
  const [availableRoles, setAvailableRoles] = useState<any>();

  useEffect(() => {
    if (workSpaceData?.workSpaceName) {
      getAllRolles();
    }
  }, []);

  const getAllRolles = async (): Promise<void> => {
    if (workSpaceData?.workSpaceName) {
      const allRoles = await getAllWorkSpaceRoles(workSpaceData?.workSpaceName);
      setAvailableRoles(allRoles);
      console.log(allRoles);
    }
  };
  useEffect(() => {
    if (newFilter) {
      const filteredSuggestions = availableRoles?.filter(
        (role: any) =>
          role?.name?.toLowerCase().includes(newFilter.toLowerCase()) &&
          !filters.includes(role.name)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [newFilter, availableRoles, filters]);

  const addFilter = (filter: string): void => {
    if (filter && !filters.includes(filter)) {
      const updatedFilters = [...filters, filter];
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
      setNewFilter('');
      setSuggestions([]);
    }
  };

  const removeFilter = (filterToRemove: any): void => {
    const updatedFilters = filters.filter(
      (filter: any) => filter !== filterToRemove
    );
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Box>
      <HStack mb={4}>
        <Input
          value={newFilter}
          onChange={e => setNewFilter(e.target.value)}
          placeholder="Add a role filter"
          fontSize={'md'}
          background="rgba(0, 0, 0, 0.5)"
          borderColor="transparent"
          color="zinc300"
          _placeholder={{ color: 'zinc300' }}
          _focusVisible={{ borderColor: '' }}
          _hover={{ borderColor: '', background: 'rgba(0, 0, 0, 0.3)' }}
        />
      </HStack>
      {suggestions?.length > 0 && (
        <List background="rgba(0, 0, 0, 0.3)" borderRadius="md" p={2} mb={4}>
          {suggestions.map((suggestion: any, index: any) => (
            <ListItem
              key={index}
              p={2}
              _hover={{ bg: 'rgba(0, 0, 0, 0.4)' }}
              cursor="pointer"
              onClick={() => addFilter(suggestion.name)}
            >
              {suggestion.name}
            </ListItem>
          ))}
        </List>
      )}
      <Flex wrap="wrap">
        {filters.map((filter: any) => (
          <HStack
            key={filter}
            bg="blue.500"
            color="white"
            p={2}
            m={1}
            borderRadius="md"
          >
            <Text>{filter}</Text>
            <CloseButton size="sm" onClick={() => removeFilter(filter)} />
          </HStack>
        ))}
      </Flex>
    </Box>
  );
};

export default UserRoleFilter;
