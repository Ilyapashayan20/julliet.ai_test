import {
  Box,
  Container,
  Flex,
  StackDivider,
  useColorModeValue,
  DrawerHeader,
  DrawerBody,
  Icon,
  Text,
  HStack,
  DrawerOverlay,
  Drawer,
  DrawerContent,
  useBreakpointValue,
  useColorMode,
  Button,
  ButtonGroup,
  IconButton,
  useDisclosure,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  DarkMode,
  LightMode
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { headerLinks, navBarData, NavData } from './data';
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import Logo from '@/components/ui/LogoV2';
import { useRef } from 'react';
import { useUser } from '@/lib/utils/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const NavBar = ({ bgColor, color, colorMode }: any) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { toggleColorMode } = useColorMode();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  return (
    <>
      {isDesktop ? (
        <NavBarDesktop
          router={router}
          supabase={supabaseClient}
          user={user}
          bgColor={bgColor}
          color={color}
          colorMode={colorMode}
        />
      ) : (
        <NavBarMobile
          router={router}
          supabase={supabaseClient}
          user={user}
          bgColor={bgColor}
          color={color}
          colorMode={colorMode}
        />
      )}
    </>
  );
};

const NavBarDesktop = ({
  bgColor,
  color,
  colorMode,
  user,
  supabase,
  router
}: any) => {
  return (
    <Box as="section">
      <Box as="nav" bgColor={bgColor} color={color}>
        <Container py={{ base: '4', md: '8', lg: '8' }}>
          <HStack spacing="10" justify="space-between">
            <Logo colorMode={colorMode} mb={1.5} />
            <Flex justify="space-between" flex="1">
              <ButtonGroup variant="link" spacing="8" mt="1">
                {headerLinks.map((item) => (
                  <NextLink href={item.href} key={item.title} scroll={false}>
                    <Button key={item.title} color={color}>
                      {item.title}
                    </Button>
                  </NextLink>
                ))}
              </ButtonGroup>
              <HStack spacing="3">
                {/* <IconButton */}
                {/*   variant="ghost" */}
                {/*   icon={colorMode === 'light' ? <FiMoon /> : <FiSun />} */}
                {/*   aria-label="Toggle color mode" */}
                {/*   onClick={toggleColorMode} */}
                {/* /> */}
                {user ? (
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push('/');
                    }}
                  >
                    Cerrar sesión
                  </Button>
                ) : (
                  <NextLink href="/login" passHref>
                    <Button
                      as="div"
                      color="gray.200"
                      variant="ghost"
                      _hover={{ bgColor: 'brand.600' }}
                    >
                      Acceder
                    </Button>
                  </NextLink>
                )}

                {user ? (
                  <NextLink href="/app/docs" passHref>
                    <Button as="div" color="white" bgColor="brand.400">
                      Ir a la app 🚀
                    </Button>
                  </NextLink>
                ) : (
                  <NextLink href="/register" passHref>
                    <Button
                      as="div"
                      color="white"
                      bgColor="brand.400"
                      _hover={{ bgColor: 'brand.600' }}
                    >
                      Comienza gratis
                    </Button>
                  </NextLink>
                )}
              </HStack>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

const NavBarDrawer = (props: any) => {
  const { isOpen, onClose, user } = props;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const supabase = useSupabaseClient();
  const router = useRouter();

  return (
    <Drawer
      placement="left"
      initialFocusRef={menuButtonRef}
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader padding="0">
          <NavLayout
            onClickMenu={onClose}
            isMenuOpen={isOpen}
            menuButtonRef={menuButtonRef}
          />
        </DrawerHeader>
        <DrawerBody>
          <NavAccordion data={navBarData} />
          <HStack mt="6" justify="center">
            {user ? (
              <Button
                flex="1"
                borderColor="brand.400"
                color="brand.400"
                variant="outline"
                fontWeight="semibold"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }}
              >
                Cerrar sesión
              </Button>
            ) : (
              <NextLink href="/login" passHref>
                <Button
                  flex="1"
                  colorScheme="ping"
                  fontWeight="semibold"
                  color="white"
                >
                  Acceder
                </Button>
              </NextLink>
            )}
            {user ? (
              <NextLink href="/app/docs" passHref>
                <Button
                  flex="1"
                  fontWeight="semibold"
                  color="white"
                  bgColor="brand.400"
                >
                  Ir a la app 🚀
                </Button>
              </NextLink>
            ) : (
              <NextLink href="/register" passHref>
                <Button
                  flex="1"
                  fontWeight="semibold"
                  color="white"
                  bgColor="brand.400"
                  _hover={{ bgColor: 'brand.600' }}
                >
                  Comienza gratis
                </Button>
              </NextLink>
            )}
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const NavBarMobile = ({
  bgColor,
  color,
  user,
  supabase,
  router,
  colorMode
}: any) => {
  const colorConfig = useColorMode();
  colorMode = colorMode || colorConfig.colorMode;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="section">
      <Box as="nav" bgColor={bgColor} color={color}>
        <NavLayout
          onClickMenu={onOpen}
          isMenuOpen={isOpen}
          onToggleMode={colorConfig.toggleColorMode}
          colorMode={colorMode}
        />
        <DarkMode>
          <NavBarDrawer isOpen={isOpen} onClose={onClose} user={user} />
        </DarkMode>
      </Box>
    </Box>
  );
};

type NavLinkProps = {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
};

const NavLink = (props: NavLinkProps) => {
  const { href, icon, children } = props;
  return (
    <Link href={href} _hover={{ textDecoration: 'none' }}>
      <HStack py="3" spacing="3">
        <Icon color="accent" as={icon} fontSize="xl" />
        <Text fontWeight="medium">{children}</Text>
      </HStack>
    </Link>
  );
};

type NavAccordionProps = {
  data: NavData;
};

export const NavAccordion = (props: NavAccordionProps) => {
  const { data } = props;
  return (
    <Accordion allowMultiple as="ul" listStyleType="none">
      {data.map((group) => (
        <AccordionItem key={group.title} as="li">
          <AccordionButton py="3" px="0">
            <Box
              flex="1"
              textAlign="start"
              fontSize="lg"
              fontWeight="semibold"
              color="gray.100"
            >
              {group.title}
            </Box>
            <AccordionIcon fontSize="3xl" />
          </AccordionButton>
          <AccordionPanel pb="3" px="0" pt="0" color="gray.100">
            {group.items.map((item, index) => (
              <NavLink key={index} href={item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

type NavLayoutProps = {
  onClickMenu?: VoidFunction;
  onToggleMode?: VoidFunction;
  isMenuOpen: boolean;
  menuButtonRef?: React.RefObject<HTMLButtonElement>;
  colorMode?: string;
};

const NavLayout = (props: NavLayoutProps) => {
  const { onClickMenu, onToggleMode, isMenuOpen, menuButtonRef } = props;
  let { colorMode } = props;
  const MenuIcon = isMenuOpen ? MdClose : FiMenu;
  const colorModeResponse = useColorMode();
  colorMode = colorMode || colorModeResponse.colorMode;

  return (
    <Flex height="16" align="center" justify="space-between" px="5">
      <Logo w={200} colorMode={colorMode} />
      <HStack divider={<StackDivider height="6" alignSelf="unset" />}>
        {/* <IconButton */}
        {/*   variant="ghost" */}
        {/*   icon={<Icon as={FiSun} fontSize="xl" />} */}
        {/*   aria-label="Toggle color mode" */}
        {/*   onClick={toggleColorMode} */}
        {/* /> */}
        <IconButton
          ref={menuButtonRef}
          variant="ghost"
          icon={<Icon as={MenuIcon} fontSize="2xl" />}
          aria-label="Open Menu"
          onClick={onClickMenu}
        />
      </HStack>
    </Flex>
  );
};

export default NavBar;
