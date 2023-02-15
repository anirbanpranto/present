import { SimpleGrid, Box, Text, Center, VStack, HStack, Button, ChakraProvider } from '@chakra-ui/react'

export const Home = () => {
    return (
        <>
            <ChakraProvider>
                <Center>
                    <VStack>
                        <Text as='b' fontSize="8xl">Attend!</Text>
                        <HStack>
                            <a href='/form'><Button>Register</Button></a>
                            <a href='/attendance'><Button>Attendance</Button></a>
                        </HStack>
                    </VStack>
                </Center>
            </ChakraProvider>

        </>
    );
}