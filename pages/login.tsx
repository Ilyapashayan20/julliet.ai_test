import {
  Avatar,
  AvatarGroup,
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue as mode
} from '@chakra-ui/react';
import Image from 'next/image';
import {SignInForm} from '@/components/app/features/login/SignInForm';
import {NextSeo} from 'next-seo';
import React, {useEffect} from 'react';
import NextAvatar from '@/components/ui/NextAvatar';

export default function LoginPage() {
  const [title, setTitle] = React.useState('Login');
  const [description, setDescription] = React.useState('Login to your account');

  useEffect(() => {
    const url = window.location.href;

    if (url.includes('login')) {
      setTitle('Iniciar sesión');
      setDescription('Inicia sesión en tu cuenta');
    } else {
      setTitle('Registro');
      setDescription('Regístrate en tu cuenta');
    }
  });

  return (
    <>
      <NextSeo
        title={`Julliet | ${title}`}
        description={description}
        canonical="https://julliet.com/login"
      />

      <Flex
        minH={{base: 'auto', md: '100vh'}}
        bgGradient={{
          md: mode(
            'linear(to-r, primary.700 50%, white 50%)',
            'linear(to-r, primary.700 50%, gray.800 50%)'
          )
        }}
      >
        <Flex maxW="8xl" mx="auto" width="full">
          <Box flex="1" display={{base: 'none', md: 'block'}}>
            <Flex
              direction="column"
              px={{base: '4', md: '8'}}
              height="full"
              color="on-accent"
            >
              <Flex align="center" h="24">
                <Image
                  width="180"
                  height="64"
                  src="/logo/julliet-3d-logo-white.svg"
                  alt="Logo"
                />
              </Flex>
              <Flex flex="1" align="center">
                <Stack spacing="8">
                  <Stack spacing="6">
                    <Heading size={{md: 'lg', xl: 'xl'}}>
                      Comienza a escríbir tu historia hoy
                    </Heading>
                    <Text fontSize="lg" maxW="md" fontWeight="medium">
                      Julliet esta aquí para acompañarte durante todo el
                      proceso.
                    </Text>
                  </Stack>
                  <HStack spacing="4">
                    <HStack spacing="-3">
                      {[
                        'https://i.pravatar.cc/100?img=11',
                        'https://i.pravatar.cc/100?img=12',
                        'https://i.pravatar.cc/100?img=13',
                        'https://i.pravatar.cc/100?img=14',
                        'https://i.pravatar.cc/100?img=15',
                        'https://i.pravatar.cc/100?img=16',
                        'https://i.pravatar.cc/100?img=17',
                        'https://i.pravatar.cc/100?img=18',
                      ].map((item) => (
                        <NextAvatar
                          key={item}
                          name={item}
                          src={item}
                          w={9}
                        />
                      ))}
                    </HStack>
                    <Text fontWeight="medium">
                      Más de
                      <Text
                        as="span"
                        color="white"
                        mx="1"
                        fontWeight="bold"
                      >
                        15.000+
                      </Text>
                      profesionales ya están usando Julliet
                    </Text>
                  </HStack>
                </Stack>
              </Flex>
              <Flex align="center" h="24">
                <Text color="white" fontSize="sm">
                  © 2023 Crubing LLC. All rights reserved.
                </Text>
              </Flex>
            </Flex>
          </Box>
          <Center flex="1">
            <SignInForm
              px={{base: '4', md: '8'}}
              py={{base: '12', md: '48'}}
              width="full"
              maxW="md"
            />
          </Center>
        </Flex>
      </Flex>
    </>
  );
}
