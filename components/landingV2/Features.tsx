import {
  Box,
  useBreakpointValue,
  Container,
  Stack,
  Text,
  Square,
  Heading,
  Icon,
  AspectRatio,
  Show,
  Hide,
  Center
} from '@chakra-ui/react';
import Image from 'next/image';
import WriterTech from '@/images/landing/writer-tech.jpeg';

import { features } from '@/components/landingV2/data';

const Features = ({ bgColor, color, colorMode, ...props }: any) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <Box id="features" as="section" bgColor={bgColor} color={color} {...props}>
      <Container py={{ base: '16', md: '24' }}>
        <Stack spacing={{ base: '12', md: '16' }}>
          <Stack spacing={{ base: '4', md: '5' }} maxW="3xl">
            <Stack spacing="3">
              {isDesktop ? (
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="semibold"
                  color="brand.400"
                  border="1px solid"
                  w="fit-content"
                  px="4"
                  borderRadius="full"
                  filter="drop-shadow(0px 0px 20px var(--chakra-colors-brand-400))"
                >
                  Características de Julliet 🙋🏻‍♀️
                </Text>
              ) : (
                <Center>
                  <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="semibold"
                    color="brand.400"
                    border="1px solid"
                    w="fit-content"
                    px="4"
                    borderRadius="full"
                    filter="drop-shadow(0px 0px 20px var(--chakra-colors-brand-400))"
                  >
                    Características de Julliet 🙋🏻‍♀️
                  </Text>
                </Center>
              )}
              <Heading size={useBreakpointValue({ base: 'sm', md: 'md' })}>
                ¿Qué hará Julliet por ti?
              </Heading>
            </Stack>
            <Text color="muted" fontSize={{ base: 'lg', md: 'xl' }}>
              Julliet es una IA que te ayuda a escribir de forma más natural y
              efectiva en más de 20 idiomas y en segundos{' '}
              <Text
                as="a"
                href="https://jullietv.blog"
                target="_blank"
                color="brand.400"
                textDecoration="underline"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                Contenido de ejemplo
              </Text>
            </Text>
          </Stack>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: '12', lg: '16' }}
          >
            <Stack
              spacing={{ base: '10', md: '12' }}
              maxW="xl"
              justify="center"
              width="full"
            >
              {features.map((feature) => (
                <Stack key={feature.name} spacing="4" direction="row">
                  <Square
                    size={{ base: '10', md: '12' }}
                    bg="primary.500"
                    color={colorMode === 'light' ? 'white' : 'gray.900'}
                    borderRadius="lg"
                  >
                    <Icon as={feature.icon} boxSize={{ base: '5', md: '6' }} />
                  </Square>
                  <Stack
                    spacing={{ base: '4', md: '5' }}
                    pt={{ base: '1.5', md: '2.5' }}
                  >
                    <Stack spacing={{ base: '1', md: '2' }}>
                      <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        fontWeight="medium"
                      >
                        {feature.name}
                      </Text>
                      <Text color="muted">{feature.description}</Text>
                    </Stack>
                    {/* <Button */}
                    {/*   variant="link" */}
                    {/*   colorScheme="purple" */}
                    {/*   rightIcon={<FiArrowRight fontSize="1.25rem" />} */}
                    {/*   alignSelf="start" */}
                    {/* > */}
                    {/*   Read more */}
                    {/* </Button> */}
                  </Stack>
                </Stack>
              ))}
            </Stack>
            {isDesktop && (
              <Box position="relative" width="full" height="full" left="100">
                <AspectRatio maxH="580px" ratio={1}>
                  <Image
                    src={WriterTech}
                    alt="Escritor con laptop"
                    quality={80}
                    style={{
                      borderRadius: '2rem'
                    }}
                  />
                </AspectRatio>
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Features;
