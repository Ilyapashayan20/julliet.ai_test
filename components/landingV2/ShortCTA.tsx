import { useLandingStore } from '@/lib/store';
import {
  Box,
  Center,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  useBreakpointValue
} from '@chakra-ui/react';

import CTAButton from './CTAButton';

const ShortCTA = ({ bgColor, color, colorMode, ...props }: any) => {
  const store = useLandingStore();
  return (
    <Box as="section" bgColor={bgColor} color={color} {...props}>
      <Container py={{ base: '0', md: '10' }}>
        <Stack spacing={{ base: '8', md: '14' }}>
          <Stack spacing={{ base: '8', md: '8' }} align="center">
            <Center>
              <Text
                fontSize="sm"
                fontWeight="light"
                border="1px solid white"
                w="230px"
                rounded="full"
                color={{ light: 'gray.700', dark: 'gray.300' }}
                opacity="0.8"
                boxShadow="brand-600"
                p={1}
                textAlign="center"
              >
                Más visibilidad en{' '}
                <Text as="span" color="red.400">
                  Buscadores
                </Text>
              </Text>
            </Center>
            <Heading size={useBreakpointValue({ base: 'sm', md: 'lg' })}>
              ¿Quieres
              <Text
                as="span"
                color="brand.400"
                bgClip="text"
                bgGradient="linear(to-r, brand.400, brand.600, brand.300)"
                filter="drop-shadow(0px 0px 20px var(--chakra-colors-brand-400))"
              >
                {' '}
                Incrementar{' '}
              </Text>
              las visitas en tu sitio web?
            </Heading>
            <Text
              color="muted"
              maxW="2xl"
              textAlign="center"
              fontSize={{ base: 'md', md: 'xl' }}
            >
              El contenido es el rey y
              <Text as="span" color="brand.400">
                {' '}
                Julliet{' '}
              </Text>
              te ayuda a crearlo, empieza a generar contenido de calidad para
              tus redes sociales y blogs.
            </Text>
          </Stack>
          <Stack
            spacing="3"
            direction={{ base: 'column', sm: 'row' }}
            justify="center"
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                store.onModalOpen();
              }}
            >
              Ver un demo de 1 minuto
            </Button>
            <CTAButton w={{ base: 'full', sm: '250px' }} size="lg">
              Comienza ahora →
            </CTAButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default ShortCTA;
