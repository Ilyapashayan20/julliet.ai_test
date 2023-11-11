import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  HStack,
  Input,
  Stack,
  StackProps,
  Text,
  useBreakpointValue,
  Divider,
  useColorMode
} from '@chakra-ui/react';
import Logo from '@/components/ui/LogoV2';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { FormEvent, useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Provider } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

export const SignInForm = (props: StackProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    type: '',
    content: ''
  });
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const user = useUser();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (user) {
      router.push('/app/docs');
    }
  }, [user]);

  const { colorMode } = useColorMode();
  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage({});

    let error;
    const res = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://www.julliet.ai/app/docs' }
    });
    error = res.error;

    if (error) {
      setMessage({ type: 'error', content: error.message });
    }

    setMessage({
      type: 'note',
      content: 'Revisa tu correo para continuar'
    });
    setLoading(false);
  };

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
  };

  const handleOAuthSignIn = async (provider: Provider) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getURL()
      }
    });
    if (error) {
      setMessage({ type: 'error', content: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (email) {
      const val = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setIsValidEmail(val);
    }
  }, [email]);

  console.log('login', colorMode);
  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="6">
        {isMobile && <Logo colorMode={colorMode} />}
        <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
          <Heading
            size={{ base: 'xs', md: 'sm' }}
            color={{ light: 'gray.700', dark: 'gray.200' }}
          >
            Inicia sesión en tu cuenta
          </Heading>
          <HStack spacing="1" justify="center">
            <Text color={{ light: 'gray.500', dark: 'gray.400' }}>
              Hola 👋 <br />
              Solo necesitas tu correo electrónico
            </Text>
          </HStack>
        </Stack>
      </Stack>
      <Stack spacing="6">
        <Stack spacing="5">
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              placeholder="fernando@julliet.ai"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!isValidEmail}
              _placeholder={{ color: 'gray.500' }}
            />
          </FormControl>
        </Stack>
        <Stack spacing="4">
          {message.content && (
            <Text
              border="2px"
              borderColor={message.type === 'error' ? 'pink.500' : 'green.500'}
              rounded="md"
              color={message.type === 'error' ? 'pink.500' : 'green.500'}
              fontWeight="medium"
              p="2"
              textAlign="center"
            >
              {message.content}
            </Text>
          )}
          <Button
            bg="brand.600"
            color="white"
            isLoading={loading}
            loadingText="Iniciando sesión"
            onClick={(e: any) => handleSignin(e)}
            isDisabled={!isValidEmail}
            _hover={{
              bg: 'brand.400'
            }}
          >
            Enviar link mágico ➜
          </Button>{' '}
          <HStack>
            <Divider />
            <Text fontSize="sm" color="muted">
              O
            </Text>
            <Divider />
          </HStack>
          <Button
            variant="secondary"
            leftIcon={<Icon as={FcGoogle} boxSize="5" />}
            iconSpacing="3"
            onClick={() => handleOAuthSignIn('google')}
          >
            Iniciar sesión con Google
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Icon as={FaTwitter} boxSize="5" color="#1DA1F2" />}
            iconSpacing="3"
            onClick={() => handleOAuthSignIn('twitter')}
          >
            Iniciar sesión con Twitter
          </Button>
          <Button
            variant="secondary"
            leftIcon={
              <Icon as={FaGithub} boxSize="5" color={{ dark: 'white' }} />
            }
            iconSpacing="3"
            onClick={() => handleOAuthSignIn('github')}
          >
            Iniciar sesión con Github
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
