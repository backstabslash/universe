import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  List,
  ListItem,
  useDisclosure,
  Button,
  Flex,
  Image,
  Text,
  Input,
  Divider,
  Spinner,
  HStack,
  CloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import UserRoleFilter from './UserRoleFilter';
import useWorkSpaceStore from '../store/workSpace';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ManageUserRolesModal = (): any => {
  const axiosPrivate = useAxiosPrivate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    setAxiosPrivate: setAxiosPrivateWorkspace,
    getWorkspaceUsers,
    users: workspaceUsers,
    getAllWorkSpaceRoles,
    // addRolesToUsers,
    workSpaceData,
  } = useWorkSpaceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<any>([]);
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [availableRoles, setAvailableRoles] = useState<any>();
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [dataFetched, setDataFetched] = useState(false);
  const [roleError, setRoleError] = useState<string>('');

  const [filterRoles, setFilterRoles] = useState([]);

  useEffect(() => {
    setAxiosPrivateWorkspace(axiosPrivate);
  }, [axiosPrivate]);

  const handleOpen = async (): Promise<void> => {
    onOpen();
    await getWorkspaceUsers();
    await fetchAvailableRoles();
    setDataFetched(true);
  };

  const fetchAvailableRoles = async (): Promise<void> => {
    if (workSpaceData?.workSpaceName) {
      const roles = await getAllWorkSpaceRoles(workSpaceData.workSpaceName);
      setAvailableRoles(roles);
    }
  };

  const handleSearchChange = (event: any): any => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleRoleSearchChange = (event: any): any => {
    setRoleSearchQuery(event.target.value.toLowerCase());
  };

  const handleRoleFilterChange = (filters: any): void => {
    setFilterRoles(filters);
  };

  const filteredUsersList = searchQuery
    ? workspaceUsers?.filter((user: any) => {
        const matchesSearch =
          user?.name?.toLowerCase().includes(searchQuery) ||
          user?.tag?.toLowerCase()?.includes(searchQuery);
        const matchesRoleFilter =
          filterRoles.length === 0 ||
          filterRoles.every(role => user.userRole.includes(role));
        return matchesSearch && matchesRoleFilter;
      })
    : filterRoles.length > 0
      ? workspaceUsers?.filter((user: any) =>
          filterRoles.every(role => user.userRole.includes(role))
        )
      : workspaceUsers;

  const filteredRolesList = roleSearchQuery
    ? availableRoles.filter((role: string) =>
        role?.name?.toLowerCase().includes(roleSearchQuery)
      )
    : [];

  const handleUserSelect = (user: any): void => {
    const isAlreadySelected = selectedUsers.some(
      (selectedUser: any) => selectedUser._id === user._id
    );
    if (!isAlreadySelected) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(
        selectedUsers.filter(
          (selectedUser: any) => selectedUser._id !== user._id
        )
      );
    }
  };

  const addRoleToUser = (role: string): void => {
    if (role && !selectedRoles.includes(role)) {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const removeRoleFromUser = (roleToRemove: string): void => {
    setSelectedRoles(
      selectedRoles.filter((role: any) => role !== roleToRemove)
    );
  };

  const handleAddRolesToUsers = async (): Promise<void> => {
    try {
      if (!selectedUsers.length || !selectedRoles.length) {
        setRoleError('Please select at least one user and one role.');
        return;
      }
      // await addRolesToUsers(
      //   selectedUsers.map(user => user._id),
      //   selectedRoles
      // );
      setSelectedUsers([]);
      setSelectedRoles([]);
      setSearchQuery('');
      onClose();
    } catch (error: any) {
      setRoleError(error.message || 'An error occurred');
      console.error(error);
    }
  };

  return (
    <>
      <Button
        size="md"
        mr="2"
        bg="transparent"
        color="zinc300"
        _active={{ background: 'rgba(0, 0, 0, 0.4)' }}
        onClick={() => {
          handleOpen();
        }}
        _hover={{ background: 'rgba(0, 0, 0, 0.1)' }}
      >
        Manage user roles
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="zinc900" color="zinc200">
          <ModalHeader>Manage User Roles</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="75vh" overflowY="auto">
            <Flex alignItems={'center'} justifyContent={'space-between'} mb="3">
              <Input
                placeholder="Search for users"
                onChange={handleSearchChange}
                value={searchQuery}
                fontSize={'md'}
                background="rgba(0, 0, 0, 0.5)"
                borderColor="transparent"
                height="40px"
                width="95%"
                color="zinc300"
                _placeholder={{ color: 'zinc300' }}
                _focusVisible={{ borderColor: '' }}
                _hover={{ borderColor: '', background: 'rgba(0, 0, 0, 0.3)' }}
              />
              <Button
                color="zinc500"
                fontWeight="bold"
                variant="ghost"
                _hover={{ background: 'transparent' }}
                ml="16px"
                p="0"
                onClick={() => setSearchQuery('')}
              >
                CLEAR
              </Button>
            </Flex>
            <UserRoleFilter onFilterChange={handleRoleFilterChange} />
            <List spacing={3} mt="10px">
              {filteredUsersList?.map((user: any) => (
                <ListItem key={user._id}>
                  <Flex
                    align="center"
                    cursor="pointer"
                    onClick={() => {
                      handleUserSelect(user);
                    }}
                  >
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src={user.pfp_url || 'https://i.imgur.com/zPKzLoe.gif'}
                      alt="Profile Image"
                      mr="12px"
                    />
                    <Text fontWeight="bold">
                      {user.name} {user.tag ? `@${user.tag}` : ''}
                    </Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
            <Divider
              orientation="horizontal"
              borderColor="zinc500"
              h="90%"
              m="0"
              p="0"
              mb="3"
              mt="3"
            />
            {!dataFetched ? (
              <Flex
                justifyContent="center"
                alignItems="center"
                w="100%"
                h="auto"
              >
                <Spinner size="lg" thickness="4px" speed="0.5s" />
              </Flex>
            ) : (
              <>
                <List spacing={3}>
                  {selectedUsers.map((user: any) => (
                    <ListItem key={user._id}>
                      <Flex
                        align="center"
                        cursor="pointer"
                        onClick={() => handleUserSelect(user)}
                      >
                        <Image
                          borderRadius="full"
                          boxSize="40px"
                          src={
                            user.pfp_url || 'https://i.imgur.com/zPKzLoe.gif'
                          }
                          alt="Profile Image"
                          mr="12px"
                        />
                        <Flex justifyContent={'space-between'} w="100%">
                          <Text fontWeight="bold">
                            {user.name} {user.tag ? `@${user.tag}` : ''}
                          </Text>
                          <Text fontWeight="bold" color="#23bdff">
                            SELECTED
                          </Text>
                        </Flex>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
                <FormControl mt="4">
                  <FormLabel>Select roles to assign</FormLabel>
                  <Input
                    placeholder="Search for roles"
                    onChange={handleRoleSearchChange}
                    value={roleSearchQuery}
                    fontSize={'md'}
                    background="rgba(0, 0, 0, 0.5)"
                    borderColor="transparent"
                    height="40px"
                    width="100%"
                    color="zinc300"
                    _placeholder={{ color: 'zinc300' }}
                    _focusVisible={{ borderColor: '' }}
                    _hover={{
                      borderColor: '',
                      background: 'rgba(0, 0, 0, 0.3)',
                    }}
                  />
                  {roleSearchQuery && (
                    <List spacing={3} mt="10px">
                      {filteredRolesList.map((role, index) => (
                        <ListItem
                          key={index}
                          p={2}
                          onClick={() => addRoleToUser(role)}
                        >
                          <Text cursor="pointer" _hover={{ color: 'blue.500' }}>
                            {role}
                          </Text>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </FormControl>
                <Flex wrap="wrap" mt="4">
                  {selectedRoles.map((role: any, index: any) => (
                    <HStack
                      key={index}
                      bg="blue.500"
                      color="white"
                      p={2}
                      m={1}
                      borderRadius="md"
                    >
                      <Text>{role}</Text>
                      <CloseButton
                        size="sm"
                        onClick={() => removeRoleFromUser(role)}
                      />
                    </HStack>
                  ))}
                </Flex>
              </>
            )}
            {roleError && <Text color="red.500">{roleError}</Text>}
          </ModalBody>
          <ModalFooter>
            <Button
              background="zinc700"
              _hover={{ background: 'zinc800' }}
              color="zinc300"
              mr={3}
              onClick={() => {
                handleAddRolesToUsers();
              }}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManageUserRolesModal;
