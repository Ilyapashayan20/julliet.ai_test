import {
  AspectRatio,
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import WriterTech2 from '@/images/landing/writer-tech-2.jpeg';
import Image from 'next/image';
import CTAButton from '@/components/landingV2/CTAButton';

const BigCTA = ({bgColor, color, colorMode, ...props}: any) => {
  return (
    <Box bgColor={bgColor} color={color} {...props}>
      <Container py={{base: '16', md: '24'}}>
        <Stack
          direction={{base: 'column', md: 'row'}}
          spacing={{base: '12', lg: '16'}}
        >
          <Stack
            spacing={{base: '8', md: '10'}}
            width="full"
            justify="center"
          >
            <Stack spacing={{base: '4', md: '6'}}>
              <Heading size={useBreakpointValue({base: 'md', md: 'lg'})}>
                ¿Sabías que nuestros clientes escriben hasta
                <Text
                  as="span"
                  color="brand.400"
                  bgClip="text"
                  bgGradient="linear(to-r, brand.400, brand.600, brand.300)"
                  filter="drop-shadow(0px 0px 20px var(--chakra-colors-brand-400))"
                >
                  {' '}
                  más de 100 artículos{' '}
                </Text>
                al día?
              </Heading>
              <Text fontSize={{base: 'lg', md: 'xl'}} color="muted">
                Esto les permite ahorrar tiempo y dinero, y enfocarse en
                tareas más importantes.
              </Text>
            </Stack>
            <Stack
              direction={{base: 'column-reverse', md: 'row'}}
              spacing="3"
            >
              <CTAButton w="full">Comienza gratis →</CTAButton>
            </Stack>
          </Stack>
          <Image
            width={700}
            quality={80}
            src={WriterTech2}
            alt="Escritor con laptop"
            style={{
              borderRadius: '2rem'
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default BigCTA;
