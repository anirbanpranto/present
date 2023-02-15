import { ChakraProvider } from "@chakra-ui/react";
import { VideoCanvas } from "../components/video";
import { useLocation } from "react-router-dom";

export const Register = () => {
    const {state} = useLocation();
    return (
        <>
        <ChakraProvider>
            <VideoCanvas user={state} register={true}></VideoCanvas>
        </ChakraProvider>
        </>
    );
}