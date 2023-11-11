import {
  Divider,
  Flex,
  Stack,
  useBreakpointValue,
  useColorMode
} from '@chakra-ui/react';
import {useSupabaseClient} from '@supabase/auth-helpers-react';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {
  MdArrowBack,
  MdArrowForward,
  MdAttachMoney,
  MdFeedback
} from 'react-icons/md';
import Logo from '@/components/ui/LogoV2';
import {NavButton} from './NavButton';
import {UserProfile} from './UserProfile';

import {useAppStore} from '@/lib/store';
import {useUser} from '@/lib/utils/useUser';

export const Sidebar = ({paths}: any) => {
  const router = useRouter();
  const {user, isPro} = useUser();
  const appStore = useAppStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {colorMode} = useColorMode();


  useEffect(() => {
    const _isCollapsed = window.localStorage.getItem('isCollapsed');
    setIsCollapsed(_isCollapsed === 'true');
    appStore.setSidebarOpen(_isCollapsed === 'true' ? false : true);
  }, []);

  const handleIsCollapsed = () => {
    window.localStorage.setItem('isCollapsed', !isCollapsed ? 'true' : 'false');
    appStore.setSidebarOpen(isCollapsed);
    setIsCollapsed(!isCollapsed);
  };

  const isDesktop = useBreakpointValue({base: false, md: true});

  return (
    <>
      <Flex
        maxW="full"
        w={isDesktop ? {base: !isCollapsed ? '270px' : '90px'} : 'full'}
        h="full"
        py={{base: '4', sm: '8'}}
        px={{base: '2', sm: '6'}}
        borderRight="1px"
        borderRightColor="gray.200"
        id="sidebar"
      >
        <Stack justify="space-between" spacing="1">
          <Stack spacing={{base: '5', sm: '6'}} shouldWrapChildren>
            <Logo
              href="/app/docs"
              imagotype={isDesktop && isCollapsed ? 'true' : undefined}
              layout="fill"
              colorMode={colorMode}
              ml="-2"
            />
            <UserProfile
              isCollapsed={isCollapsed}
              name={user?.user_metadata.full_name}
              image={user?.user_metadata.avatar_url}
              email={user?.email as string}
            />
            <Divider borderColor="on-accent-muted" w="100%" />
            <Stack
              spacing="1"
              mt="4"
              w={isDesktop && isCollapsed ? '55px' : 56}
            >
              {paths.map((path: any) => (
                <NavButton
                  key={path.name}
                  label={path.name}
                  icon={path.icon}
                  isActive={router.pathname.includes(path.path)}
                  href={path.path}
                  showText={!isCollapsed}
                  isDesktop={isDesktop}
                  showProBadge={path.isPro && !isPro}
                />
              ))}
            </Stack>
          </Stack>
          <Stack spacing={{base: '5', sm: '6'}}>
            <Stack
              spacing="1"
              mt="16"
              w={isDesktop && isCollapsed ? '55px' : 56}
            >
              <NavButton
                label="Feedback"
                icon={MdFeedback}
                href="https://julliet.canny.io/new-features"
                target="_blank"
                showText={!isCollapsed}
                isActive={false}
                isDesktop={isDesktop}
              />
              <NavButton
                label="Suscripción"
                icon={MdAttachMoney}
                href="/app/billing"
                showText={!isCollapsed}
                isDesktop={isDesktop}
                isActive={router.pathname.includes('/app/billing')}
              />
            </Stack>
            {/* <Box bg="bg-accent-subtle" px="4" py="5" borderRadius="lg"> */}
            {/*   <Stack spacing="4"> */}
            {/*     <Stack spacing="1"> */}
            {/*       <Text fontSize="sm" fontWeight="medium"> */}
            {/*         Almost there */}
            {/*       </Text> */}
            {/*       <Text fontSize="sm" color="on-accent-muted"> */}
            {/*         Fill in some more information about you and your person. */}
            {/*       </Text> */}
            {/*     </Stack> */}
            {/*     <Progress */}
            {/*       value={80} */}
            {/*       size="sm" */}
            {/*       variant="on-accent" */}
            {/*       aria-label="Profile Update Progress" */}
            {/*     /> */}
            {/*     <HStack spacing="3"> */}
            {/*       <Button */}
            {/*         variant="link-on-accent" */}
            {/*         size="sm" */}
            {/*         color="on-accent-muted" */}
            {/*       > */}
            {/*         Dismiss */}
            {/*       </Button> */}
            {/*       <Button variant="link-on-accent" size="sm"> */}
            {/*         Update profile */}
            {/*       </Button> */}
            {/*     </HStack> */}
            {/*   </Stack> */}
            {/* </Box> */}
            {isDesktop && (
              <>
                <Divider borderColor="on-accent-muted" w="100%" />
                <NavButton
                  justifyContent="center"
                  textAlign="center"
                  bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
                  label=""
                  icon={isCollapsed ? MdArrowForward : MdArrowBack}
                  href="#"
                  showText={!isCollapsed}
                  isDesktop={isDesktop}
                  onClick={() => handleIsCollapsed()}
                />
              </>
            )}
          </Stack>
        </Stack>
      </Flex>
    </>
  );
};
