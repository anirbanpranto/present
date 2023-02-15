import { ChakraProvider } from "@chakra-ui/react";
import { VideoCanvas } from "../components/video";
import { predict } from "../utils/predict";

export const Predict = () => {
    return (
        <>
            <ChakraProvider>
            <VideoCanvas predict={true}></VideoCanvas>
            </ChakraProvider>
        </>
    );
}