import { Predict } from './pages/predict';
import { ChakraProvider } from '@chakra-ui/react';
import { Register } from './pages/register';
import { Home } from './pages/home';

export const App = () => {
  return (
    <>
    <ChakraProvider>
      <Home/>
    </ChakraProvider>
    </>
  );
};