import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  HStack,
  Flex,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/RegSidebar'

const CompanyName = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Box flexDirection="column" height="100vh" bg="zinc900">
      <HStack mr={'30px'} alignItems="flex-start">
        <Sidebar />
        <Flex ml="80px" flexDirection="column" alignItems="flex-start">
          <Text fontSize="15px" color="zinc300" mb="40px" mt="25px">
            Step 1 of 3
          </Text>
          <Heading
            flex="1"
            fontSize="4xl"
            borderColor="zinc600"
            borderRadius="md"
            textAlign="left"
            mr="640px"
            color="zinc300"
          >
            What&apos;s the name of your company or team
          </Heading>
          <Text fontSize="sm" w="75%" color="zinc300">
            This will be the name of your Slack workspace - choose something
            that your team will recognize.
          </Text>
          <Text fontSize="lg" mt="1.2rem" w="75%" color="zinc300" mb="10px">
            Name{' '}
            <Text as="span" color="red">
              *
            </Text>
          </Text>
          <Input
            flex="1"
            placeholder="Ex: ONU or Odessa National University"
            fontSize="lg"
            bg="zinc800"
            borderRadius="md"
            border={'0'}
            _focusVisible={{ borderColor: 'zinc600' }}
            w="680px"
            minH="50px"
            mb="10px"
            color="zinc300"
          />
          <Button
            w="100px"
            bg="zinc800"
            color="zinc300"
            _hover={{ bg: 'zinc700' }}
            onClick={() => {
              navigate('/reg/coworkers')
            }}
          >
            Next
          </Button>
        </Flex>
      </HStack>
    </Box>
  )
}
export default CompanyName
