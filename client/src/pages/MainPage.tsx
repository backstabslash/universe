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
} from "@chakra-ui/react";


import MainpageSvg from "../../public/svg/mainpageSvg";
import { BsArrowRightShort } from "react-icons/bs";
// import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";


const MainPage = () => {
  const router = useRouter()
//   const [email, setEmail] = React.useState('')
//   const setData = {}

//   const mutation = useMutation({
//     mutationFn: () => {
//       return axios.post('/organisation')
//     },
//     onError(error: ApiError) {
//       notifications.show({
//         message: error?.response?.data?.data?.name,
//         color: 'red',
//         p: '1.6rem',
//       })
//     },
//     onSuccess(data) {
//       router.push(`${data?.data?.data?._id}`)
//     },
//   })

//   const query = useQuery(
//     ['workspaces'],
//     () => axios.get(`/organisation/workspaces`),
//     {
//       refetchOnMount: false,
//       enabled: !!email,
//     }
//   )

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
  const email ="spidrr@onu.edu.ua"
  const isLoading = false;

//   function handleOpenWorkspace(organisation: Data) {
//     setData(undefined)
//     localStorage.setItem('organisationId', organisation?._id)
//     router.push(`/c/${organisation?.channels?.[0]?._id}`)
//     localStorage.setItem('channel', 'true')
//   }

//   React.useEffect(() => {
//     if (router.query.token) {
//       setEmail(router.query.email as string)
//       localStorage.setItem('signUpEmail', router.query?.email as string)
//       localStorage.setItem('access-token', router?.query?.token as string)
//     }
//   }, [router.query.token])
//   React.useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setEmail(localStorage.getItem('signUpEmail') as string)

//       const signUpEmail = localStorage.getItem('signUpEmail')
//       if (!signUpEmail) {
//         // router.push('/signin')
//       }
//     }
//   }, [])
	return (
		<Center p="2.4rem" h="100vh" w="100vw" fontFamily="Epilogue, sans-serif">
			<VStack spacing="10rem" mb="20rem">
				<Center>
					<Text fontSize="4rem" fontWeight={600} color="white">
						Viperr
					</Text>
				</Center>
				<HStack>
					<Flex justify="center">
						<Stack spacing="2rem" align="start" w="70%" justify="center">
							<Text fontSize="4rem" fontWeight={600} color="white">
								Get started on Viperr
							</Text>
							<Text fontSize="1.4rem" mt="1.2rem" w="75%">
								it's a new way to communicate with everyone you work with. it's
								faster, better organized, and more secure than email - and it's
								free to try.
							</Text>
							<Stack>
								<Button
									colorScheme="blue"
									type="submit"
									size="2rem"
									px="2.2rem"
									height="35px"
									onClick={() => router.push("/signin")}
								>
									{"Create Workspace"}
								</Button>
							</Stack>
						</Stack>
						<Flex align="center" justify="center"></Flex>
					</Flex>
					<Flex align="center" justify="center" w="70%">
						<MainpageSvg />
					</Flex>
				</HStack>

				<Box
					borderRadius="1.8rem"
					p="2.8rem"
					border="1px"
					mt="2.2rem"
					w="50%"
					mx="auto"
					maxH="500px"
				>
					{isLoading && (
						<Flex align="center" gap=".8rem">
							<Skeleton isLoaded={false} size="2rem" />
							<VStack spacing=".4rem">
								<Skeleton height="24px" width="550px" borderRadius="1.8rem" />
								<Skeleton height="24px" width="250px" borderRadius="1.8rem" />
							</VStack>
						</Flex>
					)}
					{!isLoading && organisations?.length >= 1 && (
						<Text fontWeight="bold" color="white" mb="2.2rem">
							Open a workspace
						</Text>
					)}
					{!isLoading && organisations?.length === 0 ? (
						<Center>
							<Flex direction="column" align="center" justify="center">
								<Text fontSize="1.8rem" fontWeight={600} color="white">
									is your team already on Slack?
								</Text>
								<Text fontSize="1.4rem" mt="1.2rem" w="75%" align="center">
									We coudn't find any existing workspaces for the email address{" "}
									{email}
								</Text>
								<Button
									colorScheme="blue"
									variant="outline"
									mt="1.8rem"
									px="2.8rem"
									// onClick={() => router.push("/signin")}
								>
									Try a Different Email
								</Button>
							</Flex>
						</Center>
					) : (
						<Stack maxH="120px" overflowY="auto">
							{!isLoading &&
								organisations?.map((organisation: any, index: number) => (
									<Flex
										pb="1.6rem"
										align="center"
										key={organisation?._id}
										style={{
											borderBottom:
												organisations.length - 1 === index
													? ""
													: "1px solid #373A40",
											justifyContent: "space-between",
										}}
									>
										<Flex align="center" gap=".8rem">
											<Avatar
												size="lg"
												name={userName}
												// color={getColorByIndex(index)}
												borderRadius="2.4rem"
											>
												{organisation.name[0].toUpperCase()}
											</Avatar>
											<Flex direction="column">
												<Text color="white" textTransform="capitalize">
													{organisation.name}
												</Text>
												<Text fontSize="1.2rem" textTransform="capitalize">
													{organisation.coWorkers.length} members
												</Text>
											</Flex>
										</Flex>
										<Button
											// onClick={() => handleOpenWorkspace(organisation)}
											rightIcon={<BsArrowRightShort />}
											variant="outline"
										>
											Open
										</Button>
									</Flex>
								))}
						</Stack>
					)}
				</Box>
			</VStack>
		</Center>
	);

};

export default MainPage;
