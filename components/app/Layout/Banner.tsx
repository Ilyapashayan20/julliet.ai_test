import {
  Box,
  Stack,
  Text,
  Square,
  useBreakpointValue,
  useColorModeValue,
  useColorMode
} from '@chakra-ui/react';
import Image from 'next/image';

import Wink from '@/images/julliet.ai-wink.png';
import Sad from '@/images/julliet.ai-sad.png';
import CTAButton from '@/components/landingV2/CTAButton';

const Banner = ({ credits, isPro, ...props }: any) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { colorMode } = useColorMode();

  const squareFilter =
    colorMode == 'dark'
      ? 'drop-shadow(0px 0px 20px var(--chakra-colors-whiteAlpha-300)) brightness(1.2)'
      : 'drop-shadow(0px 0px 12px var(--chakra-colors-brand-600)) brightness(1.2)';

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      py={{ base: '4', md: '2.5' }}
      px={{ base: '4', md: '4' }}
      borderRadius="xl"
      width="fit-content"
      mb="2"
      border="2px"
      borderColor="gray.300"
      shadow="md"
      {...props}
    >
      <Stack mr="4" spacing="4" direction={{ base: 'column', md: 'row' }}>
        <Stack
          direction={{ base: 'row', md: 'row' }}
          spacing={{ base: '8', md: '6' }}
          pe={{ base: '4', sm: '0' }}
          align={{ base: 'start', md: 'center' }}
        >
          <Square size="12" borderRadius="md" filter={squareFilter}>
            <Image
              src={isPro ? Wink : Sad}
              alt={false ? 'Julliet.ai winks' : 'Julliet.ai sad'}
              width={512}
              quality={50}
              height={512}
            />
          </Square>
          {isPro ? (
            <Text fontWeight="medium">
              ¡Eres un PRO y tienes acceso ilimitado a Julliet.ai!
              <Text as="span" fontWeight="bold" color="brand.400">
                {' '}
                ¡Disfrútalo!
              </Text>
            </Text>
          ) : (
            <Text fontWeight="medium">
              Te quedan{' '}
              <Text as="span" fontWeight="bold" color="brand.400">
                {credits}
              </Text>{' '}
              créditos ¡Hazte PRO y obtén acceso ilimitado a Julliet!
            </Text>
          )}
        </Stack>
        {!isPro && (
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={{ base: '3', sm: '2' }}
            align={{ base: 'stretch', sm: 'center' }}
          >
            <CTAButton
              width={{ base: '150px', sm: '150px' }}
              href="/app/billing"
            >
              Suscríbete ahora
            </CTAButton>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default Banner;
