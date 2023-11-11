import {
  Box,
  VStack,
  Container,
  Spinner,
  Text,
  useColorModeValue,
  Center
} from '@chakra-ui/react';
import Bot3dHandsUp from '@/images/ilustrations/bot-3d-hands-up.png';
import Image from 'next/image';
import React from 'react';

const LoadingTexts = [
  'Investigando acerca del tema 🤔...',
  'Buscando información en internet 🌐...',
  'Generando titulos para el documento 📝...',
  'Generando contenido para el documento 📄...',
  'Formateando el documento 📑...',
]

export default function CreationLoader({isOpen}: {isOpen: boolean}) {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const [loadingText, setLoadingText] = React.useState(LoadingTexts[0]);

  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= LoadingTexts.length) {
        i = 0;
      }
      setLoadingText(LoadingTexts[i]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <>
      {isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="21474831004"
          bg={bgColor}
        >
          <Container position="relative" maxW="container.xl">
            <Box
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                size="xl"
                w="16rem"
                h="16rem"
                color="brand.400"
              />
            </Box>
            <Box
              position="fixed"
              top="50.8%"
              left="49.8%"
              transform="translate(-50%, -50%)"
            >
              <Image
                src={Bot3dHandsUp}
                alt="Julliet.ai winks"
                width={150}
                height={150}
                quality={50}
              />
            </Box>
            <Box
              position="fixed"
              top={{base: '85%', md: '75%'}}
              left="50%"
              transform="translate(-50%, -50%)"
              w="100%"
              textAlign="center"
            >
              <Text fontSize={{base: 'md', md: 'xl'}} fontWeight="bold">
                Espera un momento estoy generando tu artículo 🤖 ❤️
                <br />
                <Text
                  as="span"
                  fontWeight="light"
                  fontSize={{base: 'sm', md: 'md'}}
                >
                  {' '}
                  (Puede tardar unos segundos dependiendo de la cantidad de palabras y lo interesante que sea el tema)
                </Text>
                <br />
                <Text
                  mt={4}
                  as="span"
                  fontWeight="light"
                  fontSize={{base: 'sm', md: 'md'}}
                  animation={`typing 5s steps(${loadingText.length}), blink-caret .75s step-end infinite`}
                  bgGradient="linear(to-l, #7928CA,#FF0080)"
                  bgClip="text"
                >
                  {' '}
                  {loadingText}
                </Text>
              </Text>

            </Box>
          </Container>
        </Box>
      )}
    </>
  );
}
