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
} from '@chakra-ui/react'

import MainpageSvg from '../../public/svg/mainpageSvg'
import { BsArrowRightShort } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

const MainPage = (): JSX.Element => {
  const organisations = [
    {
      _id: 'org1',
      name: 'Organisation 1',
      coWorkers: ['worker1', 'worker2', 'worker3'],
    },
    {
      _id: 'org2',
      name: 'Organisation 2',
      coWorkers: ['worker4', 'worker5'],
    },
    {
      _id: 'org3',
      name: 'Organisation 3',
      coWorkers: ['worker6', 'worker7', 'worker8', 'worker9'],
    },
    {
      _id: 'org4',
      name: 'Organisation 4',
      coWorkers: ['worker6', 'worker7', 'worker8', 'worker9'],
    },
    {
      _id: 'org5',
      name: 'Organisation 5',
      coWorkers: ['worker6', 'worker7', 'worker8', 'worker9'],
    },
  ]

  const userName = 'Alex Faltin'
  const email = 'viperr@onu.edu.ua'
  const isLoading = false

  const navigate = useNavigate()

  return (
    <VStack h="100vh" w="100vw" bg="zinc900">
      <VStack spacing="2rem" mb="100rem" mt="6rem">
        <HStack mb="2rem">
          <Flex justify="end">
            <Stack align="start" w="70%" justify="center" mr="1rm">
              <Text fontSize="3rem" fontWeight={600} color="zinc300">
                Get started on Universe
              </Text>
              <Text fontSize="1rem" mt="1.2rem" w="75%" color="zinc300">
                It&apos;s a new way to communicate with everyone you work with.
                It&apos;s faster, better organized, and more secure than email -
                and it&apos;s free to try.
              </Text>
              <Spacer></Spacer>
              <Spacer></Spacer>
              <Stack>
                <Button
                  type="submit"
                  height="40px"
                  bg="zinc800"
                  color="zinc300"
                  _hover={{ bg: 'zinc700' }}
                  onClick={() => {
                    navigate('/reg/companyname')
                  }}
                  size="md"
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
          border="1px"
          borderColor="zinc700"
          p="1.4rem"
          mt="1rem"
          w="40%"
          mx="auto"
          h="21vh"
        >
          {isLoading && (
            <Flex align="center" gap="2">
              <SkeletonCircle size="55" color="zinc800" />
              <Stack spacing="1">
                <Skeleton
                  height="5"
                  width="330px"
                  borderRadius="lg"
                  color="zinc800"
                />
                <Skeleton
                  height="5"
                  width="150px"
                  borderRadius="lg"
                  color="zinc800"
                />
              </Stack>
            </Flex>
          )}
          {!isLoading && organisations?.length >= 1 && (
            <Text fontWeight="bold" color="zinc300" mb="1rem">
              Open a workspace
            </Text>
          )}
          {!isLoading && organisations?.length === 0 ? (
            <Center>
              <Flex direction="column" align="center" justify="center">
                <Text fontSize="1rem" fontWeight={600} color="zinc300">
                  is your team already on Slack?
                </Text>
                <Text
                  fontSize=".8rem"
                  mt=".6rem"
                  w="75%"
                  align="center"
                  color="zinc300"
                >
                  We couldn&apos;t find any existing workspaces for the email
                  address {email}
                </Text>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  mt=".8rem"
                  px="1.4rem"
                  bg="zinc800"
                  color="zinc300"
                  _hover={{ bg: 'zinc700' }}
                  borderColor="zinc300"
                >
                  Try a Different Email
                </Button>
              </Flex>
            </Center>
          ) : (
            <Stack maxH="13vh" overflowY="auto">
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
                      <Avatar
                        size="md"
                        name={userName}
                        borderRadius="1.4rem"
                        color="zinc300"
                      >
                        {organisation.name[0].toUpperCase()}
                      </Avatar>
                      <Flex direction="column">
                        <Text color="zinc300" textTransform="capitalize">
                          {organisation.name}
                        </Text>
                        <Text
                          fontSize=".8rem"
                          textTransform="capitalize"
                          color="zinc300"
                        >
                          {organisation.coWorkers.length} members
                        </Text>
                      </Flex>
                    </Flex>
                    <Button
                      onClick={() => {
                        navigate('/')
                      }}
                      bg="zinc800"
                      color="zinc300"
                      _hover={{ bg: 'zinc700' }}
                      borderColor="transparent"
                      // rightIcon={<BsArrowRightShort />}
                      variant="outline"
                      mr="10px"
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
}

export default MainPage
