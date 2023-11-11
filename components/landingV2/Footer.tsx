import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Divider,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Stack,
  Text
} from '@chakra-ui/react';
import { footerLinks } from '@/components/landingV2/data';
import LogoV2 from '../ui/LogoV2';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import { fetchNewsletterSubscribe } from '@/lib/fetchers';
import { useEffect, useState } from 'react';

const Footer = ({ bgColor, color, colorMode, ...props }: any) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleSubscribe = () => {
    if (!email) return;
    fetchNewsletterSubscribe({
      email: email
    })
      .then((res) => {
        alert('Thank you for subscribing!');
      })
      .catch((err) => {
        alert('Something went wrong. Please try again later.');
      });
  };

  useEffect(() => {
    if (email) {
      const val = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setIsValidEmail(val);
    }
  }, [email]);

  return (
    <Box bgColor={bgColor} color={color} {...props}>
      <Container as="footer" role="contentinfo">
        <Stack
          spacing={{ base: '12', md: '8' }}
          direction={{ base: 'column-reverse', lg: 'row' }}
          py={{ base: '12', md: '16' }}
          justify="space-between"
        >
          <SimpleGrid
            columns={{ base: 2, md: 4 }}
            gap="8"
            width={{ base: 'full', lg: 'auto' }}
          >
            {footerLinks.map((group, idx) => (
              <Stack key={idx} spacing="4" minW={{ lg: '40' }}>
                <Text fontSize="sm" fontWeight="semibold" color="white">
                  {group.title}
                </Text>
                <Stack spacing="3" shouldWrapChildren>
                  {group.links.map((link, idx) => (
                    <Button
                      key={idx}
                      as="a"
                      variant="link"
                      href={link.href}
                      color="gray.100"
                    >
                      {link.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            ))}
          </SimpleGrid>
          <Stack spacing="4">
            <Text fontSize="sm" fontWeight="semibold" color="white">
              Mantente al día
            </Text>
            <Stack
              spacing="4"
              direction={{ base: 'column', sm: 'row' }}
              maxW={{ lg: '360px' }}
            >
              <Input
                placeholder="Tu correo"
                type="email"
                required
                isInvalid={!isValidEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="primary"
                bgColor="brand.400"
                color="white"
                type="submit"
                flexShrink={0}
                isDisabled={!isValidEmail || !email}
                onClick={() => handleSubscribe()}
              >
                Suscribirse
              </Button>
            </Stack>
            {!isValidEmail && (
              <Text fontSize="sm" color="red.500">
                Por favor ingresa un correo válido
              </Text>
            )}
          </Stack>
        </Stack>
        <Divider />
        <Stack
          pb="12"
          pt="8"
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'start', md: 'center' }}
        >
          <HStack
            justify={{ base: 'space-between', sm: 'start' }}
            width={{ base: 'full', sm: 'auto' }}
            spacing="8"
          >
            <LogoV2 colorMode={colorMode} />
            <ButtonGroup variant="ghost">
              <IconButton
                as="a"
                target="_blank"
                href="https://www.linkedin.com/company/julliet-ai/"
                aria-label="LinkedIn"
                icon={<FaLinkedin fontSize="1.25rem" />}
              />
              <IconButton
                as="a"
                target="_blank"
                href="https://twitter.com/jullietai"
                aria-label="Twitter"
                icon={<FaTwitter fontSize="1.25rem" />}
              />
            </ButtonGroup>
          </HStack>
          <Center mb="10">Hecho con ❤️ en LATAM</Center>
          <Text fontSize="sm" color="gray.100">
            &copy; {new Date().getFullYear()} Julliet is property of Crubing,
            LLC. All rights reserved.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
