import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Link,
  Spacer,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon, ChevronDownIcon } from "@chakra-ui/icons";

function UserProfile() {
  return (
    <Box backgroundColor="#1a1d21" color="white" p={1}>
      <Box border="1px solid #57595d" borderTopRightRadius="md">
        <HStack borderBottom="1px solid #57595d" p={3}>
          <Text fontSize="xl" fontWeight="bold">
            Profile
          </Text>
          <Spacer />
          <Button
            backgroundColor="#1a1d21"
            color="white"
            _hover={{ backgroundColor: "#2a2d31" }}
            _active={{ backgroundColor: "#313438" }}
          >
            <CloseIcon />
          </Button>
        </HStack>

        <VStack align="start">
          <Image src="your-image-url" alt="Profile banner" alignSelf="center" />
          <VStack width="100%" align="start" borderBottom="1px solid #57595d" spacing={4} p={3}>
            <VStack width="100%" align="start" spacing={1}>
              <HStack width="100%">
                <Text fontSize="2xl" fontWeight="bold">
                  sherpak /
                </Text>
                <Spacer />
                <Link color="#1d9bd1" _hover={{ color: "#23bdff", textDecoration: "underline" }}>
                  Edit
                </Link>
              </HStack>
              <Text>Мальчик like чел</Text>
              <Link color="#1d9bd1" _hover={{ color: "#23bdff" }}>
                <HStack>
                  <AddIcon fontSize="small" />
                  <Text>Add name pronunciation</Text>
                </HStack>
              </Link>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text>Active</Text>
              <Text>3:02 PM local time</Text>
            </VStack>
            <HStack width="100%">
              <Button
                flex={1}
                backgroundColor="#1a1d21"
                color="white"
                border="1px solid #57595d"
                _hover={{ backgroundColor: "#2a2d31" }}
                _active={{ borderColor: "#cccccc" }}
              >
                Set a status
              </Button>
              <Box flex={1}>
                <Menu placement="bottom-end">
                  <MenuButton
                    width="100%"
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    backgroundColor="#1a1d21"
                    color="white"
                    border="1px solid #57595d"
                    _hover={{ backgroundColor: "#2a2d31" }}
                    _active={{ borderColor: "#cccccc" }}
                  >
                    View as
                  </MenuButton>
                  <MenuList backgroundColor="#222529">
                    <MenuItem backgroundColor="#222529" _hover={{ backgroundColor: "#1264a3" }}>
                      A coworker at Universe
                    </MenuItem>
                    <MenuItem backgroundColor="#222529" _hover={{ backgroundColor: "#1264a3" }}>
                      A contact from other organizations
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
              <Box>
                <Menu placement="bottom-end">
                  <MenuButton
                    width="100%"
                    as={Button}
                    backgroundColor="#1a1d21"
                    color="white"
                    border="1px solid #57595d"
                    _hover={{ backgroundColor: "#2a2d31" }}
                    _active={{ borderColor: "#cccccc" }}
                  >
                    ⋮
                  </MenuButton>
                  <MenuList backgroundColor="#222529">
                    <MenuItem backgroundColor="#222529" _hover={{ backgroundColor: "#1264a3" }}>
                      A coworker at Universe
                    </MenuItem>
                    <MenuItem backgroundColor="#222529" _hover={{ backgroundColor: "#1264a3" }}>
                      A contact from other organizations
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </HStack>
          </VStack>
          <VStack width="100%" align="start" borderBottom="1px solid #57595d" spacing={4} p={3}>
            <HStack width="100%" justifyContent="space-between">
              <Text fontWeight="bold">Contact information</Text>
              <Link color="#1d9bd1" _hover={{ color: "#23bdff", textDecoration: "underline" }}>
                Edit
              </Link>
            </HStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="small" color="#9e9fa1">
                Email address
              </Text>
              <Link color="#1d9bd1" _hover={{ color: "#23bdff", textDecoration: "underline" }}>
                vladislav.rupets@gmail.com
              </Link>
            </VStack>
            <Link color="#1d9bd1" _hover={{ color: "#23bdff" }}>
              <HStack>
                <AddIcon fontSize="small" />
                <Text>Add phone</Text>
              </HStack>
            </Link>
          </VStack>
          <VStack width="100%" align="start" borderBottom="1px solid #57595d" spacing={4} p={3}>
            <HStack width="100%" justifyContent="space-between">
              <Text fontWeight="bold">About me</Text>
              <Link color="#1d9bd1" _hover={{ color: "#23bdff", textDecoration: "underline" }}>
                Edit
              </Link>
            </HStack>
            <Link color="#1d9bd1" _hover={{ color: "#23bdff" }}>
              <HStack>
                <AddIcon fontSize="small" />
                <Text>Add start date</Text>
              </HStack>
            </Link>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}

export default UserProfile;
