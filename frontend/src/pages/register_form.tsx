import {
    SimpleGrid, Box, Text, Center, VStack, HStack, Button, ChakraProvider, FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from 'react';

export const RegisterForm = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const submitValues = () => {
        const user = {
            name : name,
            password : password,
            email : email,
            user_type : "student"
        }
        navigate("/register", {state : user});
    }
    
    return (
        <>
            <ChakraProvider>
                <Center>
                    <VStack>
                        <Text as='b' fontSize="6xl">Registration</Text>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input value={name} onChange={(e) => setName(e.target.value)} type='text' />
                            <FormLabel>Email address</FormLabel>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} type='email' />
                            <FormLabel>Password</FormLabel>
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
                            <FormLabel></FormLabel>
                            <Button onClick={submitValues} type="submit" colorScheme='teal'>
                                Submit
                            </Button>
                        </FormControl>
                    </VStack>
                </Center>
            </ChakraProvider>
        </>
    );
}