import {Box, Container, keyframes, Link, Stack, Text} from '@chakra-ui/react';
import NextLink from 'next/link';

const bgGradientAnimation = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

export const TopBanner = () => {
  return (
    <Box as="section">
      <Box
        bg="bg-accent"
        color="on-accent"
        position="fixed"
        top="0"
        left="0"
        w="full"
        zIndex="9999999"
        bgGradient="linear(to-r, brand.200, brand.600, brand.400)"
        backgroundSize="300% 300%"
        animation={`${bgGradientAnimation} 15s ease infinite`}
      >
        <Container py={{base: '2', md: '1'}}>
          <Stack
            direction={{base: 'column', md: 'row'}}
            justify="center"
            spacing={{base: '0.5', md: '1.5'}}
            pe={{base: '4', sm: '0'}}
          >
            <NextLink href="/app/billing" passHref>
              <Text
                fontWeight="medium"
                fontSize={{base: 'sm', md: 'md'}}
                textAlign={{base: 'center', md: 'left'}}
              >
                👉🏻 Crea {' '}
                <Text
                  as="b"
                  fontWeight="extrabold"
                  fontSize={{base: 'md', md: 'lg'}}
                >
                  artículos infinitos
                </Text> {' '}
                y accede a todas las funciones de Julliet.
                <Link
                  as="span"
                  fontSize={{base: 'md', md: 'lg'}}
                  fontWeight="extrabold"
                  color="white"
                  ml="1">
                  {'  '}
                  ¡Hora de ser PRO!
                </Link>
                {'  '}
                👈🏻
              </Text>
            </NextLink>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
