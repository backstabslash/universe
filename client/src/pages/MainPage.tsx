/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Button,
	Center,
	Flex,
	Stack,
	Text,
	VStack,
	HStack,
	Box,
	Skeleton,
	Avatar,
	Spacer,
	SkeletonCircle,
} from "@chakra-ui/react";


import MainpageSvg from "../../public/svg/mainpageSvg";
import { BsArrowRightShort } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';


const MainPage = () => {


  const organisations = [
			{
				_id: "org1",
				name: "Organisation 1",
				coWorkers: ["worker1", "worker2", "worker3"],
			},
			{
				_id: "org2",
				name: "Organisation 2",
				coWorkers: ["worker4", "worker5"],
			},
			{
				_id: "org3",
				name: "Organisation 3",
				coWorkers: ["worker6", "worker7", "worker8", "worker9"],
			},
			{
				_id: "org4",
				name: "Organisation 4",
				coWorkers: ["worker6", "worker7", "worker8", "worker9"],
			},
			{
				_id: "org5",
				name: "Organisation 5",
				coWorkers: ["worker6", "worker7", "worker8", "worker9"],
			},
	];

  const userName = "Alex Faltin";
  const email ="viperr@onu.edu.ua"
  const isLoading = false;

  const navigate = useNavigate();

	return (
    <VStack h="100vh" w="100vw" bg="zinc900">
      <VStack spacing="2rem" mb="100rem" mt="6rem">
        <HStack mb="2rem">
          <Flex justify="end">
            <Stack align="start" w="70%" justify="center" mr="1rm">
              <Text fontSize="3rem" fontWeight={600} color="white">
                Get started on Universe
              </Text>
              <Text fontSize="1rem" mt="1.2rem" w="75%">
                it's a new way to communicate with everyone you work with. it's
                faster, better organized, and more secure than email - and it's
                free to try.
              </Text>
              <Spacer></Spacer>
              <Spacer></Spacer>
              <Stack>
                <Button
                  type="submit"
                  size="4rem"
                  px="2.2rem"
                  height="35px"
                  bg="zinc800"
                  color="zinc300"
                  _hover={{ bg: 'zinc700' }}
                  onClick={() => navigate('/')}
                >
                  {'Create Workspace'}
                </Button>
              </Stack>
            </Stack>
            <Flex align="center" justify="center"></Flex>
          </Flex>
          <Flex align="center" justify="start" w="60%">
            <MainpageSvg />
          </Flex>
        </HStack>

        <Box
          borderRadius="1.2rem"
          p="1.4rem"
          border="1px"
          mt="1rem"
          w="40%"
          mx="auto"
          maxH="200px"
        >
          {isLoading && (
            <Flex align="center" gap="2">
              <SkeletonCircle size="55" />
              <Stack spacing="1">
                <Skeleton height="5" width="330px" borderRadius="lg" />
                <Skeleton height="5" width="150px" borderRadius="lg" />
              </Stack>
            </Flex>
          )}
          {!isLoading && organisations?.length >= 1 && (
            <Text fontWeight="bold" color="white" mb="1.2rem">
              Open a workspace
            </Text>
          )}
          {!isLoading && organisations?.length === 0 ? (
            <Center>
              <Flex direction="column" align="center" justify="center">
                <Text fontSize="1rem" fontWeight={600} color="white">
                  is your team already on Slack?
                </Text>
                <Text fontSize=".8rem" mt=".6rem" w="75%" align="center">
                  We coudn't find any existing workspaces for the email address{' '}
                  {email}
                </Text>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  mt=".8rem"
                  px="1.4rem"
                  bg="zinc800"
                  color="zinc300"
                  _hover={{ bg: 'zinc700' }}
                >
                  Try a Different Email
                </Button>
              </Flex>
            </Center>
          ) : (
            <Stack maxH="65px" overflowY="auto">
              {!isLoading &&
                organisations?.map((organisation: any, index: number) => (
                  <Flex
                    pb=".8rem"
                    align="center"
                    key={organisation?._id}
                    style={{
                      borderBottom:
                        organisations.length - 1 === index
                          ? ''
                          : '1px solid #373A40',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Flex align="center" gap=".5rem">
                      <Avatar size="md" name={userName} borderRadius="1.4rem">
                        {organisation.name[0].toUpperCase()}
                      </Avatar>
                      <Flex direction="column">
                        <Text color="white" textTransform="capitalize">
                          {organisation.name}
                        </Text>
                        <Text fontSize=".8rem" textTransform="capitalize">
                          {organisation.coWorkers.length} members
                        </Text>
                      </Flex>
                    </Flex>
                    <Button
                      onClick={() => navigate('/')}
                      bg="zinc800"
                      color="zinc300"
                      _hover={{ bg: 'zinc700' }}
                      rightIcon={<BsArrowRightShort />}
                      variant="outline"
                      mr="1rem"
                    >
                      Open
                    </Button>
                  </Flex>
                ))}
            </Stack>
          )}
        </Box>
      </VStack>
    </VStack>
  )

};

export default MainPage;
