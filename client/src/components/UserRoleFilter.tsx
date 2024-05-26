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
import { api } from '../config/config';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const UserRoleFilter = ({ onFilterChange }: any): JSX.Element => {
  const axiosPrivate = useAxiosPrivate();
  const [filters, setFilters] = useState<any>([]);
  const [newFilter, setNewFilter] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoles = async (): Promise<void> => {
      try {
        const response = await axiosPrivate?.get(`${api.url}/user/roles`);
        setAvailableRoles(response.data.map((role: any) => role.name));
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (newFilter) {
      const filteredSuggestions = availableRoles.filter(
        (role: string) =>
          role.toLowerCase().includes(newFilter.toLowerCase()) &&
          !filters.includes(role)
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
      {suggestions.length > 0 && (
        <List background="rgba(0, 0, 0, 0.3)" borderRadius="md" p={2} mb={4}>
          {suggestions.map((suggestion, index) => (
            <ListItem
              key={index}
              p={2}
              _hover={{ bg: 'rgba(0, 0, 0, 0.4)' }}
              cursor="pointer"
              onClick={() => addFilter(suggestion)}
            >
              {suggestion}
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
